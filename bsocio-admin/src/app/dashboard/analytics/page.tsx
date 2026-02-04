"use client";

import { useState, useCallback, useMemo } from 'react';
import { useAnalytics } from '@/hooks';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate available years (from 2020 to current year)
const START_YEAR = 2020;

export default function AnalyticsPage() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-indexed
    
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Generate available years (past years only, no future years)
    const availableYears = useMemo(() => {
        const years: number[] = [];
        for (let year = currentYear; year >= START_YEAR; year--) {
            years.push(year);
        }
        return years;
    }, [currentYear]);

    const { data, isLoading, isError, refetch } = useAnalytics({
        params: { year: selectedYear, month: selectedMonth }
    });

    // Handle year change
    const handleYearChange = (year: string) => {
        const newYear = parseInt(year, 10);
        setSelectedYear(newYear);
    };

    const handleMonthChange = (monthIndex: number) => {
        // Allow all months to be selected
        setSelectedMonth(monthIndex + 1);
    };

    // Check if a month is disabled - now all months are enabled
    const isMonthDisabled = (_monthIndex: number) => {
        // All months are now enabled for viewing analytics data
        return false;
    };

    // Helper function to format date properly
    const formatDateForCSV = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = MONTHS[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Export ALL analytics data as CSV (signups + birthdays)
    const handleExportSignups = useCallback(() => {
        if (!data) return;

        const rows: string[][] = [];
        
        // Title
        rows.push([`Analytics Report - ${MONTHS[selectedMonth - 1]} ${selectedYear}`]);
        rows.push([]);
        
        // ===== SIGNUP METRICS SECTION =====
        rows.push(['=== SIGN-UP METRICS ===']);
        rows.push([]);
        
        // Signup Summary
        rows.push(['Sign-Up Summary']);
        rows.push(['Metric', 'Value']);
        rows.push(['Total Sign-ups (All Time)', data.signups?.total?.toString() || '0']);
        rows.push(['Monthly Total', data.signups?.monthlyTotal?.toString() || '0']);
        rows.push(['Today', data.signups?.today?.toString() || '0']);
        rows.push(['This Week', data.signups?.thisWeek?.toString() || '0']);
        rows.push(['This Month', data.signups?.thisMonth?.toString() || '0']);
        rows.push(['Last Month', data.signups?.lastMonth?.toString() || '0']);
        rows.push(['Growth %', (data.signups?.growthPercent?.toFixed(2) || '0') + '%']);
        rows.push([]);
        
        // Daily Signup Trend
        if (data.signupTrend && data.signupTrend.length > 0) {
            rows.push(['Daily Sign-up Trend']);
            rows.push(['Date', 'Sign-ups']);
            data.signupTrend.forEach(item => {
                rows.push([formatDateForCSV(item.date), item.count.toString()]);
            });
            rows.push([]);
        }
        
        // Monthly Signups (All 12 months)
        if (data.monthlySignups && data.monthlySignups.length > 0) {
            rows.push(['Monthly Sign-ups Overview']);
            rows.push(['Month', 'Sign-ups']);
            data.monthlySignups.forEach(item => {
                rows.push([`${item.month} ${selectedYear}`, item.value.toString()]);
            });
            rows.push([]);
        }
        
        // ===== BIRTHDAY METRICS SECTION =====
        rows.push(['=== BIRTHDAY METRICS ===']);
        rows.push([]);
        
        rows.push(['Birthday Summary']);
        rows.push(['Total Birthdays This Month', data.birthdays?.totalThisMonth?.toString() || '0']);
        rows.push([]);
        
        if (data.birthdays?.calendar && data.birthdays.calendar.length > 0) {
            rows.push(['Birthdays by Day of Week']);
            rows.push(['Day', 'Count']);
            data.birthdays.calendar.forEach(day => {
                rows.push([day.dayName, day.count.toString()]);
            });
        }

        const csvContent = rows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [data, selectedMonth, selectedYear]);

    // Export birthday data only as CSV
    const handleExportBirthdays = useCallback(() => {
        if (!data?.birthdays) return;

        const rows: string[][] = [];
        
        // Title
        rows.push([`Birthday Report - ${MONTHS[selectedMonth - 1]} ${selectedYear}`]);
        rows.push([]);
        
        // Summary
        rows.push(['Period', `${MONTHS[selectedMonth - 1]} ${selectedYear}`]);
        rows.push(['Total Birthdays', data.birthdays.totalThisMonth?.toString() || '0']);
        rows.push([]);
        
        // Birthdays by day of week
        rows.push(['Birthdays by Day of Week']);
        rows.push(['Day', 'Count']);
        data.birthdays.calendar.forEach(day => {
            rows.push([day.dayName, day.count.toString()]);
        });

        const csvContent = rows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `birthdays_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [data, selectedMonth, selectedYear]);

    if (isLoading) {
        return (
            <div className="min-w-full" role="status" aria-label="Loading analytics">
                {/* Header Skeleton */}
                <div>
                    <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-md" style={{ width: '220px', height: '32px' }} />
                    <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded" style={{ width: '300px', height: '20px', marginTop: '12px' }} />
                </div>
                
                {/* Section Header Skeleton */}
                <div style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded" style={{ width: '160px', height: '24px' }} />
                        <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-lg" style={{ width: '130px', height: '42px' }} />
                    </div>
                    
                    {/* Month Tabs Skeleton */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-full" style={{ width: '58px', height: '40px' }} />
                        ))}
                    </div>
                    
                    {/* Main Stats Card Skeleton */}
                    <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-xl" style={{ width: '100%', height: '200px', marginBottom: '16px' }} />
                    
                    {/* Quick Stats Row Skeleton */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-lg" style={{ height: '100px' }} />
                        ))}
                    </div>
                </div>
                
                {/* Trend Graph Skeleton */}
                <div style={{ marginTop: '24px' }}>
                    <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-xl" style={{ width: '100%', height: '240px' }} />
                </div>
                
                {/* Birthday Section Skeleton */}
                <div style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded" style={{ width: '180px', height: '24px' }} />
                        <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-lg" style={{ width: '180px', height: '42px' }} />
                    </div>
                    
                    {/* Birthday Total Card Skeleton */}
                    <div className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-xl" style={{ width: '100%', height: '100px', marginBottom: '20px' }} />
                    
                    {/* Calendar Skeleton */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="bg-gradient-to-r from-[#E5E7EB] via-[#F3F4F6] to-[#E5E7EB] animate-pulse rounded-xl" style={{ height: '90px' }} />
                        ))}
                    </div>
                </div>
                
                <span className="sr-only">Loading analytics data...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={{ minWidth: '100%' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <p style={{ color: '#DC2626', fontWeight: 500, fontSize: '15px', marginBottom: '16px' }}>
                            Failed to load analytics.
                        </p>
                        <Button 
                            onClick={() => refetch()}
                            style={{
                                backgroundColor: '#2563EB',
                                color: '#FFFFFF',
                                padding: '10px 24px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500
                            }}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const defaultCalendar = [
        { dayName: 'Monday', count: 0 },
        { dayName: 'Tuesday', count: 0 },
        { dayName: 'Wednesday', count: 0 },
        { dayName: 'Thursday', count: 0 },
        { dayName: 'Friday', count: 0 },
        { dayName: 'Saturday', count: 0 },
        { dayName: 'Sunday', count: 0 }
    ];

    const birthdayCalendar = data?.birthdays?.calendar && data.birthdays.calendar.length > 0 
        ? data.birthdays.calendar 
        : defaultCalendar;

    return (
        <div className="flex flex-col items-start gap-8 max-md:gap-6 max-sm:gap-4 w-full">
            {/* Page Header */}
            <div className="flex flex-row justify-between items-start gap-5 max-sm:gap-3 flex-wrap w-full">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 className="font-sans text-3xl max-md:text-2xl max-sm:text-xl font-bold text-[#101828] m-0">Analytics & Metrics</h1>
                    <p className="font-sans text-base max-sm:text-sm font-normal text-[#6B7280] m-0">Track sign-ups, engagement, and birthday data.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Sign-Up Metrics Section */}
            <section className="flex flex-col gap-4 max-sm:gap-3 w-full">
                {/* Section Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 max-sm:gap-2">
                    <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Sign-Up Metrics</h2>
                    <button onClick={handleExportSignups} className="inline-flex items-center gap-2 px-4 max-sm:px-3 py-2.5 max-sm:py-2 bg-white border border-[#E5E7EB] rounded-lg font-sans text-sm max-sm:text-xs font-medium text-[#374151] cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#F9FAFB] hover:border-[#D1D5DB]">
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        <span className="max-sm:hidden">Export Data</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>

                {/* Month Tabs */}
                <div className="flex gap-2 max-sm:gap-1.5 flex-wrap">
                    {MONTHS.map((month, index) => {
                        const isDisabled = isMonthDisabled(index);
                        const isSelected = selectedMonth === index + 1;
                        
                        return (
                            <button
                                key={month}
                                onClick={() => handleMonthChange(index)}
                                disabled={isDisabled}
                                className={cn(
                                    "px-6 max-sm:px-3 py-3 max-sm:py-2 bg-white border border-[#E5E7EB] rounded-full font-sans text-sm max-sm:text-xs font-medium text-[#6B7280] cursor-pointer transition-all duration-150 hover:bg-[#F3F4F6] hover:border-[#D1D5DB] hover:text-[#374151]",
                                    isSelected && "bg-[#2563EB] border-[#2563EB] text-white hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white",
                                    isDisabled && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {month}
                            </button>
                        );
                    })}
                </div>

                {/* Signup Stats Wrapper */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                    {/* Total Signups Card - Blue Gradient */}
                    <div className="flex flex-col items-center justify-center py-10 max-sm:py-6 px-6 max-sm:px-4 bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] text-center">
                        <span className="font-sans text-xs font-semibold text-white/90 uppercase tracking-wide mb-3 max-sm:mb-2">TOTAL SIGN-UPS</span>
                        <span className="font-sans text-5xl max-md:text-4xl max-sm:text-3xl font-bold text-white leading-none mb-2">
                            {data?.signups?.monthlyTotal?.toLocaleString() ?? '0'}
                        </span>
                        <span className="font-sans text-sm max-sm:text-xs font-medium text-white/80">
                            {data?.signups?.monthlyPeriod ?? `${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                        </span>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                        {[
                            { label: 'Today', value: data?.signups?.today ?? 0 },
                            { label: 'This Week', value: data?.signups?.thisWeek ?? 0 },
                            { label: 'This Month', value: data?.signups?.thisMonth ?? 0 },
                            { label: 'Last Month', value: data?.signups?.lastMonth ?? 0 },
                            { label: 'Growth', value: data?.signups?.growthPercent ?? 0, isGrowth: true }
                        ].map((stat, index, arr) => (
                            <div
                                key={stat.label}
                                className={cn(
                                    "flex flex-col items-center justify-center py-6 max-sm:py-4 px-4 max-sm:px-3 text-center",
                                    index < arr.length - 1 && "border-r border-[#E5E7EB] max-sm:border-r-0 max-sm:border-b"
                                )}
                            >
                                <span className="font-sans text-xs max-sm:text-[10px] font-medium text-[#6B7280] uppercase tracking-wide mb-2 max-sm:mb-1">{stat.label}</span>
                                <span className={cn(
                                    "font-sans text-2xl max-sm:text-xl font-bold text-[#101828]",
                                    stat.isGrowth && (stat.value >= 0 ? "text-[#10B981]" : "text-[#EF4444]")
                                )}>
                                    {stat.isGrowth 
                                        ? `${stat.value >= 0 ? '+' : ''}${stat.value.toFixed(1)}%`
                                        : stat.value.toLocaleString()
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trend Graph Section */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 max-sm:p-4">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#2563EB', flexShrink: 0 }} />
                        <h3 className="font-sans text-lg max-sm:text-base font-bold text-[#101828] m-0">Trend Graphs & Comparisons</h3>
                    </div>
                    <div className="min-h-40">
                        {data?.signupTrend && data.signupTrend.length > 0 ? (
                            (() => {
                                const maxCount = Math.max(...data.signupTrend.map(t => t.count), 1);
                                const chartHeight = 128; // h-32 = 128px
                                return (
                                    <div className="flex items-end gap-1 max-sm:gap-0.5 overflow-x-auto pb-2" style={{ height: `${chartHeight + 24}px` }}>
                                        {data.signupTrend.map((item) => {
                                            const heightPx = Math.max(10, (item.count / maxCount) * chartHeight);
                                            return (
                                                <div key={item.date} className="flex flex-col items-center flex-1 min-w-[12px] max-sm:min-w-[8px]">
                                                    <div 
                                                        className="w-full bg-[#2563EB] rounded-t transition-all duration-300 hover:bg-[#1D4ED8]"
                                                        style={{ height: `${heightPx}px` }}
                                                        title={`${item.date}: ${item.count} signups`}
                                                    />
                                                    <span className="font-sans text-xs max-sm:text-[10px] text-[#6B7280] mt-1">
                                                        {new Date(item.date).getDate()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <TrendingUp style={{ width: '48px', height: '48px', color: '#D1D5DB', marginBottom: '12px' }} />
                                <p className="text-[#6B7280] text-sm">
                                    No signup data available for {MONTHS[selectedMonth - 1]} {selectedYear}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Birthday Metrics Section */}
            <section className="flex flex-col gap-4 max-sm:gap-3 w-full">
                {/* Section Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 max-sm:gap-2">
                    <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Birthday Metrics</h2>
                    <button onClick={handleExportBirthdays} className="inline-flex items-center gap-2 px-4 max-sm:px-3 py-2.5 max-sm:py-2 bg-white border border-[#E5E7EB] rounded-lg font-sans text-sm max-sm:text-xs font-medium text-[#374151] cursor-pointer transition-all duration-150 whitespace-nowrap hover:bg-[#F9FAFB] hover:border-[#D1D5DB]">
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        <span className="max-sm:hidden">Export Birthday Data (CSV)</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>

                {/* Birthday Total Card */}
                <div className="flex items-center gap-4 max-sm:gap-3 p-6 max-sm:p-4 bg-white border border-[#E5E7EB] rounded-xl">
                    <div className="shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-sm:w-8 max-sm:h-8">
                            <rect width="40" height="40" rx="8" fill="#FFF7ED"/>
                            <path d="M28 14H12C11.4477 14 11 14.4477 11 15V29C11 29.5523 11.4477 30 12 30H28C28.5523 30 29 29.5523 29 29V15C29 14.4477 28.5523 14 28 14Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M24 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11 20H29" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-sans text-sm max-sm:text-xs font-medium text-[#6B7280]">Total Birthdays This Month</span>
                        <span className="font-sans text-3xl max-sm:text-2xl font-bold text-[#111827]">
                            {data?.birthdays?.totalThisMonth?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                </div>

                {/* Birthday Calendar Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 max-sm:p-4">
                    <h3 className="font-sans text-lg max-sm:text-base font-bold text-[#101828] mb-5 max-sm:mb-4">Birthdays by Day (Calendar View)</h3>
                    <div className="grid grid-cols-7 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-4 max-sm:gap-2">
                        {birthdayCalendar.map((day) => (
                            <div key={day.dayName} className="flex flex-col items-center justify-center py-5 max-sm:py-3 px-4 max-sm:px-2 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl">
                                <span className="font-sans text-sm max-sm:text-xs font-medium text-[#9A3412] mb-2 max-sm:mb-1">{day.dayName}</span>
                                <span className="font-sans text-2xl max-sm:text-lg font-bold text-[#EA580C]">
                                    {day.count?.toLocaleString() ?? '0'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
