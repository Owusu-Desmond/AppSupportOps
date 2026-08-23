<?php

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Illuminate\Support\Carbon;

test('unauthenticated users cannot access activity endpoints', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->post(route('activities.store'), ['title' => 'Test'])->assertRedirect(route('login'));
    $this->get(route('activities.report'))->assertRedirect(route('login'));
});

test('authenticated user can view daily handover dashboard containing today activities', function () {
    $user = User::factory()->create();

    // Today's activity
    $todayActivity = Activity::factory()->create([
        'title' => 'Daily SMS count check',
        'created_by' => $user->id,
        'created_at' => Carbon::today(),
    ]);

    // Past activity
    $pastActivity = Activity::factory()->create([
        'title' => 'Past SMS check',
        'created_by' => $user->id,
        'created_at' => Carbon::yesterday(),
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->has('activities', 1)
        ->where('activities.0.id', $todayActivity->id)
        ->where('activities.0.creator.name', $user->name)
    );
});

test('storing an activity captures authenticated user id and logs initial update', function () {
    $user = User::factory()->create();

    $payload = [
        'title' => 'Daily SMS count in comparison to SMScount from logs',
        'description' => 'Verify log file count matches DB SMS table',
        'status' => 'pending',
        'remarks' => 'Verification started',
    ];

    $response = $this->actingAs($user)->post(route('activities.store'), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('activities', [
        'title' => $payload['title'],
        'created_by' => $user->id,
    ]);

    $activity = Activity::where('title', $payload['title'])->first();

    $this->assertDatabaseHas('activity_updates', [
        'activity_id' => $activity->id,
        'user_id' => $user->id,
        'status' => 'pending',
        'remarks' => 'Verification started',
    ]);
});

test('updating an activity logs audit entry with personnel id and timestamp', function () {
    $user = User::factory()->create();
    $activity = Activity::factory()->create(['created_by' => $user->id]);

    $updatePayload = [
        'status' => 'done',
        'remarks' => 'Reconciled SMS logs and confirmed match.',
    ];

    $response = $this->actingAs($user)->patch(route('activities.update', $activity), $updatePayload);

    $response->assertRedirect();

    $this->assertDatabaseHas('activity_updates', [
        'activity_id' => $activity->id,
        'user_id' => $user->id,
        'status' => 'done',
        'remarks' => 'Reconciled SMS logs and confirmed match.',
    ]);
});

test('historical report filters activities by custom date range', function () {
    $user = User::factory()->create();

    $inRangeActivity = Activity::factory()->create([
        'title' => 'In range activity',
        'created_by' => $user->id,
        'created_at' => Carbon::parse('2026-08-10 10:00:00'),
    ]);

    $outOfRangeActivity = Activity::factory()->create([
        'title' => 'Out of range activity',
        'created_by' => $user->id,
        'created_at' => Carbon::parse('2026-08-01 10:00:00'),
    ]);

    $response = $this->actingAs($user)->get(route('activities.report', [
        'start_date' => '2026-08-05',
        'end_date' => '2026-08-15',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Reports/Index')
        ->has('activities', 1)
        ->where('activities.0.id', $inRangeActivity->id)
    );
});
