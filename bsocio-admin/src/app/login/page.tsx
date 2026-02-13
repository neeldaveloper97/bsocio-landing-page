"use client";

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogin } from '@/hooks';
import { useAuth } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

// Inline SVG icons to avoid loading lucide-react on login page
function EyeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <path d="m2 2 20 20" />
        </svg>
    );
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, isInitialized, isAdmin } = useAuth();
    const { login, isLoading, error: loginError } = useLogin({
        onSuccess: () => {
            router.push('/dashboard');
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tfaCode, setTfaCode] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showTfa, setShowTfa] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Check for unauthorized error from URL
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'unauthorized') {
            setError('Access denied. Only administrators can access this dashboard.');
        }
    }, [searchParams]);

    // Redirect if already authenticated and admin
    useEffect(() => {
        if (isInitialized && isAuthenticated && isAdmin) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isAuthenticated, isAdmin, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (!showTfa) {
                const result = await login(
                    { email, password },
                    { rememberMe }
                );

                if (!result) {
                    setError(loginError ? getErrorMessage(loginError) : 'Invalid credentials');
                }
                return;
            }
        } catch {
            setError('An error occurred. Please try again.');
        }
    };

    const inputStyles = cn(
        "w-full h-11.5 px-4 py-2.5",
        "border border-[#D1D5DC] rounded-xl",
        "font-sans text-base leading-4.5 text-[#0A0A0A]",
        "placeholder:text-[#0A0A0A]/50",
        "focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10",
        "transition-all duration-200"
    );

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 gap-8 bg-[#F3F4F6]">
            <div className="flex flex-col items-start gap-8 w-full max-w-sm sm:max-w-md md:max-w-lg">
                {/* Header */}
                <div className="flex flex-col items-start gap-2 w-full">
                    <div className="flex justify-center items-center w-full">
                        <Logo className="text-2xl md:text-3xl" />
                    </div>
                    <p className="font-normal text-sm md:text-base leading-6 text-center text-[#4A5565] w-full">
                        Admin Dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="flex flex-col items-start p-6 md:p-8 gap-6 w-full bg-white shadow-md rounded-xl">
                    <h2 className="font-bold text-xl md:text-2xl leading-8 text-[#101828] w-full">
                        {showTfa ? 'Two-Factor Authentication' : 'Sign In'}
                    </h2>

                    {error && (
                        <div role="alert" className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col items-end gap-4.5 w-full" onSubmit={handleSubmit}>
                        {!showTfa ? (
                            <>
                                {/* Email Field */}
                                <div className="flex flex-col items-start gap-2 w-full">
                                    <label htmlFor="email" className="font-bold text-sm leading-5 text-[#364153] w-full">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className={inputStyles}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col items-start gap-2 w-full">
                                    <label htmlFor="password" className="font-bold text-sm leading-5 text-[#364153] w-full">
                                        Password
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className={cn(inputStyles, "pr-14")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:rounded transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex flex-row items-center gap-2 w-full">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 border border-[#D1D5DC] rounded-sm cursor-pointer shrink-0"
                                    />
                                    <label htmlFor="rememberMe" className="font-normal text-sm leading-5 text-[#364153] cursor-pointer m-0">
                                        Remember me
                                    </label>
                                </div>

                                {/* Forgot Password */}
                                <button
                                    type="button"
                                    className="font-bold text-sm leading-5 text-right text-primary bg-transparent border-none cursor-pointer w-full block hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </>
                        ) : (
                            <>
                                {/* 2FA Code Field */}
                                <div className="flex flex-col items-start gap-2 w-full">
                                    <label htmlFor="tfaCode" className="font-bold text-sm leading-5 text-[#364153] w-full">
                                        Authentication Code
                                    </label>
                                    <input
                                        type="text"
                                        id="tfaCode"
                                        value={tfaCode}
                                        onChange={(e) => setTfaCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                        className={inputStyles}
                                    />
                                </div>

                                <p className="text-sm text-[#6A7282] text-center w-full">
                                    Enter the code from your authenticator app
                                </p>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={cn(
                                "w-full h-12 bg-primary rounded-xl border-none",
                                "font-sans font-bold text-base leading-6 text-center text-white",
                                "cursor-pointer transition-colors duration-200",
                                "hover:bg-[#1557C7] active:bg-[#0F3E8F]",
                                "disabled:bg-[#9CA3AF] disabled:cursor-not-allowed"
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Please wait...' : (showTfa ? 'Verify' : 'Sign In')}
                        </button>

                        {showTfa && (
                            <button
                                type="button"
                                className="w-full h-12 bg-transparent border border-[#D1D5DC] rounded-xl font-sans font-bold text-base text-[#364153] cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setShowTfa(false)}
                            >
                                Back to Login
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <p className="font-normal text-sm leading-5 text-center text-[#6A7282] w-full">
                    © 2026 Bsocio. All rights reserved.
                </p>
            </div>
        </div>
    );
}

function LoginFallback() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 gap-8 bg-[#F3F4F6]">
            <div className="flex flex-col items-start gap-8 w-full max-w-sm sm:max-w-md md:max-w-lg">
                <div className="flex flex-col items-start gap-2 w-full">
                    <div className="flex justify-center items-center w-full">
                        <Logo className="text-2xl md:text-3xl" />
                    </div>
                    <p className="font-normal text-sm md:text-base leading-6 text-center text-[#4A5565] w-full">
                        Admin Dashboard
                    </p>
                </div>
                <div role="status" className="flex flex-col items-center justify-center p-6 md:p-8 gap-6 w-full bg-white shadow-md rounded-xl min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-[#6A7282]">Loading...</p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginContent />
        </Suspense>
    );
}
