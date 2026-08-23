import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { X } from 'lucide-react';

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function CreateActivityModal({ show, onClose }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        status: 'pending' as 'pending' | 'done',
        remarks: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('activities.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!show) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="bg-white rounded-xl overflow-hidden text-slate-900 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Log Support Activity</h2>
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
                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className="text-base font-semibold text-slate-700 block">
                            Activity Title / Description *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder='e.g., "Daily SMS count in comparison to SMScount from logs"'
                            className="w-full h-12 px-4 rounded-md text-base text-slate-800 bg-white border border-slate-300 focus:outline-none focus:border-slate-400"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Details Input */}
                    <div className="space-y-1.5">
                        <label className="text-base font-semibold text-slate-700 block">
                            Additional Details
                        </label>
                        <textarea
                            rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Operational notes..."
                            className="w-full p-4 rounded-md text-base text-slate-800 bg-white border border-slate-300 focus:outline-none focus:border-slate-400 resize-none"
                        ></textarea>
                    </div>

                    {/* Status Radio Selector */}
                    <div className="space-y-1.5 pt-1">
                        <label className="text-base font-semibold text-slate-700 block">
                            Initial Status
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
                                <div className="h-12 flex items-center justify-center rounded-md border border-slate-300 bg-white peer-checked:bg-[#fffbeb] peer-checked:border-[#fde68a] peer-checked:text-[#92400e] text-slate-600 transition-all text-base font-semibold gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
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
                                <div className="h-12 flex items-center justify-center rounded-md border border-slate-300 bg-white peer-checked:bg-[#f0fdf4] peer-checked:border-[#bbf7d0] peer-checked:text-[#166534] text-slate-600 transition-all text-base font-semibold gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                                    <span>Done</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Remarks Input */}
                    <div className="space-y-1.5 pt-1">
                        <label className="text-base font-semibold text-slate-700 block">
                            Initial Remark
                        </label>
                        <input
                            type="text"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Handover notes..."
                            className="w-full h-12 px-4 rounded-md text-base text-slate-800 bg-white border border-slate-300 focus:outline-none focus:border-slate-400"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-12 px-6 rounded-md text-base font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-12 px-8 rounded-md text-base font-semibold text-white bg-[#1e293b] hover:bg-black transition-colors shadow-xs"
                        >
                            Save Activity
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
