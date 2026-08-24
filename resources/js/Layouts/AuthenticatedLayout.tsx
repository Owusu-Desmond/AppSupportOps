import Dropdown from '@/Components/Dropdown';
import { Notification, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import {
    Search,
    Bell,
    Settings,
    LayoutDashboard,
    Ticket,
    Activity,
    Users,
    FileText,
    Plus,
    Grid,
    Menu,
    CheckCircle2,
    AlertCircle,
    X,
} from 'lucide-react';

/* ── Relative time helper ───────────────────────────────────────────── */
function relativeTime(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Notification Panel ─────────────────────────────────────────────── */
function NotificationPanel({
    notifications,
    onClose,
}: {
    notifications: Notification[];
    onClose: () => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
            style={{ maxHeight: '480px' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Activity updates from your team
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <Bell className="w-8 h-8 text-slate-200 mb-3" />
                        <p className="text-sm font-medium text-slate-500">You're all caught up</p>
                        <p className="text-xs text-slate-400 mt-1">
                            No new activity from your team in the last 48 hours.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {notifications.map((n) => {
                            const isDone = n.status === 'done';
                            return (
                                <li
                                    key={n.id}
                                    className="flex items-start gap-3.5 px-5 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    {/* Status icon */}
                                    <div className="mt-0.5 shrink-0">
                                        {isDone ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 leading-snug">
                                            <span className="font-semibold">{n.actor_name}</span>{' '}
                                            marked{' '}
                                            <span className="font-semibold text-slate-900 truncate">
                                                "{n.activity_title}"
                                            </span>{' '}
                                            as{' '}
                                            <span
                                                className={
                                                    isDone
                                                        ? 'text-emerald-600 font-bold'
                                                        : 'text-amber-600 font-bold'
                                                }
                                            >
                                                {isDone ? 'Done' : 'Pending'}
                                            </span>
                                        </p>
                                        {n.remarks && (
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                                "{n.remarks}"
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-1">
                                            {relativeTime(n.created_at)}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

/* ── Main Layout ────────────────────────────────────────────────────── */
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, notifications = [] } = usePage<PageProps>().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const isDashboard = route().current('dashboard');
    const isReports = route().current('activities.report');

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#191c1e] font-sans flex flex-col antialiased">
            {/* TopNavBar Header */}
            <header className="bg-white border-b border-[#e2e8f0] flex justify-between items-center w-full px-8 h-16 shrink-0 z-50 sticky top-0">
                <div className="flex items-center gap-8">
                    <Link href={route('dashboard')} className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                        <span>AppSupport Ops</span>
                    </Link>

                    <nav className="hidden md:flex gap-8 ml-4">
                        <Link
                            href={route('dashboard')}
                            className={`font-semibold text-sm pb-1 border-b-2 transition-all ${isDashboard
                                ? 'text-slate-900 border-slate-900'
                                : 'text-slate-500 hover:text-slate-900 border-transparent'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('activities.report')}
                            className={`font-semibold text-sm pb-1 border-b-2 transition-all ${isReports
                                ? 'text-slate-900 border-slate-900'
                                : 'text-slate-500 hover:text-slate-900 border-transparent'
                                }`}
                        >
                            Reporting
                        </Link>
                    </nav>
                </div>

                {/* Right Header Utilities */}
                <div className="flex items-center gap-5">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm bg-white text-slate-700 w-56 focus:outline-none focus:border-slate-400"
                        />
                    </div>

                    {/* Bell / Notifications */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowNotifications((v) => !v)}
                            className="relative text-slate-500 hover:text-slate-900 p-2 rounded-full transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                            )}
                        </button>

                        {showNotifications && (
                            <NotificationPanel
                                notifications={notifications}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </div>

                    <Link
                        href={route('profile.edit')}
                        className="text-slate-500 hover:text-slate-900 p-2 rounded-full transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
                                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm uppercase border border-slate-200 shadow-2xs">
                                    {user.name.slice(0, 2)}
                                </div>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                        className="md:hidden p-2 text-slate-500 hover:text-slate-900"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left SideNavBar */}
                <aside className="w-64 bg-[#f8fafc] border-r border-[#e2e8f0] hidden lg:flex flex-col shrink-0">
                    <div className="p-5 border-b border-[#e2e8f0]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#131b2e] flex items-center justify-center text-white font-bold text-base">
                                <Grid className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-slate-900">Support Tracker</h2>
                                <p className="text-xs text-slate-500 font-medium">Enterprise Tier</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 py-4 flex flex-col gap-1">
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium transition-all ${isDashboard
                                ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Overview</span>
                        </Link>

                        <a href="#" className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <Ticket className="w-4 h-4" />
                            <span>Active Tickets</span>
                        </a>

                        <a href="#" className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <Activity className="w-4 h-4" />
                            <span>System Health</span>
                        </a>

                        <a href="#" className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <Users className="w-4 h-4" />
                            <span>Team Metrics</span>
                        </a>

                        <Link
                            href={route('activities.report')}
                            className={`flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium transition-all ${isReports
                                ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Reporting</span>
                        </Link>
                    </nav>

                    <div className="p-5 border-t border-[#e2e8f0]">
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-create-modal'))}
                            className="w-full bg-[#1e293b] hover:bg-black text-white h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Log New Activity</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8 relative">
                    <div className="max-w-[1440px] mx-auto">
                        {header}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
