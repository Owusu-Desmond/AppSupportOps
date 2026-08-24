<?php

namespace App\Http\Middleware;

use App\Models\ActivityUpdate;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $notifications = [];

        if ($user) {
            $notifications = ActivityUpdate::with(['activity:id,title', 'user:id,name'])
                ->where('created_at', '>=', now()->subHours(48))
                ->where('user_id', '!=', $user->id)
                ->latest()
                ->take(15)
                ->get()
                ->map(fn ($update) => [
                    'id'             => $update->id,
                    'activity_id'    => $update->activity_id,
                    'activity_title' => $update->activity?->title ?? 'Unknown Activity',
                    'actor_name'     => $update->user?->name ?? 'Someone',
                    'status'         => $update->status,
                    'remarks'        => $update->remarks,
                    'created_at'     => $update->created_at,
                ])
                ->values()
                ->all();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'notifications' => $notifications,
        ];
    }
}
