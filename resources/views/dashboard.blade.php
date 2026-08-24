@extends('layouts.app')

@section('title', 'Daily Handover Dashboard - AppSupport Ops')

@section('content')
<div class="max-w-container-max mx-auto">
    <!-- Page Header -->
    <div class="flex justify-between items-end mb-stack-lg">
        <div>
            <h1 class="font-headline-md text-headline-md text-on-surface mb-1">Daily Handover</h1>
            <p class="font-body-sm text-body-sm text-secondary">Current Shift: {{ $todayDate ?? date('M d, Y') }}</p>
        </div>
        <button onclick="document.getElementById('create-modal').classList.remove('hidden')" class="btn-primary h-10 px-4 rounded font-label-md text-label-md flex items-center gap-2 transition-colors shadow-sm" type="button">
            <span class="material-symbols-outlined text-sm">edit_document</span>
            Log Activity
        </button>
    </div>

    <!-- Data Table Container -->
    <div class="data-table-container rounded-lg shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse data-table">
            <thead>
                <tr>
                    <th class="font-label-md text-label-md px-4 py-3 w-5/12">Activity Description</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-2/12">Status</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-3/12">Remarks</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-2/12">Personnel</th>
                    <th class="font-label-md text-label-md px-4 py-3 w-1/12 text-right">Actions</th>
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
                                    <div class="text-[10px] text-secondary font-mono">
                                        {{ $latestUpdate ? \Carbon\Carbon::parse($latestUpdate->created_at)->format('h:i A') : \Carbon\Carbon::parse($activity->created_at)->format('h:i A') }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-right">
                            <button onclick="openUpdateModal({{ json_encode($activity) }})" class="text-secondary hover:text-primary transition-colors p-1" type="button" title="Update Activity">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colSpan="5" class="px-4 py-8 text-center text-secondary">
                            No support activities logged for this shift yet.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Create Activity Modal (Stitch Design) -->
<div id="create-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onclick="document.getElementById('create-modal').classList.add('hidden')"></div>
    <div class="relative bg-surface-container-lowest rounded-xl w-full max-w-lg custom-shadow pt-2 flex flex-col z-10">
        <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
            <h2 class="font-headline-sm text-headline-sm text-on-surface">Log Support Activity</h2>
            <button onclick="document.getElementById('create-modal').classList.add('hidden')" class="text-secondary hover:text-on-surface" type="button">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <form method="POST" action="{{ route('activities.store') }}">
            @csrf
            <div class="p-6 flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600" for="title">Activity Title / Description *</label>
                    <input class="w-full h-9 px-3 rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 outline-none" id="title" name="title" required placeholder='e.g., "Daily SMS count in comparison to SMScount from logs"' type="text"/>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600" for="description">Additional Details</label>
                    <textarea class="w-full p-3 rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 outline-none resize-none" id="description" name="description" rows="2" placeholder="Operational details..."></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600">Initial Status</label>
                    <div class="flex gap-2">
                        <label class="relative flex-1 cursor-pointer">
                            <input class="peer sr-only" checked name="status" type="radio" value="pending"/>
                            <div class="h-9 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest peer-checked:bg-amber-50 peer-checked:border-amber-200 peer-checked:text-amber-900 transition-all">
                                <span class="font-body-md text-body-md flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Pending
                                </span>
                            </div>
                        </label>
                        <label class="relative flex-1 cursor-pointer">
                            <input class="peer sr-only" name="status" type="radio" value="done"/>
                            <div class="h-9 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest peer-checked:bg-emerald-50 peer-checked:border-emerald-200 peer-checked:text-emerald-900 transition-all">
                                <span class="font-body-md text-body-md flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Done
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600" for="remarks">Initial Remark</label>
                    <input class="w-full h-9 px-3 rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 outline-none" id="remarks" name="remarks" placeholder="Notes..." type="text"/>
                </div>
            </div>
            <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
                <button onclick="document.getElementById('create-modal').classList.add('hidden')" class="h-9 px-4 rounded font-body-md text-body-md font-medium text-on-surface bg-surface-container-lowest border border-slate-300 hover:bg-slate-50 transition-colors" type="button">Cancel</button>
                <button class="h-10 px-6 rounded font-body-md text-body-md font-medium text-white bg-[#1e293b] hover:bg-black transition-colors shadow-sm" type="submit">Save Activity</button>
            </div>
        </form>
    </div>
</div>

<!-- Update Activity Modal (Exact Stitch Design) -->
<div id="update-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onclick="document.getElementById('update-modal').classList.add('hidden')"></div>
    <div class="relative bg-surface-container-lowest rounded-xl w-full max-w-lg custom-shadow flex flex-col z-10" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
            <h2 class="font-headline-sm text-headline-sm text-on-surface" id="modal-title">Update Activity</h2>
            <button onclick="document.getElementById('update-modal').classList.add('hidden')" aria-label="Close modal" class="text-secondary hover:text-on-surface transition-colors" type="button">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <form id="update-form" method="POST" action="">
            @csrf
            @method('PATCH')
            <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600" for="update-activity-title">Activity Title</label>
                    <input class="w-full h-9 px-3 rounded font-body-md text-body-md text-on-surface bg-slate-100 border border-outline-variant outline-none" id="update-activity-title" type="text" readonly/>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600">Status</label>
                    <div class="flex gap-2">
                        <label class="relative flex-1 cursor-pointer">
                            <input class="peer sr-only" id="update-status-pending" name="status" type="radio" value="pending"/>
                            <div class="h-9 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest peer-checked:bg-amber-50 peer-checked:border-amber-200 peer-checked:text-amber-900 transition-all">
                                <span class="font-body-md text-body-md flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Pending
                                </span>
                            </div>
                        </label>
                        <label class="relative flex-1 cursor-pointer">
                            <input class="peer sr-only" id="update-status-done" name="status" type="radio" value="done"/>
                            <div class="h-9 flex items-center justify-center rounded border border-outline-variant bg-surface-container-lowest peer-checked:bg-emerald-50 peer-checked:border-emerald-200 peer-checked:text-emerald-900 transition-all">
                                <span class="font-body-md text-body-md flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Done
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-label-md text-label-md text-slate-600" for="update-activity-remark">Remark</label>
                    <textarea class="w-full p-3 rounded font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 outline-none transition-all resize-none" id="update-activity-remark" name="remarks" placeholder="Add notes or resolution details here..." rows="4" required></textarea>
                </div>
            </div>
            <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
                <button onclick="document.getElementById('update-modal').classList.add('hidden')" class="h-9 px-4 rounded font-body-md text-body-md font-medium text-on-surface bg-surface-container-lowest border border-slate-300 hover:bg-slate-50 transition-colors" type="button">Cancel</button>
                <button class="h-10 px-6 rounded font-body-md text-body-md font-medium text-white bg-[#1e293b] hover:bg-black transition-colors shadow-sm" type="submit">Save Changes</button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function openUpdateModal(activity) {
        var form = document.getElementById('update-form');
        form.action = '/activities/' + activity.id;
        document.getElementById('update-activity-title').value = activity.title;

        var status = (activity.latest_update && activity.latest_update.status) ? activity.latest_update.status : 'pending';
        if (status === 'done') {
            document.getElementById('update-status-done').checked = true;
        } else {
            document.getElementById('update-status-pending').checked = true;
        }

        document.getElementById('update-activity-remark').value = (activity.latest_update && activity.latest_update.remarks) ? activity.latest_update.remarks : '';
        document.getElementById('update-modal').classList.remove('hidden');
    }
</script>
@endsection
