"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Column definition type
export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: string;
    render?: (item: T, index: number) => ReactNode;
}

// Sort configuration
export interface SortConfig {
    key: string;
    order: 'asc' | 'desc';
}

// DataTable props
export interface DataTableProps<T> {
    // Data
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    
    // Loading & empty states
    isLoading?: boolean;
    loadingRows?: number;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    
    // Header
    title?: string;
    totalCount?: number;
    headerActions?: ReactNode;
    
    // Sorting
    sortConfig?: SortConfig;
    onSort?: (key: string) => void;
    
    // Pagination
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    pageInfo?: string;
    
    // Row actions
    onRowClick?: (item: T) => void;
    rowClassName?: (item: T) => string;
    
    // Custom class
    className?: string;
}

// Sort Icon Component
function SortIcon({ active, order }: { active: boolean; order?: 'asc' | 'desc' }) {
    return (
        <span className={cn("sort-icon", active && order)}>
            <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </span>
    );
}

// Skeleton Row Component
function SkeletonRow({ columns }: { columns: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i}>
                    <div 
                        className="skeleton-box" 
                        style={{ 
                            width: '100%', 
                            height: '16px' 
                        }}
                    />
                </td>
            ))}
        </tr>
    );
}

// Main DataTable Component
export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    isLoading = false,
    loadingRows = 5,
    emptyIcon = '📋',
    emptyTitle = 'No data found',
    emptyDescription = 'No items match your criteria',
    title,
    totalCount,
    headerActions,
    sortConfig,
    onSort,
    currentPage = 0,
    totalPages = 1,
    onPageChange,
    pageInfo,
    onRowClick,
    rowClassName,
    className,
}: DataTableProps<T>) {
    
    const handleSort = (key: string) => {
        if (onSort) {
            onSort(key);
        }
    };

    const handlePrevPage = () => {
        if (onPageChange && currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (onPageChange && currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={cn("table-section", className)}>
            {/* Table Header */}
            {(title || headerActions) && (
                <div className="table-header-row">
                    <div className="flex items-center gap-3">
                        {title && <h2 className="table-title-responsive">{title}</h2>}
                        {totalCount !== undefined && (
                            <span className="pagination-info">{totalCount} total</span>
                        )}
                    </div>
                    {headerActions && (
                        <div className="flex items-center gap-3 flex-wrap">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="table-responsive-container">
                <table className="data-table-responsive">
                    <thead>
                        <tr>
                            {(columns || []).map((column) => (
                                <th 
                                    key={column.key}
                                    style={{ 
                                        textAlign: column.align || 'left',
                                        width: column.width,
                                    }}
                                >
                                    {column.sortable && onSort ? (
                                        <button
                                            className={cn(
                                                "sortable-header",
                                                sortConfig?.key === column.key && "active"
                                            )}
                                            onClick={() => handleSort(column.key)}
                                        >
                                            {column.header}
                                            <SortIcon 
                                                active={sortConfig?.key === column.key} 
                                                order={sortConfig?.order}
                                            />
                                        </button>
                                    ) : (
                                        column.header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: loadingRows }).map((_, i) => (
                                <SkeletonRow key={i} columns={(columns || []).length || 1} />
                            ))
                        ) : !data || data.length === 0 ? (
                            // Empty state
                            <tr>
                                <td 
                                    colSpan={(columns || []).length || 1} 
                                    style={{ textAlign: 'center', padding: '48px 24px' }}
                                >
                                    <div className="empty-state">
                                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>
                                            {emptyIcon}
                                        </span>
                                        <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>
                                            {emptyTitle}
                                        </h3>
                                        <p style={{ margin: 0, color: '#6B7280' }}>
                                            {emptyDescription}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Data rows
                            data.map((item, index) => (
                                <tr 
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        onRowClick && "cursor-pointer",
                                        rowClassName?.(item)
                                    )}
                                >
                                    {(columns || []).map((column) => (
                                        <td 
                                            key={column.key}
                                            data-label={column.header}
                                            style={{ textAlign: column.align || 'left' }}
                                        >
                                            {column.render 
                                                ? column.render(item, index)
                                                : (item as Record<string, unknown>)[column.key] as ReactNode
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages >= 1 && onPageChange && (
                <div className="pagination-row">
                    <span className="pagination-info">
                        {pageInfo || `Page ${currentPage + 1} of ${totalPages || 1}`}
                    </span>
                    <div className="pagination-buttons">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 0}
                            onClick={handlePrevPage}
                        >
                            Previous
                        </button>
                        <button
                            className="pagination-btn"
                            disabled={currentPage >= totalPages - 1}
                            onClick={handleNextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export types for use in other files
export type { Column as DataTableColumn, SortConfig as DataTableSortConfig };
