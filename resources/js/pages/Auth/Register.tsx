import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 font-sans text-slate-900">
            <Head title="Create Account - AppSupport Ops" />

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
                        Create your personnel account
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Full Name Input */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Desmond Owusu"
                                className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
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

                    {/* Password Input */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                            Password
                        </label>
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

                    {/* Confirm Password Input */}
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="••••••••"
                                className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-slate-800 bg-white border border-[#e2e8f0] focus:outline-none focus:border-slate-400"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Link to Login */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-slate-500 font-medium">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Sign In
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

