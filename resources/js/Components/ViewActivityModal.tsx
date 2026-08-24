import Modal from '@/Components/Modal';
import { Activity } from '@/types';
import { X, Clock, User, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';

interface Props {
    activity: Activity | null;
    show: boolean;
    onClose: () => void;
    onEdit?: () => void;
}

export default function ViewActivityModal({ activity, show, onClose, onEdit }: Props) {
    if (!show || !activity) return null;

    const latestUpdate = activity.latest_update;
    const isDone = latestUpdate?.status === 'done';
    const creator = activity.creator;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-xl overflow-hidden text-slate-900 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center my-2 gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isDone
                                    ? 'bg-[#dcfce7] text-[#166534]'
                                    : 'bg-[#fef3c7] text-[#92400e]'
                                }`}
                        >
                            {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                                <AlertCircle className="w-3.5 h-3.5" />
                            )}
                            {isDone ? 'Done' : 'Pending'}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900">Handover Details</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onEdit();
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {/* Activity Title & Description */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{activity.title}</h3>
                        {activity.description ? (
                            <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-wrap">
                                {activity.description}
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400 italic mt-1">No additional description provided.</p>
                        )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div>
                            <span className="text-slate-400 font-medium block mb-1">Created By</span>
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>{creator?.name || 'Unknown User'}</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium block mb-1">Logged At</span>
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>{formatDate(activity.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Update History Audit Log */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            Status Audit History ({activity.updates?.length || 0})
                        </h4>

                        {!activity.updates || activity.updates.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No updates logged yet.</p>
                        ) : (
                            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                                {activity.updates.map((update) => {
                                    const updateIsDone = update.status === 'done';
                                    return (
                                        <div key={update.id} className="relative flex items-start gap-4 pl-8">
                                            <span
                                                className={`absolute left-1.5 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white ring-1 ${updateIsDone
                                                        ? 'bg-emerald-500 ring-emerald-300'
                                                        : 'bg-amber-500 ring-amber-300'
                                                    }`}
                                            />
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {update.user?.name || 'Personnel'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-mono">
                                                        {formatDate(update.created_at)}
                                                    </span>
                                                </div>
                                                <div className="mb-1.5">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${updateIsDone
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                            }`}
                                                    >
                                                        {updateIsDone ? 'Status: Done' : 'Status: Pending'}
                                                    </span>
                                                </div>
                                                {update.remarks && (
                                                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 mt-1">
                                                        "{update.remarks}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 px-5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
