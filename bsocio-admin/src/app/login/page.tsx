"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks';
import { useAuth } from '@/hooks';
import { getErrorMessage } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const { login, isLoading, error: loginError } = useLogin({
        onSuccess: () => {
            // Use router.push for client-side navigation (no full reload)
            router.push('/dashboard');
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tfaCode, setTfaCode] = useState('');
    const [rememberMe, setRememberMe] = useState(true); // Default to true for better UX
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
            // For now, skip 2FA and go directly to login
            // If 2FA is implemented in backend, handle it here
            if (!showTfa) {
                const result = await login(
                    { email, password },
                    { rememberMe }
                );

                if (!result) {
                    // Error is handled by useLogin hook
                    setError(loginError ? getErrorMessage(loginError) : 'Invalid credentials');
                }
                return;
            }

            // Handle 2FA verification if needed in the future
            // For now, this code path is not used
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-container">
                {/* Header */}
                <div className="login-header">
                    <div className="bsocio-logo-wrapper">
                        <span className="bsocio-logo" style={{ fontSize: '32px' }}>
                            <span className="b">B</span>socio<span className="dot"></span>
                        </span>
                    </div>
                    <p className="subtitle">Admin Dashboard</p>
                </div>

                {/* Login Card */}
                <div className="login-card">
                    <h2>{showTfa ? 'Two-Factor Authentication' : 'Sign In'}</h2>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        {!showTfa ? (
                            <>
                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                {/* Remember Me */}
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>

                                {/* Forgot Password */}
                                <a href="#" className="password-reset">
                                    Forgot password?
                                </a>
                            </>
                        ) : (
                            <>
                                {/* 2FA Code Field */}
                                <div className="form-group tfa-code active">
                                    <label htmlFor="tfaCode">Authentication Code</label>
                                    <input
                                        type="text"
                                        id="tfaCode"
                                        value={tfaCode}
                                        onChange={(e) => setTfaCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                    />
                                </div>

                                <p style={{ fontSize: '14px', color: '#6A7282', textAlign: 'center', width: '100%' }}>
                                    Enter the code from your authenticator app
                                </p>
                            </>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-login"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Please wait...' : (showTfa ? 'Verify' : 'Sign In')}
                        </button>

                        {showTfa && (
                            <button
                                type="button"
                                className="btn-secondary"
                                style={{ width: '100%' }}
                                onClick={() => setShowTfa(false)}
                            >
                                Back to Login
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <p className="login-footer">
                    © 2025 Bsocio. All rights reserved.
                </p>
            </div>
        </div>
    );
}
