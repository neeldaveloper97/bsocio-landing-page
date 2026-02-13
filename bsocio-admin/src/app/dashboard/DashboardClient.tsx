"use client";

import React, { useMemo, useCallback, memo, useDeferredValue, useState, useEffect } from "react";
import { useDashboardOptimized, useAuth, useAdminActivityOptimized } from '@/hooks';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
// Inline SVGs to avoid lucide-react dependency in client bundle
const ChevronLeft = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m15 18-6-6 6-6" />
    </svg>
);
const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);
import type { AdminActivity } from '@/types';

const ACTIVITY_PAGE_SIZE = 10;

/**
 * ============================================
 * MOBILE PERFORMANCE OPTIMIZATIONS
 * ============================================
 * - useDeferredValue for non-blocking updates
 * - Reduced animation complexity
 * - Memoized components
 * - Minimal re-renders
 * ============================================
 */

// ============================================
// LIGHTWEIGHT SKELETON COMPONENTS
// Using opacity instead of background animation
// Reduces paint/composite operations for TBT
// ============================================

const StatCardSkeleton = memo(function StatCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center p-6 gap-2 bg-white border border-gray-200 rounded-xl min-h-32" aria-hidden="true">
            <div className="w-8 h-8 rounded-lg bg-gray-100" />
            <div className="w-16 h-8 mt-2 rounded bg-gray-100" />
            <div className="w-20 h-4 mt-1 rounded bg-gray-100" />
        </div>
    );
});

const ActivityItemSkeleton = memo(function ActivityItemSkeleton() {
    return (
        <div className="flex flex-row items-center justify-between p-4 gap-4 min-h-16 border-b border-gray-100 last:border-b-0" aria-hidden="true">
            <div className="flex flex-col gap-2 flex-1">
                <div className="w-3/5 h-4 rounded bg-gray-100" />
                <div className="w-2/5 h-3 rounded bg-gray-100" />
            </div>
            <div className="w-16 h-3 rounded bg-gray-100 shrink-0" />
        </div>
    );
});

// ============================================
// MEMOIZED STAT CARD COMPONENT
// ============================================

interface StatCardProps {
    icon: string;
    value: number;
    label: string;
    colorClass?: string;
}

const StatCard = memo(function StatCard({ icon, value, label, colorClass = "text-blue-600" }: StatCardProps) {
    return (
        <div className="stat-card-responsive">
            <div className={cn("stat-icon-responsive", colorClass)}>{icon}</div>
            <div className="stat-value-responsive">{value.toLocaleString()}</div>
            <div className="stat-label-responsive">{label}</div>
        </div>
    );
});

// ============================================
// MEMOIZED ACTIVITY ITEM
// ============================================

interface ActivityItemProps {
    activity: AdminActivity;
    formatRelativeTime: (date: string) => string;
    formatFullDateTime: (date: string) => string;
}

const ActivityItem = memo(function ActivityItem({ activity, formatRelativeTime, formatFullDateTime }: ActivityItemProps) {
    return (
        <div
            className="flex items-start gap-4 p-5 border-b border-gray-200 last:border-b-0 w-full transition-colors hover:bg-gray-50 max-md:p-4 max-md:gap-3 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            role="article"
            tabIndex={0}
        >
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <span className="flex items-center gap-1.5 flex-wrap mb-1 font-sans font-bold text-sm leading-5 text-gray-900">
                    {activity.title}
                </span>
                <span className="font-sans font-medium text-sm leading-5.5 text-gray-900 max-md:text-sm max-md:leading-5">
                    {activity.message || `Action performed`} by <strong>{activity.adminName}</strong>
                </span>
            </div>
            <span
                className="font-sans font-medium text-xs leading-4 text-gray-600 whitespace-nowrap shrink-0"
                title={formatFullDateTime(activity.createdAt)}
            >
                {formatRelativeTime(activity.createdAt)}
            </span>
        </div>
    );
});

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function ClientDashboard() {
    // Pagination state for recent activity
    const [activityPage, setActivityPage] = useState(0);
    // Filter state for recent activity
    const [activityFilter, setActivityFilter] = useState<'24h' | 'week' | 'month' | undefined>(undefined);
    // Defer activity rendering for LCP optimization
    const [showActivity, setShowActivity] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowActivity(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Use optimized React Query hooks
    const { data, isLoading, isError, refetch } = useDashboardOptimized();
    const { user } = useAuth();
    const {
        data: activityData,
        isLoading: isActivitiesLoading,
        isError: activitiesError,
        refetch: refetchActivities,
    } = useAdminActivityOptimized({
        skip: activityPage * ACTIVITY_PAGE_SIZE,
        take: ACTIVITY_PAGE_SIZE,
        filter: activityFilter,
    });

    // Defer expensive data updates - prevents blocking main thread on mobile
    const deferredData = useDeferredValue(data);
    const deferredActivityData = useDeferredValue(activityData);

    // Memoized user display name
    const userDisplayName = useMemo(() => {
        if (user?.email) {
            const name = user.email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Admin';
    }, [user?.email]);

    // Memoized time formatters (stable references)
    const formatRelativeTime = useCallback((dateString: string) => {
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
    }, []);

    const formatFullDateTime = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    // Extract activities from React Query response - use deferred values for non-blocking UI
    const activities = deferredActivityData?.activities ?? [];
    const total = deferredActivityData?.total ?? 0;
    const totalActivityPages = Math.ceil(total / ACTIVITY_PAGE_SIZE);

    // Pagination handlers
    const handlePrevActivityPage = useCallback(() => {
        setActivityPage(prev => Math.max(0, prev - 1));
    }, []);

    const handleNextActivityPage = useCallback(() => {
        setActivityPage(prev => Math.min(totalActivityPages - 1, prev + 1));
    }, [totalActivityPages]);

    // Use deferred metrics for non-blocking updates
    const metrics = deferredData?.metrics;

    return (
        <div className="page-content">
            {/* Dashboard Intro */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">
                        Welcome Back, {userDisplayName}
                    </h1>
                    <p className="font-sans font-normal text-base leading-6 text-gray-600 m-0">
                        Here&apos;s what&apos;s happening with your platform today.
                    </p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="flex flex-col items-start gap-5 max-sm:gap-4 w-full overflow-hidden">
                <h2 className="font-sans font-bold text-xl max-sm:text-lg leading-7 text-gray-900 m-0">
                    Key Metrics
                </h2>
                {isLoading ? (
                    <div className="stats-grid-4">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                ) : isError ? (
                    <div className="inline-error-state">
                        Failed to load metrics.{' '}
                        <button onClick={() => refetch()} className="text-primary font-semibold hover:underline">Retry</button>
                    </div>
                ) : (
                    <div className="stats-grid-4">
                        <StatCard
                            icon="👥"
                            value={metrics?.totalSignUps ?? 0}
                            label="Total Users"
                            colorClass="text-blue-600"
                        />
                        <StatCard
                            icon="📈"
                            value={metrics?.newSignUpsToday ?? 0}
                            label="New Today"
                            colorClass="text-green-500"
                        />
                        <StatCard
                            icon="📊"
                            value={metrics?.monthlySignUps ?? 0}
                            label="This Month"
                            colorClass="text-blue-600"
                        />
                        <StatCard
                            icon="🎂"
                            value={metrics?.usersWithBirthdaysThisMonth ?? 0}
                            label="Birthdays"
                            colorClass="text-blue-600"
                        />
                    </div>
                )}
            </div>

            {/* Recent Activity - Deferred to improve LCP/TBT */}
            {showActivity && (
                <div className="flex flex-col items-start gap-5 max-sm:gap-4 w-full">
                    <div className="flex flex-row justify-between items-center w-full gap-5 max-md:flex-col max-md:items-start max-md:gap-4 max-sm:gap-3">
                        <h2 className="font-sans font-bold text-xl max-sm:text-lg leading-7 text-gray-900 m-0">
                            Recent Activity
                        </h2>
                        <div className="flex items-center gap-3 max-sm:gap-2 flex-wrap">
                            <Select
                                value={activityFilter || 'all'}
                                onValueChange={(value) => {
                                    setActivityFilter(value === 'all' ? undefined : value as '24h' | 'week' | 'month');
                                    setActivityPage(0);
                                }}
                            >
                                <SelectTrigger aria-label="Filter activities by time">
                                    <SelectValue placeholder="Filter by time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                                    <SelectItem value="week">Last Week</SelectItem>
                                    <SelectItem value="month">Last Month</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {isActivitiesLoading ? (
                        <div className="flex flex-col items-start w-full bg-white border border-gray-200 rounded-xl overflow-hidden" role="status" aria-label="Loading activities">
                            <ActivityItemSkeleton />
                            <ActivityItemSkeleton />
                            <ActivityItemSkeleton />
                            <ActivityItemSkeleton />
                        </div>
                    ) : activitiesError ? (
                        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full">
                            <span>Unable to load activity.</span>
                            <button onClick={() => refetchActivities()} className="text-primary font-semibold hover:underline">Retry</button>
                        </div>
                    ) : activities && activities.length > 0 ? (
                        <div className="flex flex-col items-start w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                            {activities.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    formatRelativeTime={formatRelativeTime}
                                    formatFullDateTime={formatFullDateTime}
                                />
                            ))}
                            {total > ACTIVITY_PAGE_SIZE && (
                                <div className="flex items-center justify-between gap-3 max-sm:gap-2 py-4 px-6 max-sm:py-3 max-sm:px-4 border-t border-gray-200 w-full">
                                    <span className="pagination-info text-sm text-gray-500">
                                        Showing {activityPage * ACTIVITY_PAGE_SIZE + 1}-{Math.min((activityPage + 1) * ACTIVITY_PAGE_SIZE, total)} of {total} activities
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrevActivityPage}
                                            disabled={activityPage === 0}
                                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-600 font-medium min-w-[80px] text-center">
                                            Page {activityPage + 1} of {totalActivityPages}
                                        </span>
                                        <button
                                            onClick={handleNextActivityPage}
                                            disabled={activityPage >= totalActivityPages - 1}
                                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-start w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="flex flex-col items-center justify-center py-15 max-sm:py-10 px-6 max-sm:px-4 text-center w-full min-h-60">
                                <div className="text-5xl max-sm:text-4xl mb-5 max-sm:mb-4 opacity-50">📋</div>
                                <p className="font-sans font-bold text-lg max-sm:text-base leading-6 text-gray-900 m-0 mb-2">No recent activity</p>
                                <p className="font-sans font-normal text-sm max-sm:text-xs leading-5 text-gray-500 m-0 max-w-80">Admin operations will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
