"use client";

import React, { useMemo } from "react";
import { useDashboard, useAuth, useAdminActivity } from '@/hooks';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import './dashboard.css';

// Skeleton component for loading states - prevents CLS
function StatCardSkeleton() {
    return (
        <div className="stat-card skeleton-card" aria-hidden="true">
            <div className="skeleton-box skeleton-icon"></div>
            <div className="skeleton-box skeleton-value"></div>
            <div className="skeleton-box skeleton-label"></div>
        </div>
    );
}

function ActivityItemSkeleton() {
    return (
        <div className="activity-item skeleton-activity" aria-hidden="true">
            <div className="skeleton-activity-content">
                <div className="skeleton-box skeleton-text"></div>
                <div className="skeleton-box skeleton-text-short"></div>
            </div>
            <div className="skeleton-box skeleton-time"></div>
        </div>
    );
}

export default function ClientDashboard() {
    const { data, isLoading, isError, refetch } = useDashboard();
    const { user } = useAuth();
    const {
        activities,
        total,
        currentPage,
        totalPages,
        isLoading: isActivitiesLoading,
        error: activitiesError,
        filter,
        sortBy,
        sortOrder,
        nextPage,
        prevPage,
        setFilter,
        setSort,
    } = useAdminActivity();

    // Get user's display name from email
    const userDisplayName = useMemo(() => {
        if (user?.email) {
            const name = user.email.split('@')[0];
            // Capitalize first letter
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Admin';
    }, [user?.email]);

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="content-section active">
            {/* Dashboard Intro */}
            <div className="dashboard-intro">
                <h2>Welcome Back, {userDisplayName}</h2>
                <p>Here&apos;s what&apos;s happening with your platform today.</p>
            </div>

            {/* Key Metrics */}
            <div className="metrics-section">
                <h3>Key Metrics</h3>
                {isLoading ? (
                    <div className="stats-grid">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                ) : isError ? (
                    <div className="error-state">
                        Failed to load metrics.{' '}
                        <button onClick={refetch}>Retry</button>
                    </div>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card" style={{ minHeight: '140px' }}>
                            <div className="stat-icon">👥</div>
                            <div className="stat-value">{(data?.metrics?.totalSignUps ?? 0).toLocaleString()}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                        <div className="stat-card" style={{ minHeight: '140px' }}>
                            <div className="stat-icon stat-icon-green">📈</div>
                            <div className="stat-value">{data?.metrics?.newSignUpsToday ?? 0}</div>
                            <div className="stat-label">New Today</div>
                        </div>
                        <div className="stat-card" style={{ minHeight: '140px' }}>
                            <div className="stat-icon">📊</div>
                            <div className="stat-value">{data?.metrics?.monthlySignUps ?? 0}</div>
                            <div className="stat-label">This Month</div>
                        </div>
                        <div className="stat-card" style={{ minHeight: '140px' }}>
                            <div className="stat-icon">🎂</div>
                            <div className="stat-value">{data?.metrics?.usersWithBirthdaysThisMonth ?? 0}</div>
                            <div className="stat-label">Birthdays This Month</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
                <div className="activity-header">
                    <h3>Recent Activity</h3>
                    <div className="activity-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Select 
                            value={filter || 'all'} 
                            onValueChange={(value) => setFilter(value === 'all' ? undefined : value as '24h' | 'week' | 'month')}
                        >
                            <SelectTrigger style={{ width: '160px' }}>
                                <SelectValue placeholder="Filter by time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="24h">Last 24 Hours</SelectItem>
                                <SelectItem value="week">Last Week</SelectItem>
                                <SelectItem value="month">Last Month</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select 
                            value={`${sortBy}-${sortOrder}`} 
                            onValueChange={(value) => {
                                const [field, order] = value.split('-') as ['createdAt', 'asc' | 'desc'];
                                setSort(field, order);
                            }}
                        >
                            <SelectTrigger style={{ width: '180px' }}>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {isActivitiesLoading ? (
                    <div className="activity-list" role="status" aria-label="Loading activities">
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                    </div>
                ) : activitiesError ? (
                    <div className="error-state">
                        <span>Unable to load activity.</span>
                        <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                ) : activities && activities.length > 0 ? (
                    <>
                        <div className="activity-list">
                            {activities.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-content">
                                        <div className="activity-title">{activity.type.replace(/_/g, ' ')}</div>
                                        <div className="activity-desc">
                                            {activity.message || activity.title} by {activity.adminName}
                                        </div>
                                    </div>
                                    <span className="activity-time">{formatRelativeTime(activity.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-button"
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages} ({total} total)
                                </span>
                                <button
                                    className="pagination-button"
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="activity-list">
                        <div className="empty-activity">
                            <div className="empty-activity-icon">📋</div>
                            <p className="empty-activity-title">No recent activity</p>
                            <p className="empty-activity-desc">Admin operations will appear here</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
