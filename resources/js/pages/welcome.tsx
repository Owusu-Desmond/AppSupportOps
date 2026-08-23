import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <h1 className="text-2xl font-bold">AppSupportOps</h1>
            </div>
        </>
    );
}

