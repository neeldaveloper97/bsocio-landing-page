"use client";

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useContacts } from '@/hooks';
import { ViewIcon } from '@/components/ui/admin-icons';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ContactInquiry, ContactStatus, ContactReason } from '@/types';
import './communications.css';

const REASON_LABELS: Record<ContactReason, string> = {
    'MEDIA_PRESS': 'Media/Press',
    'PARTNERSHIPS': 'Partnerships',
    'REPORT_SCAM': 'Report Scam',
    'GENERAL_INQUIRY': 'General Inquiry',
};

export default function CommunicationsPage() {
    const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
    const [reasonFilter, setReasonFilter] = useState<ContactReason | ''>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const pageSize = 5;

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showDetailModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showDetailModal]);

    // Hooks
    const { data: contactsData, isLoading } = useContacts({
        status: statusFilter || undefined,
        reason: reasonFilter || undefined,
        skip: currentPage * pageSize,
        take: pageSize,
    });

    const contacts = contactsData?.items || [];
    const total = contactsData?.total || 0;

    // Calculate stats (client-side estimate based on current filters)
    const newCount = contacts.filter((c: ContactInquiry) => c.status === 'NEW').length;
    const inProgressCount = contacts.filter((c: ContactInquiry) => c.status === 'IN_PROGRESS').length;
    const resolvedCount = contacts.filter((c: ContactInquiry) => c.status === 'RESOLVED').length;

    const getStatusBadge = (status: ContactStatus) => {
        switch (status) {
            case 'NEW':
                return <span className="status-badge status-draft">New</span>;
            case 'IN_PROGRESS':
                return <span className="status-badge status-upcoming">In Progress</span>;
            case 'RESOLVED':
                return <span className="status-badge status-active">Resolved</span>;
            default:
                return null;
        }
    };

    const getReasonBadge = (reason: ContactReason) => {
        const colors: Record<ContactReason, string> = {
            'MEDIA_PRESS': '#8b5cf6',
            'PARTNERSHIPS': '#3b82f6',
            'REPORT_SCAM': '#ef4444',
            'GENERAL_INQUIRY': '#6b7280',
        };
        
        return (
            <span 
                className="reason-badge"
                style={{ 
                    backgroundColor: `${colors[reason]}15`,
                    color: colors[reason],
                    border: `1px solid ${colors[reason]}30`,
                }}
            >
                {REASON_LABELS[reason]}
            </span>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleViewDetails = (inquiry: ContactInquiry) => {
        setSelectedInquiry(inquiry);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setSelectedInquiry(null);
        setShowDetailModal(false);
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Communications</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage contact inquiries and messages from users</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">✉️</div>
                    <div className="stat-value-responsive">
                        {isLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : total}
                    </div>
                    <div className="stat-label-responsive">Total Inquiries</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">🔴</div>
                    <div className="stat-value-responsive">
                        {isLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : newCount}
                    </div>
                    <div className="stat-label-responsive">New</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⏳</div>
                    <div className="stat-value-responsive">
                        {isLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : inProgressCount}
                    </div>
                    <div className="stat-label-responsive">In Progress</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">
                        {isLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : resolvedCount}
                    </div>
                    <div className="stat-label-responsive">Resolved</div>
                </div>
            </div>

            {/* Contact Inquiries Table - Using DataTable Component */}
            <DataTable<ContactInquiry>
                data={contacts || []}
                isLoading={isLoading}
                columns={[
                    {
                        key: 'fullName',
                        header: 'Name',
                        render: (inquiry) => (
                            <span 
                                className="line-clamp-2 max-w-[180px]" 
                                style={{ fontWeight: inquiry.status === 'NEW' ? 600 : 400 }}
                                title={inquiry.fullName}
                            >
                                {inquiry.fullName}
                            </span>
                        ),
                    },
                    {
                        key: 'email',
                        header: 'Email',
                        render: (inquiry) => (
                            <span className="line-clamp-1 max-w-[180px]" title={inquiry.email}>
                                {inquiry.email}
                            </span>
                        ),
                    },
                    {
                        key: 'reason',
                        header: 'Reason',
                        render: (inquiry) => getReasonBadge(inquiry.reason),
                    },
                    {
                        key: 'country',
                        header: 'Country',
                        render: (inquiry) => (
                            <span className="line-clamp-1 max-w-[120px]" title={inquiry.country}>
                                {inquiry.country}
                            </span>
                        ),
                    },
                    {
                        key: 'status',
                        header: 'Status',
                        align: 'center',
                        render: (inquiry) => getStatusBadge(inquiry.status),
                    },
                    {
                        key: 'createdAt',
                        header: 'Date',
                        render: (inquiry) => (
                            <span className="whitespace-nowrap">{formatDate(inquiry.createdAt)}</span>
                        ),
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (inquiry) => (
                            <div className="flex items-center justify-center">
                                <button 
                                    className="action-btn" 
                                    title="View Details"
                                    onClick={() => handleViewDetails(inquiry)}
                                >
                                    <ViewIcon />
                                </button>
                            </div>
                        ),
                    },
                ]}
                keyExtractor={(inquiry) => inquiry.id}
                title="Contact Inquiries"
                totalCount={total}
                headerActions={
                    <div className="flex items-center gap-3">
                        <Select 
                            value={statusFilter || 'all'} 
                            onValueChange={(value) => {
                                setStatusFilter(value === 'all' ? '' : value as ContactStatus);
                                setCurrentPage(0);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="NEW">New</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select 
                            value={reasonFilter || 'all'} 
                            onValueChange={(value) => {
                                setReasonFilter(value === 'all' ? '' : value as ContactReason);
                                setCurrentPage(0);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Reasons" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reasons</SelectItem>
                                <SelectItem value="MEDIA_PRESS">Media/Press</SelectItem>
                                <SelectItem value="PARTNERSHIPS">Partnerships</SelectItem>
                                <SelectItem value="REPORT_SCAM">Report Scam</SelectItem>
                                <SelectItem value="GENERAL_INQUIRY">General Inquiry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
                emptyIcon="✉️"
                emptyTitle="No inquiries found"
                emptyDescription="No contact inquiries match your filters"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Detail Modal */}
            {showDetailModal && selectedInquiry && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3 overflow-hidden" onClick={(e) => e.target === e.currentTarget && closeDetailModal()}>
                    <div className="bg-white rounded-2xl max-sm:rounded-xl w-full max-w-[640px] max-sm:max-w-[95vw] max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] pr-14 max-sm:pr-12 relative flex-shrink-0">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Inquiry Details</h2>
                            <button className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" onClick={closeDetailModal}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 overflow-y-auto flex-1">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Name</span>
                                    <span className="text-gray-900 break-all">{selectedInquiry.fullName}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Email</span>
                                    <span className="text-gray-900 break-all">
                                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">{selectedInquiry.email}</a>
                                    </span>
                                </div>
                                {selectedInquiry.phone && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-gray-500">Phone</span>
                                        <span className="text-gray-900">{selectedInquiry.phone}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Country</span>
                                    <span className="text-gray-900">{selectedInquiry.country}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Reason</span>
                                    <span className="text-gray-900">{getReasonBadge(selectedInquiry.reason)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Status</span>
                                    <span className="text-gray-900">{getStatusBadge(selectedInquiry.status)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Submitted</span>
                                    <span className="text-gray-900">{formatDate(selectedInquiry.createdAt)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-500">Message</span>
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 break-words whitespace-pre-wrap">
                                        {selectedInquiry.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] flex-shrink-0">
                            <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={closeDetailModal}>
                                Close
                            </button>
                            <a 
                                href={`mailto:${selectedInquiry.email}?subject=Re: ${REASON_LABELS[selectedInquiry.reason]}`}
                                className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] no-underline inline-flex items-center justify-center"
                            >
                                Reply via Email
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
