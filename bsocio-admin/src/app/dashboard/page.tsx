"use client";

import { useDashboard } from '@/hooks';

export default function DashboardPage() {
    const { data, isLoading, isError, refetch } = useDashboard();
    // Format relative time
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
                <h2>Welcome Back, Admin</h2>
                <p>Here&apos;s what&apos;s happening with your platform today.</p>
            </div>

            {/* Key Metrics */}
            <div className="metrics-section">
                <h3>Key Metrics</h3>
                {isLoading ? (
                    <div className="loading-state">Loading metrics...</div>
                ) : isError ? (
                    <div className="error-state">
                        Failed to load metrics.{' '}
                        <button onClick={refetch}>Retry</button>
                    </div>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-value">{data?.metrics?.totalSignUps?.toLocaleString() ?? 0}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-green">📈</div>
                            <div className="stat-value">{data?.metrics?.newSignUpsToday ?? 0}</div>
                            <div className="stat-label">New Today</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-value">{data?.metrics?.monthlySignUps ?? 0}</div>
                            <div className="stat-label">This Month</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-icon-red">🎂</div>
                            <div className="stat-value">{data?.metrics?.usersWithBirthdaysThisMonth ?? 0}</div>
                            <div className="stat-label">Birthdays</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-quick-actions">
                <h2>Quick Actions</h2>
                <div className="dashboard-actions-container">
                    <button className="dashboard-action-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="#1F6AE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="action-text">New Article</span>
                    </button>
                    <button className="dashboard-action-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#1F6AE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="action-text">Create Event</span>
                    </button>
                    <button className="dashboard-action-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V12M12 12L8 8M12 12L16 8M8 16H16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#1F6AE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="action-text">Add Award</span>
                    </button>
                    <button className="dashboard-action-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21M17 11L19 13L23 9M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="#1F6AE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="action-text">Add Guest</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {isLoading ? (
                        <div className="loading-state">Loading activity...</div>
                    ) : isError ? (
                        <div className="error-state">Failed to load activity</div>
                    ) : data?.recentActivity?.length === 0 ? (
                        <div className="empty-state">No recent activity</div>
                    ) : (
                        data?.recentActivity?.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-content">
                                    <div className="activity-content-text">
                                        <h4 className="activity-title">{activity.title}</h4>
                                        <p className="activity-desc">{activity.message || activity.type}</p>
                                    </div>
                                    <span className="activity-time">{formatRelativeTime(activity.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
