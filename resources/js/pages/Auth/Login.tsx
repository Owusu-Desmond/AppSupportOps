import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 font-sans text-slate-900">
            <Head title="Sign In - AppSupport Ops" />

            <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] p-10 shadow-sm">
                {/* Shield Header Badge */}
                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200 shadow-2xs">
                        <Shield className="w-7 h-7 text-slate-800" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        AppSupport Ops
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1.5">
                        Sign in to access the Activity Tracker
                    </p>
                </div>

                {status && (
                    <div className="mb-5 text-sm font-medium text-emerald-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Username or Email Input */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                            Username or Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="agent@appsupport.com"
                                className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* Password Input & Forgot password link */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-semibold text-slate-700 block">
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-semibold text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="••••••••"
                                className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Remember me checkbox */}
                    <div className="flex items-center gap-2.5 pt-1">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-sm text-slate-600 font-medium">
                            Remember me on this device
                        </span>
                    </div>

                    {/* Sign In button */}
                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Link to Register */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Register Account
                            </Link>
                        </p>
                    </div>
                </form>


                {/* Footer text */}
                <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
                    <div>Authorized Personnel Only.</div>
                    <div>Privacy Policy · Terms of Service</div>
                </div>
            </div>
        </div>
    );
}


