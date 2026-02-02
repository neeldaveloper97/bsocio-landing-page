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
import { cn } from '@/lib/utils';

// Skeleton component for loading states - prevents CLS
function StatCardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center p-7 gap-2 bg-white border border-[#E5E7EB] rounded-xl min-h-35" aria-hidden="true">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
            <div className="w-20 h-9 mt-2 rounded bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
            <div className="w-25 h-5 mt-1 rounded bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
        </div>
    );
}

function ActivityItemSkeleton() {
    return (
        <div className="flex flex-row items-center justify-between p-4 gap-4 min-h-18 border-b border-[#E5E7EB] last:border-b-0" aria-hidden="true">
            <div className="flex flex-col gap-2 flex-1">
                <div className="w-3/5 h-5 rounded bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
                <div className="w-2/5 h-4 rounded bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse" />
            </div>
            <div className="w-20 h-4 rounded bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse shrink-0" />
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

    // Format full date and time
    const formatFullDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="page-content">
            {/* Dashboard Intro */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">
                        Welcome Back, {userDisplayName}
                    </h1>
                    <p className="font-sans font-normal text-base leading-6 text-[#6B7280] m-0">
                        Here&apos;s what&apos;s happening with your platform today.
                    </p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="flex flex-col items-start gap-5 max-sm:gap-4 w-full overflow-hidden">
                <h2 className="font-sans font-bold text-xl max-sm:text-lg leading-7 text-[#101828] m-0">
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
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        Failed to load metrics.{' '}
                        <button onClick={refetch} className="text-primary font-semibold hover:underline">Retry</button>
                    </div>
                ) : (
                    <div className="stats-grid-4">
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">👥</div>
                            <div className="stat-value-responsive">{(data?.metrics?.totalSignUps ?? 0).toLocaleString()}</div>
                            <div className="stat-label-responsive">Total Users</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#7CBB00]">📈</div>
                            <div className="stat-value-responsive">{data?.metrics?.newSignUpsToday ?? 0}</div>
                            <div className="stat-label-responsive">New Today</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">📊</div>
                            <div className="stat-value-responsive">{data?.metrics?.monthlySignUps ?? 0}</div>
                            <div className="stat-label-responsive">This Month</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">🎂</div>
                            <div className="stat-value-responsive">{data?.metrics?.usersWithBirthdaysThisMonth ?? 0}</div>
                            <div className="stat-label-responsive">Birthdays This Month</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col items-start gap-5 max-sm:gap-4 w-full">
                <div className="flex flex-row justify-between items-center w-full gap-5 max-md:flex-col max-md:items-start max-md:gap-4 max-sm:gap-3">
                    <h2 className="font-sans font-bold text-xl max-sm:text-lg leading-7 text-[#101828] m-0">
                        Recent Activity
                    </h2>
                    <div className="flex items-center gap-3 max-sm:gap-2 flex-wrap">
                        <Select 
                            value={filter || 'all'} 
                            onValueChange={(value) => setFilter(value === 'all' ? undefined : value as '24h' | 'week' | 'month')}
                        >
                            <SelectTrigger className="w-36">
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
                            <SelectTrigger className="w-36">
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
                    <div className="flex flex-col items-start w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" role="status" aria-label="Loading activities">
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                        <ActivityItemSkeleton />
                    </div>
                ) : activitiesError ? (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full">
                        <span>Unable to load activity.</span>
                        <button onClick={() => window.location.reload()} className="text-primary font-semibold hover:underline">Retry</button>
                    </div>
                ) : activities && activities.length > 0 ? (
                    <>
                        <div className="flex flex-col items-start w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                            {activities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="flex items-start gap-4 p-5 border-b border-[#E5E7EB] last:border-b-0 w-full transition-colors hover:bg-[#F9FAFB] max-md:p-4 max-md:gap-3"
                                >
                                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                                        <span className="flex items-center gap-1.5 flex-wrap mb-1 font-sans font-bold text-sm leading-5 text-[#101828]">
                                            {activity.title}
                                        </span>
                                        <span className="font-sans font-medium text-sm leading-5.5 text-[#101828] max-md:text-sm max-md:leading-5">
                                            {activity.message || `Action performed`} by <strong>{activity.adminName}</strong>
                                        </span>
                                    </div>
                                    <span 
                                        className="font-sans font-medium text-xs leading-4 text-[#9CA3AF] whitespace-nowrap shrink-0"
                                        title={formatFullDateTime(activity.createdAt)}
                                    >
                                        {formatRelativeTime(activity.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-end gap-3 max-sm:gap-2 py-5 px-6 max-sm:py-4 max-sm:px-4 border-t border-[#E5E7EB] w-full max-md:flex-wrap max-md:gap-2.5 max-md:p-4">
                                <button
                                    className={cn(
                                        "inline-flex items-center justify-center px-5 max-sm:px-3 py-2.5 max-sm:py-2",
                                        "bg-white border border-[#E5E7EB] rounded-lg",
                                        "font-sans font-semibold text-sm max-sm:text-xs leading-5 text-[#4A5565]",
                                        "cursor-pointer shadow-sm transition-all duration-200",
                                        "hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md",
                                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#F3F4F6]"
                                    )}
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="pagination-info">
                                    Page {currentPage} of {totalPages} ({total} total)
                                </span>
                                <button
                                    className={cn(
                                        "inline-flex items-center justify-center px-5 max-sm:px-3 py-2.5 max-sm:py-2",
                                        "bg-white border border-[#E5E7EB] rounded-lg",
                                        "font-sans font-semibold text-sm max-sm:text-xs leading-5 text-[#4A5565]",
                                        "cursor-pointer shadow-sm transition-all duration-200",
                                        "hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md",
                                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#F3F4F6]"
                                    )}
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-start w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                        <div className="flex flex-col items-center justify-center py-15 max-sm:py-10 px-6 max-sm:px-4 text-center w-full min-h-60">
                            <div className="text-5.5xl max-sm:text-4xl mb-5 max-sm:mb-4 opacity-50">📋</div>
                            <p className="font-sans font-bold text-lg max-sm:text-base leading-6 text-[#101828] m-0 mb-2">No recent activity</p>
                            <p className="font-sans font-normal text-sm max-sm:text-xs leading-5 text-[#6A7282] m-0 max-w-80">Admin operations will appear here</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
