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
    LogOut,
} from 'lucide-react';

/* Relative time helper */
function relativeTime(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/* Notification Panel  */
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

/* ── Global Search Interface & Component ────────────────────────────── */
interface SearchResult {
    id: number;
    title: string;
    description?: string | null;
    created_at: string;
    creator_name: string;
    status: 'pending' | 'done';
    remarks?: string | null;
}

function GlobalSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Live search query with debounce
    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            fetch(`/activities/search?q=${encodeURIComponent(trimmed)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setIsLoading(false);
                    setIsOpen(true);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div ref={containerRef} className="relative hidden sm:block">
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    placeholder="Search activities... (⌘K)"
                    className="pl-9 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 w-64 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
                />
                {query ? (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                        ⌘K
                    </kbd>
                )}
            </div>

            {/* Results Dropdown Overlay */}
            {isOpen && query.trim().length >= 2 && (
                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden max-h-96 flex flex-col">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{isLoading ? 'Searching...' : `Results for "${query}"`}</span>
                        <span>{results.length} found</span>
                    </div>

                    <div className="overflow-y-auto divide-y divide-slate-100">
                        {isLoading ? (
                            <div className="py-8 text-center text-xs text-slate-400 font-medium">
                                Fetching activity logs...
                            </div>
                        ) : results.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400 font-medium">
                                No matching activities found.
                            </div>
                        ) : (
                            results.map((item) => {
                                const isDone = item.status === 'done';
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setIsOpen(false)}
                                        className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="font-semibold text-sm text-slate-900 line-clamp-1">
                                                {item.title}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                    isDone
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {isDone ? 'DONE' : 'PENDING'}
                                            </span>
                                        </div>

                                        {item.description && (
                                            <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>Logged by {item.creator_name}</span>
                                            <span>{item.created_at}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* Main Layout  */
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
                    <GlobalSearchBar />

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
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-900"
                        aria-label="Toggle navigation"
                    >
                        {showingNavigationDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay / Drawer */}
            {showingNavigationDropdown && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setShowingNavigationDropdown(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative flex-1 max-w-xs w-full bg-[#f8fafc] flex flex-col z-10 shadow-2xl">
                        <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#131b2e] flex items-center justify-center text-white font-bold text-base">
                                    <Grid className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base text-slate-900">Support Tracker</h2>
                                    <p className="text-xs text-slate-500 font-medium">Enterprise Tier</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="p-2 text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 py-4 flex flex-col justify-between overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <div className="px-5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Main Navigation
                                    </div>
                                    <div className="space-y-0.5">
                                        <Link
                                            href={route('dashboard')}
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${isDashboard
                                                ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>Overview</span>
                                        </Link>

                                        <Link
                                            href={route('activities.report')}
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${isReports
                                                ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>Reporting</span>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <div className="px-5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Account & Settings
                                    </div>
                                    <div className="space-y-0.5">
                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${route().current('profile.edit')
                                                ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Profile Settings</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 my-4">
                                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-700">System Status</span>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-emerald-700">All Systems Operational</p>
                                </div>
                            </div>
                        </nav>

                        <div className="p-4 border-t border-[#e2e8f0]">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="w-full bg-[#1e293b] hover:bg-black text-white h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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

                    <nav className="flex-1 py-4 flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-6">
                            {/* Main Menu Section */}
                            <div>
                                <div className="px-5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Main Navigation
                                </div>
                                <div className="space-y-0.5">
                                    <Link
                                        href={route('dashboard')}
                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${isDashboard
                                            ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Overview</span>
                                    </Link>

                                    <Link
                                        href={route('activities.report')}
                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${isReports
                                            ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Reporting</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Account Section */}
                            <div>
                                <div className="px-5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Account & Settings
                                </div>
                                <div className="space-y-0.5">
                                    <Link
                                        href={route('profile.edit')}
                                        className={`flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium transition-all ${route().current('profile.edit')
                                            ? 'bg-[#d0e1fb]/60 text-slate-900 border-l-4 border-slate-900 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* System Status Card */}
                        <div className="px-4 my-4">
                            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-700">System Status</span>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p className="text-[11px] font-medium text-emerald-700">All Systems Operational</p>
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-[#e2e8f0]">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full bg-[#1e293b] hover:bg-black text-white h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </Link>
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
