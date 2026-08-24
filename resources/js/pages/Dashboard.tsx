import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CreateActivityModal from '@/Components/CreateActivityModal';
import UpdateActivityModal from '@/Components/UpdateActivityModal';
import ViewActivityModal from '@/Components/ViewActivityModal';
import { Activity, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FileEdit, Pencil, CheckCircle2, Eye } from 'lucide-react';

interface Props {
    activities: Activity[];
    todayDate: string;
}

export default function Dashboard({ activities = [], todayDate }: Props) {
    const flash = usePage<PageProps>().props.flash;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const handleOpenModal = () => setIsCreateOpen(true);
        window.addEventListener('open-create-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-modal', handleOpenModal);
    }, []);

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '08:30 AM';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daily Handover - AppSupport Ops" />

            <div className="space-y-6">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-medium text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Page Title & Log Activity Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Daily Handover
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Current Shift: {todayDate || 'Oct 24, 2023'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1e293b] hover:bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors"
                    >
                        <FileEdit className="w-4.5 h-4.5" />
                        <span>Log Activity</span>
                    </button>
                </div>

                {/* Main Daily Handover Data Table */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                            <thead>
                                <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] font-bold text-xs uppercase tracking-wider">
                                    <th className="px-5 py-4 w-4/12">Activity Description</th>
                                    <th className="px-5 py-4 w-2/12">Status</th>
                                    <th className="px-5 py-4 w-3/12">Remarks</th>
                                    <th className="px-5 py-4 w-2/12">Personnel</th>
                                    <th className="px-5 py-4 w-1/12 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {activities.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">
                                            No support activities logged for this shift.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((activity, idx) => {
                                        const latestUpdate = activity.latest_update;
                                        const isDone = latestUpdate?.status === 'done';
                                        const updater = latestUpdate?.user || activity.creator;

                                        return (
                                            <tr
                                                key={activity.id}
                                                className={`hover:bg-[#f8fafc] transition-colors relative ${
                                                    idx === activities.length - 1 ? 'border-l-4 border-slate-900' : ''
                                                }`}
                                            >
                                                <td className="px-5 py-4 cursor-pointer" onClick={() => setViewingActivity(activity)}>
                                                    <div className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                                                        {activity.title}
                                                    </div>
                                                    {activity.description && (
                                                        <div className="mt-0.5 text-xs text-slate-500 font-normal line-clamp-1">
                                                            {activity.description}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                                                            isDone
                                                                ? 'bg-[#dcfce7] text-[#166534]'
                                                                : 'bg-[#fef3c7] text-[#92400e]'
                                                        }`}
                                                    >
                                                        {isDone ? 'Done' : 'Pending'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-slate-700 text-sm max-w-[280px] truncate" title={latestUpdate?.remarks || ''}>
                                                    {latestUpdate?.remarks || '—'}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-[#d0e1fb] text-slate-800 text-xs font-bold flex items-center justify-center uppercase shrink-0">
                                                            {updater?.name ? updater.name.slice(0, 2) : 'SD'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-sm">
                                                                {updater?.name || 'Personnel'}
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-mono">
                                                                {formatTime(latestUpdate?.created_at || activity.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewingActivity(activity)}
                                                            className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 rounded-md hover:bg-slate-100"
                                                            title="View Handover Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedActivity(activity)}
                                                            className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 rounded-md hover:bg-slate-100"
                                                            title="Edit Activity"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateActivityModal show={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <UpdateActivityModal activity={selectedActivity} show={!!selectedActivity} onClose={() => setSelectedActivity(null)} />
            <ViewActivityModal
                activity={viewingActivity}
                show={!!viewingActivity}
                onClose={() => setViewingActivity(null)}
                onEdit={() => setSelectedActivity(viewingActivity)}
            />
        </AuthenticatedLayout>
    );
}




