"use client";

import { useState } from 'react';
import { useAnalytics } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, TrendingUp } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear] = useState(currentDate.getFullYear());

    const { data, isLoading, isError, refetch } = useAnalytics({
        params: { year: selectedYear, month: selectedMonth }
    });

    const handleMonthChange = (monthIndex: number) => {
        setSelectedMonth(monthIndex + 1);
    };

    const handleExportSignups = () => {
        console.log('Exporting signup data...');
    };

    const handleExportBirthdays = () => {
        console.log('Exporting birthday data...');
    };

    if (isLoading) {
        return (
            <div style={{ minWidth: '100%' }}>
                <div style={{ marginBottom: '32px' }}>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="w-full rounded-xl mb-6" style={{ height: '300px' }} />
                <Skeleton className="w-full rounded-xl" style={{ height: '200px' }} />
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
        <div style={{ minWidth: '100%' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '8px',
                    lineHeight: 1.2
                }}>
                    Analytics & Metrics
                </h1>
                <p style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#6B7280',
                    lineHeight: 1.5,
                    margin: 0
                }}>
                    Track sign-ups, engagement, and birthday data.
                </p>
            </div>

            {/* Sign-Up Metrics Section */}
            <section style={{ marginBottom: '32px' }}>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <h2 style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                    }}>
                        Sign-Up Metrics
                    </h2>
                    <button
                        onClick={handleExportSignups}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#374151',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        Export Data
                    </button>
                </div>

                {/* Month Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {MONTHS.map((month, index) => (
                        <button
                            key={month}
                            onClick={() => handleMonthChange(index)}
                            style={{
                                padding: '10px 18px',
                                backgroundColor: selectedMonth === index + 1 ? '#2563EB' : '#FFFFFF',
                                border: `1px solid ${selectedMonth === index + 1 ? '#2563EB' : '#E5E7EB'}`,
                                borderRadius: '20px',
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                fontSize: '14px',
                                fontWeight: 500,
                                color: selectedMonth === index + 1 ? '#FFFFFF' : '#6B7280',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {month}
                        </button>
                    ))}
                </div>

                {/* Signup Stats Wrapper */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {/* Total Signups Card - Blue Gradient */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 24px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
                        textAlign: 'center'
                    }}>
                        <span style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px'
                        }}>
                            TOTAL SIGN-UPS
                        </span>
                        <span style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '56px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1,
                            marginBottom: '8px'
                        }}>
                            {data?.signups?.monthlyTotal?.toLocaleString() ?? '0'}
                        </span>
                        <span style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '15px',
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.85)'
                        }}>
                            {data?.signups?.monthlyPeriod ?? `${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                        </span>
                    </div>

                    {/* Quick Stats Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        {[
                            { label: 'Today', value: data?.signups?.today ?? 0 },
                            { label: 'This Week', value: data?.signups?.thisWeek ?? 0 },
                            { label: 'This Month', value: data?.signups?.thisMonth ?? 0 },
                            { label: 'Last Month', value: data?.signups?.lastMonth ?? 0 },
                            { label: 'Growth', value: data?.signups?.growthPercent ?? 0, isGrowth: true }
                        ].map((stat, index, arr) => (
                            <div
                                key={stat.label}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '24px 16px',
                                    textAlign: 'center',
                                    borderRight: index < arr.length - 1 ? '1px solid #E5E7EB' : 'none'
                                }}
                            >
                                <span style={{
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#6B7280',
                                    marginBottom: '8px'
                                }}>
                                    {stat.label}
                                </span>
                                <span style={{
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontSize: '28px',
                                    fontWeight: 600,
                                    color: stat.isGrowth 
                                        ? (stat.value >= 0 ? '#65A30D' : '#DC2626')
                                        : '#2563EB'
                                }}>
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
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    marginTop: '24px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px 24px',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#2563EB', flexShrink: 0 }} />
                        <h3 style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#111827',
                            margin: 0
                        }}>
                            Trend Graphs & Comparisons
                        </h3>
                    </div>
                    <div style={{
                        padding: '32px 24px',
                        minHeight: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {data?.signupTrend && data.signupTrend.length > 0 ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '4px',
                                height: '140px',
                                width: '100%',
                                overflowX: 'auto',
                                paddingBottom: '8px'
                            }}>
                                {data.signupTrend.map((item) => {
                                    const maxCount = Math.max(...data.signupTrend.map(t => t.count), 1);
                                    const heightPercent = Math.max(8, (item.count / maxCount) * 100);
                                    return (
                                        <div key={item.date} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            minWidth: '24px',
                                            flex: '0 0 auto',
                                            height: '100%'
                                        }}>
                                            <div 
                                                style={{ 
                                                    width: '18px',
                                                    minHeight: '6px',
                                                    height: `${heightPercent}%`,
                                                    background: 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)',
                                                    borderRadius: '4px 4px 0 0',
                                                    marginTop: 'auto',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title={`${item.date}: ${item.count} signups`}
                                            />
                                            <span style={{
                                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                                fontSize: '10px',
                                                fontWeight: 500,
                                                color: '#9CA3AF',
                                                marginTop: '8px'
                                            }}>
                                                {new Date(item.date).getDate()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{
                                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                fontSize: '14px',
                                color: '#9CA3AF',
                                margin: 0
                            }}>
                                Interactive trend graph visualization would display here
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Birthday Metrics Section */}
            <section>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <h2 style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                    }}>
                        Birthday Metrics
                    </h2>
                    <button
                        onClick={handleExportBirthdays}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#374151',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Download style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        Export Birthday Data (CSV)
                    </button>
                </div>

                {/* Birthday Total Card */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    marginBottom: '20px'
                }}>
                    <div style={{ flexShrink: 0 }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="8" fill="#FFF7ED"/>
                            <path d="M28 14H12C11.4477 14 11 14.4477 11 15V29C11 29.5523 11.4477 30 12 30H28C28.5523 30 29 29.5523 29 29V15C29 14.4477 28.5523 14 28 14Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M24 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11 20H29" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#6B7280',
                            marginBottom: '4px'
                        }}>
                            Total Birthdays This Month
                        </span>
                        <span style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: '32px',
                            fontWeight: 700,
                            color: '#EA580C',
                            lineHeight: 1
                        }}>
                            {data?.birthdays?.totalThisMonth?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                </div>

                {/* Birthday Calendar Card */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <h3 style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: '0 0 20px 0'
                    }}>
                        Birthdays by Day (Calendar View)
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                        gap: '12px',
                        width: '100%'
                    }}>
                        {birthdayCalendar.map((day) => (
                            <div 
                                key={day.dayName}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px 12px',
                                    backgroundColor: '#F9FAFB',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <span style={{
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    marginBottom: '8px'
                                }}>
                                    {day.dayName}
                                </span>
                                <span style={{
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    fontSize: '22px',
                                    fontWeight: 600,
                                    color: '#2563EB'
                                }}>
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
