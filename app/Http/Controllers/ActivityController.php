<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityReportRequest;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    /**
     * Display the Daily Handover Dashboard.
     * Fetches all activities and status updates for today, eager-loading personnel bio details.
     */
    public function index(): Response
    {
        $today = Carbon::today();

        $activities = Activity::with([
            'creator:id,name,email',
            'latestUpdate.user:id,name,email',
            'updates.user:id,name,email',
        ])
        ->where(function ($query) use ($today) {
            $query->whereDate('created_at', $today)
                ->orWhereHas('updates', fn ($q) => $q->whereDate('created_at', $today));
        })
        ->latest()
        ->get();

        return Inertia::render('Dashboard', [
            'activities' => $activities,
            'todayDate' => $today->toFormattedDateString(),
        ]);
    }

    /**
     * Store a new daily support activity and log its initial status.
     */
    public function store(StoreActivityRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $userId = auth()->id();

        // 1. Create primary daily support activity
        $activity = Activity::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'created_by' => $userId,
        ]);

        // 2. Automatically log initial audit update linking authenticated personnel ID & exact timestamp
        ActivityUpdate::create([
            'activity_id' => $activity->id,
            'user_id' => $userId,
            'status' => $validated['status'] ?? 'pending',
            'remarks' => $validated['remarks'] ?? 'Initial activity created',
        ]);

        return redirect()->back()->with('success', 'Support activity created successfully.');
    }

    /**
     * Update an activity status and capture audit log details.
     */
    public function update(UpdateActivityRequest $request, Activity $activity): RedirectResponse
    {
        $validated = $request->validated();

        // Log audit status update linking authenticated personnel ID, status, remark, and exact timestamp
        ActivityUpdate::create([
            'activity_id' => $activity->id,
            'user_id' => auth()->id(),
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Activity status updated successfully.');
    }

    /**
     * Historical Reporting view querying activity histories by custom duration parameters.
     */
    public function report(ActivityReportRequest $request): Response
    {
        $validated = $request->validated();

        $startDate = ! empty($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : Carbon::now()->subDays(7)->startOfDay();

        $endDate = ! empty($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : Carbon::now()->endOfDay();

        $activities = Activity::with([
            'creator:id,name,email',
            'latestUpdate.user:id,name,email',
            'updates.user:id,name,email',
        ])
        ->whereBetween('created_at', [$startDate, $endDate])
        ->latest()
        ->get();

        return Inertia::render('Reports/Index', [
            'activities' => $activities,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
        ]);
    }
}

