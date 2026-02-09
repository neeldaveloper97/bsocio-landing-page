"use client";

import { useState, ReactNode, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { prefetchDashboardData, prefetchAdminActivity } from '@/hooks';
import { AuthGuard } from './AuthGuard';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

// Inline SVG to avoid loading lucide-react in the dashboard layout
function Power() {
    return (
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" x2="12" y1="2" y2="12" />
        </svg>
    );
}

interface DashboardLayoutProps {
    children: ReactNode;
}

interface NavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    allowedRoles: UserRole[];
}

// Static nav items with role-based access control
const NAV_ITEMS: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: '📊', href: '/dashboard', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN', 'ANALYTICS_VIEWER'] },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/dashboard/analytics', allowedRoles: ['SUPER_ADMIN', 'ANALYTICS_VIEWER'] },
    { id: 'news', label: 'News & Media', icon: '📰', href: '/dashboard/news', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'events', label: 'Events', icon: '🎉', href: '/dashboard/events', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'faqs', label: 'FAQs', icon: '❓', href: '/dashboard/faqs', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'legal', label: 'Legal Documents', icon: '📋', href: '/dashboard/legal', allowedRoles: ['SUPER_ADMIN'] },
    { id: 'awards', label: 'Awards & Recognition', icon: '🏆', href: '/dashboard/awards', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'nominees', label: 'Nominees', icon: '👨', href: '/dashboard/nominees', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'guests', label: 'Special Guests', icon: '🎟️', href: '/dashboard/guests', allowedRoles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { id: 'campaigns', label: 'Email Campaigns', icon: '📣', href: '/dashboard/campaigns', allowedRoles: ['SUPER_ADMIN', 'COMMUNICATIONS_ADMIN'] },
    { id: 'communications', label: 'Communications', icon: '📧', href: '/dashboard/communications', allowedRoles: ['SUPER_ADMIN', 'COMMUNICATIONS_ADMIN'] },
    { id: 'users', label: 'User Management', icon: '👥', href: '/dashboard/users', allowedRoles: ['SUPER_ADMIN'] },
];

// Memoized nav item component with prefetching
const NavItemLink = memo(function NavItemLink({ 
    item, 
    isActive, 
    onClick,
    onPrefetch,
}: { 
    item: NavItem; 
    isActive: boolean; 
    onClick: () => void;
    onPrefetch?: () => void;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 w-full min-h-11 rounded-xl",
                "font-sans text-sm leading-5 no-underline transition-all duration-300",
                isActive 
                    ? "bg-primary text-white hover:bg-primary" 
                    : "bg-transparent text-[#D1D5DB] hover:bg-blue-300"
            )}
            onClick={onClick}
            onMouseEnter={onPrefetch}
            onFocus={onPrefetch}
            prefetch={true}
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
    const queryClient = useQueryClient();

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // Filter nav items based on user role
    const visibleNavItems = useMemo(() => {
        if (!user?.role) return [];
        return NAV_ITEMS.filter(item => item.allowedRoles.includes(user.role));
    }, [user?.role]);

    // Memoize isActive check function
    const getIsActive = useCallback((href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    }, [pathname]);

    // Prefetch handler for nav item hover - instant page loads
    const handlePrefetch = useCallback((href: string) => {
        if (href === '/dashboard') {
            // Prefetch dashboard data on hover
            prefetchDashboardData(queryClient);
            prefetchAdminActivity(queryClient);
        }
        // Add more prefetch handlers for other routes as needed
    }, [queryClient]);

    const handleLogout = useCallback(async () => {
        await logout();
        router.push('/login');
    }, [logout, router]);

    // Format role name - convert SUPER_ADMIN to Super Admin
    const formatRoleName = useCallback((role: string): string => {
        if (!role) return 'Admin';
        if (role.includes(' ')) return role;
        return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }, []);

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

    const displayRole = useMemo(() => {
        return formatRoleName(user?.role || '');
    }, [user?.role, formatRoleName]);

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
                            Role: {displayRole}
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col items-start p-3 gap-1 flex-1">
                        {visibleNavItems.map((item) => (
                            <NavItemLink
                                key={item.id}
                                item={item}
                                isActive={getIsActive(item.href)}
                                onClick={closeSidebar}
                                onPrefetch={() => handlePrefetch(item.href)}
                            />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="sidebar-footer-section">
                        <button 
                            onClick={handleLogout} 
                            className="sidebar-logout-btn flex items-center justify-center gap-2"
                        >
                            <Power />
                            Logout
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
