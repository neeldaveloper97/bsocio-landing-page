"use client";

import { useState, ReactNode, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { AuthGuard } from './AuthGuard';

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
    // { id: 'events', label: 'Events', icon: '🎉', href: '/dashboard/events' },
    // { id: 'awards', label: 'Awards', icon: '🏆', href: '/dashboard/awards' },
    // { id: 'nominees', label: 'Nominees', icon: '⭐', href: '/dashboard/nominees' },
    // { id: 'guests', label: 'Guests', icon: '👥', href: '/dashboard/guests' },
    // { id: 'faqs', label: 'FAQs', icon: '❓', href: '/dashboard/faqs' },
    // { id: 'campaigns', label: 'Campaigns', icon: '📧', href: '/dashboard/campaigns' },
    // { id: 'communications', label: 'Communications', icon: '✉️', href: '/dashboard/communications' },
    // { id: 'legal', label: 'Legal Documents', icon: '📋', href: '/dashboard/legal' },
    // { id: 'users', label: 'User & System', icon: '⚙️', href: '/dashboard/users' },
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
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <span className="icon">{item.icon}</span>
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
                    <div className="mobile-navbar-logo">
                        <span className="bsocio-logo">
                            <span className="b">B</span>socio
                            <span className="dot"></span>
                        </span>
                    </div>
                    <button 
                        className={`hamburger-menu ${sidebarOpen ? 'active' : ''}`}
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>

                {/* Sidebar Overlay */}
                <div 
                    className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                    onClick={closeSidebar}
                ></div>

                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
                    <button className="sidebar-close" onClick={closeSidebar}>×</button>
                
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <h1>Bsocio</h1>
                    <p>Admin Dashboard</p>
                </div>

                {/* Role */}
                <div className="sidebar-role">
                    <span className="role-label">Role: {user?.role || 'Admin'}</span>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
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
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>Bsocio Admin</h1>
                            <p>Manage your platform with ease</p>
                        </div>
                        <div className="header-user">
                            <div className="user-info">
                                <span className="user-name">{userDisplayName}</span>
                                <span className="user-email">{user?.email || ''}</span>
                            </div>
                            <div className="user-avatar">{userInitials}</div>
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
