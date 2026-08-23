import Modal from '@/Components/Modal';
import { Activity } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
    activity: Activity | null;
    show: boolean;
    onClose: () => void;
}

export default function UpdateActivityModal({ activity, show, onClose }: Props) {
    const currentStatus = activity?.latest_update?.status || 'pending';

    const { data, setData, patch, processing, reset, errors } = useForm({
        status: currentStatus,
        remarks: '',
    });

    useEffect(() => {
        if (activity) {
            setData({
                status: activity.latest_update?.status || 'pending',
                remarks: activity.latest_update?.remarks || '',
            });
        }
    }, [activity]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!activity) return;

        patch(route('activities.update', activity.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!show || !activity) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-xl overflow-hidden text-slate-900 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Update Activity</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={submit} className="p-6 space-y-4.5">
                    {/* Activity Description Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 block">
                            Activity Description
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={activity.title}
                            className="w-full h-10 px-3.5 rounded-md text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 focus:outline-none"
                        />
                    </div>

                    {/* Status Radio Selector */}
                    <div className="space-y-1.5 pt-1">
                        <label className="text-sm font-semibold text-slate-700 block">
                            Status
                        </label>
                        <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="pending"
                                    checked={data.status === 'pending'}
                                    onChange={(e) => setData('status', e.target.value as 'pending' | 'done')}
                                    className="sr-only peer"
                                />
                                <div className="h-10 flex items-center justify-center rounded-md border border-slate-300 bg-white peer-checked:bg-[#fffbeb] peer-checked:border-[#fde68a] peer-checked:text-[#92400e] text-slate-600 transition-all text-sm font-semibold gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    <span>Pending</span>
                                </div>
                            </label>

                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="done"
                                    checked={data.status === 'done'}
                                    onChange={(e) => setData('status', e.target.value as 'pending' | 'done')}
                                    className="sr-only peer"
                                />
                                <div className="h-10 flex items-center justify-center rounded-md border border-slate-300 bg-white peer-checked:bg-[#f0fdf4] peer-checked:border-[#bbf7d0] peer-checked:text-[#166534] text-slate-600 transition-all text-sm font-semibold gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                                    <span>Done</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Remark Textarea */}
                    <div className="space-y-1.5 pt-1">
                        <label className="text-sm font-semibold text-slate-700 block">
                            Remark
                        </label>
                        <textarea
                            rows={4}
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Add notes or resolution details here..."
                            required
                            className="w-full p-3.5 rounded-md text-sm text-slate-800 bg-white border border-slate-300 focus:outline-none focus:border-slate-400 resize-none"
                        ></textarea>
                        {errors.remarks && (
                            <p className="text-xs text-red-600">{errors.remarks}</p>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-5 rounded-md text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 px-6 rounded-md text-sm font-semibold text-white bg-[#1e293b] hover:bg-black transition-colors shadow-xs"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

