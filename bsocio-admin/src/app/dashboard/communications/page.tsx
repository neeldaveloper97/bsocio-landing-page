"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useContacts } from '@/hooks';
import { ViewIcon } from '@/components/ui/admin-icons';
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
    const pageSize = 20;

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

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="content-section active">
                <div className="section-header-with-btn">
                    <div className="section-intro">
                        <h1>Communications</h1>
                        <p>Manage contact inquiries from users</p>
                    </div>
                </div>
                <div className="stats-cards-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card skeleton-card">
                            <div className="skeleton-box" style={{ width: '40px', height: '40px', borderRadius: '8px' }}></div>
                            <div className="skeleton-box" style={{ width: '60px', height: '32px', marginTop: '8px' }}></div>
                            <div className="skeleton-box" style={{ width: '80px', height: '14px', marginTop: '8px' }}></div>
                        </div>
                    ))}
                </div>
                <div className="table-container">
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Reason</th>
                                    <th>Country</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td><div className="skeleton-box" style={{ width: '120px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '180px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '100px', height: '24px', borderRadius: '12px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '80px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '120px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '60px', height: '24px' }}></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Communications</h1>
                    <p>Manage contact inquiries and messages from users</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">✉️</div>
                    <div className="stat-value">{total}</div>
                    <div className="stat-label">Total Inquiries</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">🔴</div>
                    <div className="stat-value">{newCount}</div>
                    <div className="stat-label">New</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{inProgressCount}</div>
                    <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">{resolvedCount}</div>
                    <div className="stat-label">Resolved</div>
                </div>
            </div>

            {/* Filters */}
            <div className="table-filters" style={{ marginBottom: '16px' }}>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value as ContactStatus | '');
                        setCurrentPage(0);
                    }}
                    className="form-select"
                    style={{ maxWidth: '180px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
                <select
                    value={reasonFilter}
                    onChange={(e) => {
                        setReasonFilter(e.target.value as ContactReason | '');
                        setCurrentPage(0);
                    }}
                    className="form-select"
                    style={{ maxWidth: '180px' }}
                >
                    <option value="">All Reasons</option>
                    <option value="MEDIA_PRESS">Media/Press</option>
                    <option value="PARTNERSHIPS">Partnerships</option>
                    <option value="REPORT_SCAM">Report Scam</option>
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                </select>
            </div>

            {/* Contact Inquiries Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Contact Inquiries</h2>
                    <span className="table-count">{total} total</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Reason</th>
                                <th>Country</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts && contacts.length > 0 ? (
                                contacts.map((inquiry: ContactInquiry) => (
                                    <tr key={inquiry.id}>
                                        <td style={{ fontWeight: inquiry.status === 'NEW' ? 600 : 400 }}>
                                            {inquiry.fullName}
                                        </td>
                                        <td>{inquiry.email}</td>
                                        <td>{getReasonBadge(inquiry.reason)}</td>
                                        <td>{inquiry.country}</td>
                                        <td>{getStatusBadge(inquiry.status)}</td>
                                        <td>{formatDate(inquiry.createdAt)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn" 
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(inquiry)}
                                                >
                                                    <ViewIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
                                        <div className="empty-state">
                                            <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>✉️</span>
                                            <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>No inquiries found</h3>
                                            <p style={{ margin: 0 }}>No contact inquiries match your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="table-pagination">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedInquiry && typeof window !== 'undefined' && createPortal(
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeDetailModal()}>
                    <div className="modal-dialog modal-md">
                        <div className="modal-header">
                            <h2>Inquiry Details</h2>
                            <button className="modal-close" onClick={closeDetailModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="inquiry-detail">
                                <div className="detail-row">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{selectedInquiry.fullName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">
                                        <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
                                    </span>
                                </div>
                                {selectedInquiry.phone && (
                                    <div className="detail-row">
                                        <span className="detail-label">Phone</span>
                                        <span className="detail-value">{selectedInquiry.phone}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="detail-label">Country</span>
                                    <span className="detail-value">{selectedInquiry.country}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Reason</span>
                                    <span className="detail-value">{getReasonBadge(selectedInquiry.reason)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className="detail-value">{getStatusBadge(selectedInquiry.status)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Submitted</span>
                                    <span className="detail-value">{formatDate(selectedInquiry.createdAt)}</span>
                                </div>
                                <div className="detail-message">
                                    <span className="detail-label">Message</span>
                                    <div className="message-content">
                                        {selectedInquiry.message}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={closeDetailModal}>
                                    Close
                                </button>
                                <a 
                                    href={`mailto:${selectedInquiry.email}?subject=Re: ${REASON_LABELS[selectedInquiry.reason]}`}
                                    className="btn-primary"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
