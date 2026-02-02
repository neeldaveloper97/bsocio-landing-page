"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks';
import { useAuth } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
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
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isAuthenticated, router]);

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
        <div className="min-h-screen flex flex-col justify-center items-center p-8 gap-8 bg-[#F3F4F6]">
            <div className="flex flex-col items-start gap-8 w-full max-w-125">
                {/* Header */}
                <div className="flex flex-col items-start gap-2 w-full">
                    <div className="flex justify-center items-center w-full">
                        <span className="font-bold text-3xl leading-9">
                            <span className="text-primary">B</span>
                            <span className="text-[#1A1A1A]">socio</span>
                            <span className="inline-block w-2 h-2 bg-accent rounded-full ml-0.5" />
                        </span>
                    </div>
                    <p className="font-normal text-base leading-6 text-center text-[#4A5565] w-full">
                        Admin Dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="flex flex-col items-start p-8 gap-6 w-full bg-white shadow-md rounded-xl">
                    <h2 className="font-bold text-2xl leading-8 text-[#101828] w-full">
                        {showTfa ? 'Two-Factor Authentication' : 'Sign In'}
                    </h2>

                    {error && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className={inputStyles}
                                    />
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
                                <a 
                                    href="#" 
                                    className="font-bold text-sm leading-5 text-right text-primary no-underline w-full block hover:underline"
                                >
                                    Forgot password?
                                </a>
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
                    © 2025 Bsocio. All rights reserved.
                </p>
            </div>
        </div>
    );
}
