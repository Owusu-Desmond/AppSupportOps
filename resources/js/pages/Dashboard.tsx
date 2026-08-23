import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
                    Daily Handover Dashboard
                </h2>
            }
        >
            <Head title="Daily Handover Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-xl border border-slate-200/80 p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                            Authentication successful. Welcome to the AppSupportOps Daily Handover Portal.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
