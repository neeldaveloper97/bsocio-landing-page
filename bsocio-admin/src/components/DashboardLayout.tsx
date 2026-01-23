"use client";

import { useState, ReactNode } from 'react';
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

const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/dashboard/analytics' },
    { id: 'news', label: 'News & Media', icon: '📰', href: '/dashboard/news' },
    { id: 'events', label: 'Events', icon: '🎉', href: '/dashboard/events' },
    { id: 'awards', label: 'Awards', icon: '🏆', href: '/dashboard/awards' },
    { id: 'nominees', label: 'Nominees', icon: '⭐', href: '/dashboard/nominees' },
    { id: 'guests', label: 'Guests', icon: '👥', href: '/dashboard/guests' },
    { id: 'faqs', label: 'FAQs', icon: '❓', href: '/dashboard/faqs' },
    { id: 'communications', label: 'Communications', icon: '✉️', href: '/dashboard/communications' },
    { id: 'legal', label: 'Legal Documents', icon: '📋', href: '/dashboard/legal' },
    { id: 'users', label: 'User & System', icon: '⚙️', href: '/dashboard/users' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'AD';
    };

    const getUserDisplayName = () => {
        return user?.email?.split('@')[0] || 'Admin';
    };

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
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                            onClick={closeSidebar}
                        >
                            <span className="icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
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
                                <span className="user-name">{getUserDisplayName()}</span>
                                <span className="user-email">{user?.email || ''}</span>
                            </div>
                            <div className="user-avatar">{getUserInitials()}</div>
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
