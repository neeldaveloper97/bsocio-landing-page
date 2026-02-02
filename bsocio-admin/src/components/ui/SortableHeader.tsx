"use client";

import React from 'react';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortBy: string;
  currentSortOrder: 'asc' | 'desc';
  onSort: (field: string, order: 'asc' | 'desc') => void;
  style?: React.CSSProperties;
}

export function SortableHeader({
  label,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
  style,
}: SortableHeaderProps) {
  const isActive = currentSortBy === field;

  const handleClick = () => {
    if (isActive) {
      // Toggle order if same field
      onSort(field, currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new field
      onSort(field, 'asc');
    }
  };

  return (
    <th 
      className="px-6 py-4 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB]"
      style={style}
    >
      <button
        type="button"
        className={`sortable-header ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        aria-label={`Sort by ${label} ${isActive ? (currentSortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
      >
        {label}
        <span className={`sort-icon ${isActive ? currentSortOrder : ''}`}>
          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </th>
  );
}

export default SortableHeader;
