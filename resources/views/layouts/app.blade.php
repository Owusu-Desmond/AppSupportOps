<!DOCTYPE html>
<html class="light" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>@yield('title', 'AppSupport Ops - Daily Handover')</title>

    <!-- Tailwind & Fonts -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet"/>

    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-container-highest": "#e0e3e5",
                        "primary-fixed": "#dae2fd",
                        "tertiary-container": "#271901",
                        "on-surface": "#191c1e",
                        "secondary": "#505f76",
                        "surface-container-low": "#f2f4f6",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-fixed-variant": "#574425",
                        "primary-fixed-dim": "#bec6e0",
                        "on-secondary-fixed-variant": "#38485d",
                        "outline": "#76777d",
                        "secondary-fixed": "#d3e4fe",
                        "secondary-container": "#d0e1fb",
                        "outline-variant": "#c6c6cd",
                        "surface-variant": "#e0e3e5",
                        "primary": "#000000",
                        "inverse-on-surface": "#eff1f3",
                        "surface-container-high": "#e6e8ea",
                        "secondary-fixed-dim": "#b7c8e1",
                        "on-tertiary-container": "#98805d",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#fcdeb5",
                        "surface-container": "#eceef0",
                        "on-primary-container": "#7c839b",
                        "on-surface-variant": "#45464d",
                        "primary-container": "#131b2e",
                        "on-background": "#191c1e",
                        "on-error-container": "#93000a",
                        "tertiary-fixed-dim": "#dec29a",
                        "on-tertiary": "#ffffff",
                        "on-secondary-container": "#54647a",
                        "surface": "#f7f9fb",
                        "on-primary-fixed-variant": "#3f465c",
                        "on-primary": "#ffffff",
                        "on-tertiary-fixed": "#271901",
                        "surface-dim": "#d8dadc",
                        "error": "#ba1a1a",
                        "tertiary": "#000000",
                        "on-secondary-fixed": "#0b1c30",
                        "on-error": "#ffffff",
                        "inverse-surface": "#2d3133",
                        "surface-tint": "#565e74",
                        "inverse-primary": "#bec6e0",
                        "surface-bright": "#f7f9fb",
                        "background": "#f7f9fb",
                        "on-secondary": "#ffffff",
                        "on-primary-fixed": "#131b2e"
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    spacing: {
                        "gutter": "1.5rem",
                        "stack-sm": "0.5rem",
                        "container-max": "1440px",
                        "stack-md": "1rem",
                        "edge-margin": "2rem",
                        "stack-lg": "2rem"
                    },
                    fontFamily: {
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-sm": ["Inter"],
                        "headline-md": ["Inter"],
                        "display-lg": ["Inter"],
                        "mono-sm": ["jetbrainsMono"]
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .data-table-container { background-color: #ffffff; border: 1px solid #e2e8f0; }
        .data-table th { background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; color: #475569; }
        .data-table tr { border-bottom: 1px solid #f1f5f9; }
        .data-table tr:hover { background-color: #f8fafc; }
        .badge-success { color: #166534; background-color: #dcfce7; }
        .badge-pending { color: #92400e; background-color: #fef3c7; }
        .btn-primary { background-color: #1e293b; color: #ffffff; }
        .btn-primary:hover { background-color: #0f172a; }
    </style>
</head>
<body class="font-body-md text-on-surface flex flex-col h-screen overflow-hidden">
    <!-- TopNavBar Shell -->
    <header class="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-gutter h-16 shrink-0 z-50 relative">
        <div class="flex items-center gap-stack-md">
            <span class="font-headline-sm text-headline-sm font-black text-primary">AppSupport Ops</span>
            <nav class="hidden md:flex gap-stack-lg ml-8">
                <a class="{{ request()->routeIs('dashboard') ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-primary' }} pb-1 font-label-md text-label-md transition-all" href="{{ route('dashboard') }}">Dashboard</a>
                <a class="{{ request()->routeIs('activities.report') ? 'text-primary font-bold border-b-2 border-primary' : 'text-secondary hover:text-primary' }} pb-1 font-label-md text-label-md transition-all" href="{{ route('activities.report') }}">Reporting</a>
            </nav>
        </div>

        <div class="flex items-center gap-stack-md">
            <div class="relative hidden sm:block">
                <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input class="pl-8 pr-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-body-sm focus:border-outline focus:ring-2 focus:ring-surface-container-low focus:outline-none w-48 transition-all" placeholder="Search activities..." type="text"/>
            </div>
            <button class="text-secondary hover:text-primary hover:bg-surface-container-low transition-all p-1.5 rounded-full" type="button">
                <span class="material-symbols-outlined">notifications</span>
            </button>
            <form method="POST" action="{{ route('logout') }}" class="inline">
                @csrf
                <button class="text-secondary hover:text-primary hover:bg-surface-container-low transition-all p-1.5 rounded-full" title="Log Out" type="submit">
                    <span class="material-symbols-outlined">logout</span>
                </button>
            </form>
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase border border-outline-variant">
                    {{ Auth::user() ? strtoupper(substr(Auth::user()->name, 0, 2)) : 'US' }}
                </div>
                <span class="text-xs font-semibold text-slate-700 hidden lg:inline">{{ Auth::user()?->name }}</span>
            </div>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
        <!-- SideNavBar -->
        <aside class="bg-surface w-64 border-r border-outline-variant hidden lg:flex flex-col shrink-0">
            <div class="p-4 border-b border-outline-variant">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary">
                        <span class="material-symbols-outlined">apps</span>
                    </div>
                    <div>
                        <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">Support Tracker</h2>
                        <p class="font-label-md text-label-md text-secondary">Enterprise Tier</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 py-4 flex flex-col gap-1">
                <a class="flex items-center gap-stack-md {{ request()->routeIs('dashboard') ? 'bg-secondary-container text-on-secondary-container border-l-2 border-primary' : 'text-secondary hover:bg-surface-container' }} px-4 py-3 font-body-md text-body-md transition-all" href="{{ route('dashboard') }}">
                    <span class="material-symbols-outlined">dashboard</span>
                    Daily Handover
                </a>
                <a class="flex items-center gap-stack-md {{ request()->routeIs('activities.report') ? 'bg-secondary-container text-on-secondary-container border-l-2 border-primary' : 'text-secondary hover:bg-surface-container' }} px-4 py-3 font-body-md text-body-md transition-all" href="{{ route('activities.report') }}">
                    <span class="material-symbols-outlined">analytics</span>
                    Historical Reporting
                </a>
            </nav>
        </aside>

        <!-- Main Content Canvas -->
        <main class="flex-1 overflow-auto p-edge-margin relative">
            @yield('content')
        </main>
    </div>

    @yield('scripts')
</body>
</html>
