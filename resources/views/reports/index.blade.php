@extends('layouts.app')

@section('title', 'Historical Reporting - AppSupport Ops')

@section('content')
<div class="max-w-container-max mx-auto">
    <!-- Page Header -->
    <div class="flex justify-between items-end mb-stack-lg">
        <div>
            <h1 class="font-headline-md text-headline-md text-on-surface mb-1">Historical Reporting</h1>
            <p class="font-body-sm text-body-sm text-secondary">Query Activity History & Personnel Logs across Custom Durations</p>
        </div>
    </div>

    <!-- Date Range Query Form Panel -->
    <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 mb-6 shadow-sm">
        <form method="GET" action="{{ route('activities.report') }}" class="flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="flex-1">
                <label class="font-label-md text-label-md text-slate-600 mb-1 block" for="start_date">Start Date</label>
                <input class="w-full h-9 px-3 rounded font-body-sm text-body-sm text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 outline-none" id="start_date" name="start_date" type="date" value="{{ request('start_date', $filters['start_date'] ?? '') }}"/>
            </div>
            <div class="flex-1">
                <label class="font-label-md text-label-md text-slate-600 mb-1 block" for="end_date">End Date</label>
                <input class="w-full h-9 px-3 rounded font-body-sm text-body-sm text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 outline-none" id="end_date" name="end_date" type="date" value="{{ request('end_date', $filters['end_date'] ?? '') }}"/>
            </div>
            <div>
                <button class="btn-primary h-9 px-6 rounded font-label-md text-label-md transition-colors" type="submit">
                    Filter History
                </button>
            </div>
        </form>
    </div>

    <!-- Data Table Container -->
    <div class="data-table-container rounded-lg shadow-sm overflow-hidden">
        <div class="px-4 py-3 bg-surface-container border-b border-outline-variant flex justify-between items-center">
            <span class="font-label-md text-label-md font-bold uppercase tracking-wider text-secondary">
                Historical Log Entries ({{ count($activities) }})
            </span>
            <span class="font-mono text-xs text-secondary">
                {{ $filters['start_date'] ?? '' }} to {{ $filters['end_date'] ?? '' }}
            </span>
        </div>

        <table class="w-full text-left border-collapse data-table">
            <thead>
                <tr>
                    <th class="font-label-md text-label-md px-4 py-3 w-5/12">Activity Description</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-2/12">Status</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-3/12">Remarks</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-2/12">Personnel</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-1/12 text-right">Timestamp</th>
                </tr>
            </thead>
            <tbody class="font-body-sm text-body-sm bg-surface-container-lowest">
                @forelse($activities as $activity)
                    @php
                        $latestUpdate = $activity->latestUpdate;
                        $isDone = ($latestUpdate?->status === 'done');
                        $updater = $latestUpdate?->user ?? $activity->creator;
                    @endphp
                    <tr class="group relative">
                        <td class="px-4 py-3 font-medium text-on-surface">
                            <div>{{ $activity->title }}</div>
                            @if($activity->description)
                                <div class="text-[11px] text-secondary font-normal truncate max-w-xs">{{ $activity->description }}</div>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            @if($isDone)
                                <span class="inline-flex items-center px-2 py-0.5 rounded-sm font-label-md text-label-md badge-success">Done</span>
                            @else
                                <span class="inline-flex items-center px-2 py-0.5 rounded-sm font-label-md text-label-md badge-pending">Pending</span>
                            @endif
                        </td>
                        <td class="px-4 py-3 text-on-surface-variant truncate max-w-[200px]" title="{{ $latestUpdate?->remarks }}">
                            {{ $latestUpdate?->remarks ?? '—' }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                                    {{ $updater?->name ? strtoupper(substr($updater->name, 0, 2)) : 'US' }}
                                </div>
                                <div>
                                    <div class="font-medium text-on-surface">{{ $updater?->name ?? 'Personnel' }}</div>
                                    <div class="text-[10px] text-secondary font-mono">{{ $updater?->email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-right font-mono text-[11px] text-secondary">
                            {{ \Carbon\Carbon::parse($activity->created_at)->format('Y-m-d H:i') }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colSpan="5" class="px-4 py-8 text-center text-secondary">
                            No historical records found for the selected date range.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
