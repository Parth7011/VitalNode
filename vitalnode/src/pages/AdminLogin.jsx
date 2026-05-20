import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminLogin — Secret admin-only login page at /admin-login.
 * Matches the site's green medical theme.
 * Credentials checked against hardcoded values in AuthContext (Option A).
 */
const AdminLogin = () => {
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const success = adminLogin(form.username, form.password);
        if (success) {
            navigate('/admin-dashboard');
        } else {
            setError('Invalid admin credentials. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-soft flex items-center justify-center px-4 py-24 relative overflow-hidden">
            {/* Background decorations matching site style */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 bg-primary-green -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 bg-secondary-green translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="w-full max-w-md animate-fadeIn relative z-10">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden">

                    {/* Green top banner */}
                    <div className="hero-gradient px-8 py-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Portal</h1>
                        <p className="text-white/80 text-sm mt-1">VitalNode Hospital Management</p>
                        <span className="inline-block mt-3 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                            Restricted Access
                        </span>
                    </div>

                    {/* Form section */}
                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-text-dark">Admin Username</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </span>
                                    <input
                                        id="admin-username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder="Enter admin username"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-text-dark text-sm focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-text-dark">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        id="admin-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter admin password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-text-dark text-sm focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                id="admin-login-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary-gradient text-white font-bold py-3.5 rounded-xl shadow-glow hover:shadow-premium transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </>
                                ) : 'Access Admin Portal'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-xs text-gray-400 hover:text-primary-green transition-colors">
                                ← Back to VitalNode Home
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    This page is for authorized hospital administrators only.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
