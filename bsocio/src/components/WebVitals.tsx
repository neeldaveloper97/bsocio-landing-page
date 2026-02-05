'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log web vitals in development
    if (process.env.NODE_ENV === 'development') {
    }

    // In production, you can send to analytics
    // Example: sendToAnalytics(metric)
  });

  return null;
}
