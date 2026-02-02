"use client";

import { useState, ReactNode, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { AuthGuard } from './AuthGuard';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: ReactNode;
}

interface NavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
}

// Static nav items - defined outside component to prevent recreation
const NAV_ITEMS: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/dashboard/analytics' },
    { id: 'news', label: 'News & Media', icon: '📰', href: '/dashboard/news' },
    { id: 'events', label: 'Events', icon: '🎉', href: '/dashboard/events' },
    { id: 'faqs', label: 'FAQs', icon: '❓', href: '/dashboard/faqs' },
    { id: 'legal', label: 'Legal Documents', icon: '📋', href: '/dashboard/legal' },
];

// Memoized nav item component
const NavItemLink = memo(function NavItemLink({ 
    item, 
    isActive, 
    onClick 
}: { 
    item: NavItem; 
    isActive: boolean; 
    onClick: () => void;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 w-full min-h-11 rounded-xl",
                "font-sans text-sm leading-5 no-underline transition-all duration-300",
                "hover:bg-primary/10",
                isActive 
                    ? "bg-primary text-white" 
                    : "bg-transparent text-[#D1D5DB]"
            )}
            onClick={onClick}
        >
            <span className="w-5 h-5 min-w-5 text-base inline-flex items-center justify-center">
                {item.icon}
            </span>
            <span>{item.label}</span>
        </Link>
    );
});

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Memoize isActive check function
    const getIsActive = useCallback((href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    }, [pathname]);

    const handleLogout = useCallback(async () => {
        await logout();
        router.push('/login');
    }, [logout, router]);

    // Memoize user display values
    const userInitials = useMemo(() => {
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'AD';
    }, [user?.email]);

    const userDisplayName = useMemo(() => {
        return user?.email?.split('@')[0] || 'Admin';
    }, [user?.email]);

    return (
        <AuthGuard>
            <div className="admin-dashboard">
                {/* Mobile Navbar */}
                <nav className="mobile-admin-navbar">
                    <div className="flex items-center">
                        <span className="font-bold text-lg">
                            <span className="text-primary">B</span>
                            <span className="text-white">socio</span>
                            <span className="inline-block w-2 h-2 bg-accent rounded-full ml-0.5" />
                        </span>
                    </div>
                    <button 
                        className={cn(
                            "w-8 h-8 flex flex-col justify-center items-center gap-1.5",
                            "bg-transparent border-none cursor-pointer"
                        )}
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        <span className={cn(
                            "w-6 h-0.5 bg-white transition-all duration-300",
                            sidebarOpen && "rotate-45 translate-y-2"
                        )} />
                        <span className={cn(
                            "w-6 h-0.5 bg-white transition-all duration-300",
                            sidebarOpen && "opacity-0"
                        )} />
                        <span className={cn(
                            "w-6 h-0.5 bg-white transition-all duration-300",
                            sidebarOpen && "-rotate-45 -translate-y-2"
                        )} />
                    </button>
                </nav>

                {/* Sidebar Overlay */}
                <div 
                    className={cn("sidebar-overlay", sidebarOpen && "active")}
                    onClick={closeSidebar}
                />

                {/* Sidebar */}
                <aside className={cn("admin-sidebar", sidebarOpen && "active")}>
                    {/* Close button - mobile only */}
                    <button 
                        className="absolute top-4 right-4 w-8 h-8 text-white text-2xl bg-transparent border-none cursor-pointer lg:hidden"
                        onClick={closeSidebar}
                    >
                        ×
                    </button>
                
                    {/* Sidebar Header */}
                    <div className="sidebar-header-section">
                        <h1 className="sidebar-logo">
                            Bsocio
                        </h1>
                        <p className="sidebar-subtitle">
                            Admin Dashboard
                        </p>
                    </div>

                    {/* Role */}
                    <div className="sidebar-role-section">
                        <span className="sidebar-role-text">
                            Role: {user?.role || 'Admin'}
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col items-start p-3 gap-1 flex-1">
                        {NAV_ITEMS.map((item) => (
                            <NavItemLink
                                key={item.id}
                                item={item}
                                isActive={getIsActive(item.href)}
                                onClick={closeSidebar}
                            />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="sidebar-footer-section">
                        <button 
                            onClick={handleLogout} 
                            className="sidebar-logout-btn"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    {/* Header */}
                    <header className="admin-header">
                        <div className="header-content">
                            <div className="header-title-section">
                                <h1 className="header-title">
                                    Bsocio Admin
                                </h1>
                                <p className="header-subtitle">
                                    Manage your platform with ease
                                </p>
                            </div>
                            <div className="header-user-section">
                                <div className="header-user-info">
                                    <span className="header-user-name">
                                        {userDisplayName}
                                    </span>
                                    <span className="header-user-email">
                                        {user?.email || ''}
                                    </span>
                                </div>
                                <div className="header-user-avatar">
                                    {userInitials}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="admin-content">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
