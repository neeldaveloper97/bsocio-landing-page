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
import './analytics.css';

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
        
        // If selecting current year, ensure month is not in future
        if (newYear === currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth);
        }
    };

    const handleMonthChange = (monthIndex: number) => {
        // For current year, only allow months up to current month
        // For past years, allow all months
        if (selectedYear < currentYear || monthIndex + 1 <= currentMonth) {
            setSelectedMonth(monthIndex + 1);
        }
    };

    // Check if a month is disabled
    const isMonthDisabled = (monthIndex: number) => {
        // For current year, disable future months
        if (selectedYear === currentYear) {
            return monthIndex + 1 > currentMonth;
        }
        // For past years, all months are enabled
        return false;
    };

    // Export signup data as CSV
    const handleExportSignups = useCallback(() => {
        if (!data?.signupTrend) return;

        const headers = ['Date', 'Sign-ups'];
        const rows = data.signupTrend.map(item => [item.date, item.count.toString()]);
        
        // Add summary row
        rows.push([]);
        rows.push(['Summary']);
        rows.push(['Total Sign-ups', data.signups?.monthlyTotal?.toString() || '0']);
        rows.push(['Today', data.signups?.today?.toString() || '0']);
        rows.push(['This Week', data.signups?.thisWeek?.toString() || '0']);
        rows.push(['This Month', data.signups?.thisMonth?.toString() || '0']);
        rows.push(['Last Month', data.signups?.lastMonth?.toString() || '0']);
        rows.push(['Growth %', data.signups?.growthPercent?.toFixed(2) + '%' || '0%']);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `signups_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [data, selectedMonth, selectedYear]);

    // Export birthday data as CSV
    const handleExportBirthdays = useCallback(() => {
        if (!data?.birthdays) return;

        const headers = ['Day of Week', 'Birthday Count'];
        const rows = data.birthdays.calendar.map(day => [day.dayName, day.count.toString()]);
        
        // Add summary
        rows.push([]);
        rows.push(['Total Birthdays This Month', data.birthdays.totalThisMonth?.toString() || '0']);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
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
            <div className="analytics-loading" role="status" aria-label="Loading analytics">
                {/* Header Skeleton */}
                <div className="analytics-loading-header">
                    <div className="skeleton-box" style={{ width: '220px', height: '32px', borderRadius: '6px' }} />
                    <div className="skeleton-box" style={{ width: '300px', height: '20px', marginTop: '12px', borderRadius: '4px' }} />
                </div>
                
                {/* Section Header Skeleton */}
                <div className="analytics-loading-section" style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="skeleton-box" style={{ width: '160px', height: '24px', borderRadius: '4px' }} />
                        <div className="skeleton-box" style={{ width: '130px', height: '42px', borderRadius: '8px' }} />
                    </div>
                    
                    {/* Month Tabs Skeleton */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="skeleton-box" style={{ width: '58px', height: '40px', borderRadius: '20px' }} />
                        ))}
                    </div>
                    
                    {/* Main Stats Card Skeleton */}
                    <div className="skeleton-box" style={{ width: '100%', height: '200px', borderRadius: '12px', marginBottom: '16px' }} />
                    
                    {/* Quick Stats Row Skeleton */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton-box" style={{ height: '100px', borderRadius: '8px' }} />
                        ))}
                    </div>
                </div>
                
                {/* Trend Graph Skeleton */}
                <div className="analytics-loading-section" style={{ marginTop: '24px' }}>
                    <div className="skeleton-box" style={{ width: '100%', height: '240px', borderRadius: '12px' }} />
                </div>
                
                {/* Birthday Section Skeleton */}
                <div className="analytics-loading-section" style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="skeleton-box" style={{ width: '180px', height: '24px', borderRadius: '4px' }} />
                        <div className="skeleton-box" style={{ width: '180px', height: '42px', borderRadius: '8px' }} />
                    </div>
                    
                    {/* Birthday Total Card Skeleton */}
                    <div className="skeleton-box" style={{ width: '100%', height: '100px', borderRadius: '12px', marginBottom: '20px' }} />
                    
                    {/* Calendar Skeleton */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="skeleton-box" style={{ height: '90px', borderRadius: '10px' }} />
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
        <div className="analytics-page">
            {/* Page Header */}
            <div className="analytics-header">
                <div className="analytics-header-left">
                    <h1>Analytics & Metrics</h1>
                    <p>Track sign-ups, engagement, and birthday data.</p>
                </div>
                <div className="analytics-header-right">
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="year-filter-trigger">
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
            <section className="signup-section">
                {/* Section Header */}
                <div className="section-header">
                    <h2>Sign-Up Metrics</h2>
                    <button onClick={handleExportSignups} className="btn-export">
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        Export Data
                    </button>
                </div>

                {/* Month Tabs */}
                <div className="month-tabs">
                    {MONTHS.map((month, index) => {
                        const isDisabled = isMonthDisabled(index);
                        const isSelected = selectedMonth === index + 1;
                        
                        return (
                            <button
                                key={month}
                                onClick={() => handleMonthChange(index)}
                                disabled={isDisabled}
                                className={`month-tab ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            >
                                {month}
                            </button>
                        );
                    })}
                </div>

                {/* Signup Stats Wrapper */}
                <div className="signup-stats-card">
                    {/* Total Signups Card - Blue Gradient */}
                    <div className="total-signups-hero">
                        <span className="total-signups-label">TOTAL SIGN-UPS</span>
                        <span className="total-signups-value">
                            {data?.signups?.monthlyTotal?.toLocaleString() ?? '0'}
                        </span>
                        <span className="total-signups-period">
                            {data?.signups?.monthlyPeriod ?? `${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                        </span>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="quick-stats-grid">
                        {[
                            { label: 'Today', value: data?.signups?.today ?? 0 },
                            { label: 'This Week', value: data?.signups?.thisWeek ?? 0 },
                            { label: 'This Month', value: data?.signups?.thisMonth ?? 0 },
                            { label: 'Last Month', value: data?.signups?.lastMonth ?? 0 },
                            { label: 'Growth', value: data?.signups?.growthPercent ?? 0, isGrowth: true }
                        ].map((stat, index, arr) => (
                            <div
                                key={stat.label}
                                className={`quick-stat-item ${index < arr.length - 1 ? 'with-border' : ''}`}
                            >
                                <span className="quick-stat-label">{stat.label}</span>
                                <span className={`quick-stat-value ${stat.isGrowth ? (stat.value >= 0 ? 'growth-positive' : 'growth-negative') : ''}`}>
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
                <div className="trend-graph-card">
                    <div className="trend-graph-header">
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#2563EB', flexShrink: 0 }} />
                        <h3>Trend Graphs & Comparisons</h3>
                    </div>
                    <div className="trend-graph-content">
                        {data?.signupTrend && data.signupTrend.length > 0 ? (
                            <div className="trend-bars-container">
                                {data.signupTrend.map((item) => {
                                    const maxCount = Math.max(...data.signupTrend.map(t => t.count), 1);
                                    const heightPercent = Math.max(8, (item.count / maxCount) * 100);
                                    return (
                                        <div key={item.date} className="trend-bar-item">
                                            <div 
                                                className="trend-bar"
                                                style={{ height: `${heightPercent}%` }}
                                                title={`${item.date}: ${item.count} signups`}
                                            />
                                            <span className="trend-bar-label">
                                                {new Date(item.date).getDate()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="trend-empty-message">
                                Interactive trend graph visualization would display here
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Birthday Metrics Section */}
            <section className="birthday-section">
                {/* Section Header */}
                <div className="section-header">
                    <h2>Birthday Metrics</h2>
                    <button onClick={handleExportBirthdays} className="btn-export">
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        Export Birthday Data (CSV)
                    </button>
                </div>

                {/* Birthday Total Card */}
                <div className="birthday-total-card">
                    <div className="birthday-icon">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="8" fill="#FFF7ED"/>
                            <path d="M28 14H12C11.4477 14 11 14.4477 11 15V29C11 29.5523 11.4477 30 12 30H28C28.5523 30 29 29.5523 29 29V15C29 14.4477 28.5523 14 28 14Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M24 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11 20H29" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="birthday-info">
                        <span className="birthday-label">Total Birthdays This Month</span>
                        <span className="birthday-value">
                            {data?.birthdays?.totalThisMonth?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                </div>

                {/* Birthday Calendar Card */}
                <div className="birthday-calendar-card">
                    <h3>Birthdays by Day (Calendar View)</h3>
                    <div className="birthday-calendar-grid">
                        {birthdayCalendar.map((day) => (
                            <div key={day.dayName} className="birthday-day-card">
                                <span className="birthday-day-name">{day.dayName}</span>
                                <span className="birthday-day-count">
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
