"use client";

import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
    /** Current page (0-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Items per page */
    pageSize: number;
    /** Called when page changes */
    onPageChange: (page: number) => void;
    /** Optional className for the container */
    className?: string;
    /** Label for the items (e.g., "activities", "users") */
    itemLabel?: string;
    /** Show compact version (mobile-friendly) */
    compact?: boolean;
    /** Show item count info */
    showItemCount?: boolean;
}

/**
 * Reusable Pagination Component
 * Consistent styling across all pages
 */
export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    className,
    itemLabel = "items",
    compact = false,
    showItemCount = true,
}: PaginationProps) {
    const handlePrev = useCallback(() => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage, totalPages, onPageChange]);

    // Don't render if only one page
    if (totalPages <= 1) {
        return null;
    }

    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

    return (
        <div className={cn(
            "flex items-center justify-between gap-3 py-4 px-6 border-t border-gray-200 w-full bg-white",
            "max-sm:py-3 max-sm:px-4 max-sm:flex-col max-sm:gap-3",
            compact && "py-3 px-4",
            className
        )}>
            {/* Item count info */}
            {showItemCount && (
                <span className="text-sm text-gray-500 max-sm:text-xs">
                    Showing {startItem}-{endItem} of {totalItems} {itemLabel}
                </span>
            )}

            {/* Navigation controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600",
                        "hover:bg-gray-50 hover:border-gray-300 transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
                    )}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-600 font-medium min-w-[80px] text-center max-sm:min-w-[60px] max-sm:text-xs">
                    Page {currentPage + 1} of {totalPages}
                </span>
                
                <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-600",
                        "hover:bg-gray-50 hover:border-gray-300 transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
                    )}
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default Pagination;
