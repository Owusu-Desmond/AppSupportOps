import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Activity } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Download, FileText, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    activities: Activity[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function ReportsIndex({ activities = [], filters }: Props) {
    const [startDate, setStartDate] = useState(filters?.start_date || '2023-10-01');
    const [endDate, setEndDate] = useState(filters?.end_date || '2023-10-31');
    const [reportType, setReportType] = useState('Activity Logs');

    const handleFilter: FormEventHandler = (e) => {
        e.preventDefault();

        router.get(
            route('activities.report'),
            {
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatTimestamp = (dateStr?: string) => {
        if (!dateStr) return '2023-10-31 09:12:44';
        const d = new Date(dateStr);
        return d.toISOString().replace('T', ' ').slice(0, 19);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generate Reports - AppSupport Ops" />

            <div className="space-y-6">
                {/* Header & Export Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Generate Reports
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Export historical activity logs and system metrics for auditing.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>CSV</span>
                        </button>
                    </div>
                </div>

                {/* Filter Controls Box */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-2xs">
                    <form onSubmit={handleFilter} className="flex flex-col lg:flex-row lg:items-end gap-5">
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                                Date Range
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-md text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                />
                                <span className="text-slate-400 font-medium">-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full h-10 px-3.5 rounded-md text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-64">
                            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                                Report Type
                            </label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full h-10 px-3.5 rounded-md text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                            >
                                <option value="Activity Logs">Activity Logs</option>
                                <option value="Personnel Audit">Personnel Audit</option>
                                <option value="System Metrics">System Metrics</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full lg:w-auto h-10 px-7 rounded-md text-sm font-semibold text-white bg-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                <span>Generate Report</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Data Table Container */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] font-bold text-xs uppercase tracking-wider">
                                    <th className="px-5 py-4 w-3/12">Timestamp</th>
                                    <th className="px-5 py-4 w-2/12">Agent ID</th>
                                    <th className="px-5 py-4 w-2/12">Status</th>
                                    <th className="px-5 py-4 w-5/12">Action Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                                {activities.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-slate-400 font-sans text-sm">
                                            No historical activity logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((activity) => {
                                        const latestUpdate = activity.latest_update;
                                        const isDone = latestUpdate?.status === 'done';
                                        const updater = latestUpdate?.user || activity.creator;
                                        const agentId = updater ? `AGT-${updater.id.toString().padStart(4, '0')}` : 'SYS-AUTO';

                                        return (
                                            <tr key={activity.id} className="hover:bg-[#f8fafc] transition-colors">
                                                <td className="px-5 py-4 text-slate-600 font-mono text-xs">
                                                    {formatTimestamp(activity.created_at)}
                                                </td>

                                                <td className="px-5 py-4 font-mono text-slate-800 font-bold text-xs">
                                                    {agentId}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap font-sans">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase ${isDone
                                                                ? 'bg-[#dcfce7] text-[#166534]'
                                                                : 'bg-[#fef3c7] text-[#92400e]'
                                                            }`}
                                                    >
                                                        {isDone ? 'SUCCESS' : 'PENDING'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 font-sans text-slate-900 font-semibold text-sm">
                                                    {activity.title}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between border-t border-[#e2e8f0] px-5 py-3.5 text-sm text-slate-500 bg-[#f8fafc]">
                        <span>Showing 1-{activities.length} of {activities.length} results</span>
                        <div className="flex items-center gap-4">
                            <button type="button" className="text-slate-400 hover:text-slate-700">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="font-medium text-slate-700">Page 1 of 1</span>
                            <button type="button" className="text-slate-400 hover:text-slate-700">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}




