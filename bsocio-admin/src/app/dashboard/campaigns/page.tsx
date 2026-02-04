"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    useCampaigns,
    useSendCampaign,
    useSaveCampaignDraft,
} from '@/hooks';
import { PlusIcon, ViewIcon } from '@/components/ui/admin-icons';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { EmailCampaign, EmailAudience, EmailSendType, CreateEmailCampaignRequest } from '@/types';
import './campaigns.css';

const PAGE_SIZE = 5;

const AUDIENCE_OPTIONS: { value: EmailAudience; label: string }[] = [
    { value: 'ALL_USERS', label: 'All Users' },
    { value: 'SEGMENTED_USERS', label: 'Segmented Users' },
];

const SEND_TYPE_OPTIONS: { value: EmailSendType; label: string }[] = [
    { value: 'NOW', label: 'Send Now' },
    { value: 'SCHEDULED', label: 'Schedule for Later' },
];

interface FormData {
    name: string;
    subject: string;
    content: string;
    audience: EmailAudience;
    sendType: EmailSendType;
    scheduledAt: string;
    filters?: {
        role?: string;
        status?: string;
        country?: string;
    };
}

const initialFormData: FormData = {
    name: '',
    subject: '',
    content: '',
    audience: 'ALL_USERS',
    sendType: 'NOW',
    scheduledAt: '',
    filters: {
        role: '',
        status: '',
        country: '',
    },
};

export default function CampaignsPage() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(0);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal]);

    // Hooks
    const { data: campaigns, isLoading, refetch } = useCampaigns(
        statusFilter !== 'all' ? { status: statusFilter as 'DRAFT' | 'SCHEDULED' | 'SENT' } : undefined
    );
    const sendCampaign = useSendCampaign();
    const saveDraft = useSaveCampaignDraft();

    // Stats
    const totalCampaigns = campaigns?.length || 0;
    const draftCount = campaigns?.filter((c: EmailCampaign) => c.status === 'DRAFT').length || 0;
    const scheduledCount = campaigns?.filter((c: EmailCampaign) => c.status === 'SCHEDULED').length || 0;
    const sentCount = campaigns?.filter((c: EmailCampaign) => c.status === 'SENT').length || 0;

    // Pagination
    const totalPages = Math.ceil(totalCampaigns / PAGE_SIZE);
    const paginatedCampaigns = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return campaigns?.slice(start, start + PAGE_SIZE) || [];
    }, [campaigns, currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setFormData(initialFormData);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData(initialFormData);
    };

    const handleSaveDraft = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a campaign name');
            return;
        }
        if (!formData.subject.trim()) {
            alert('Please enter an email subject');
            return;
        }
        if (!formData.content.trim()) {
            alert('Please enter email content');
            return;
        }

        try {
            const requestData: CreateEmailCampaignRequest = {
                name: formData.name,
                subject: formData.subject,
                content: formData.content,
                audience: formData.audience,
                sendType: formData.sendType,
            };
            
            if (formData.sendType === 'SCHEDULED' && formData.scheduledAt) {
                requestData.scheduledAt = new Date(formData.scheduledAt).toISOString();
            }

            // Add filters for segmented users
            if (formData.audience === 'SEGMENTED_USERS' && formData.filters) {
                const cleanFilters: Record<string, any> = {};
                if (formData.filters.role) cleanFilters.role = formData.filters.role;
                if (formData.filters.status) cleanFilters.status = formData.filters.status;
                if (formData.filters.country) cleanFilters.country = formData.filters.country;
                if (Object.keys(cleanFilters).length > 0) {
                    (requestData as any).filters = cleanFilters;
                }
            }

            await saveDraft.mutateAsync(requestData);
            await refetch();
            closeModal();
            alert('Campaign saved as draft!');
        } catch (error) {
            console.error('Save draft failed:', error);
            alert('Failed to save draft. Please try again.');
        }
    };

    const handleSendCampaign = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a campaign name');
            return;
        }
        if (!formData.subject.trim()) {
            alert('Please enter an email subject');
            return;
        }
        if (!formData.content.trim()) {
            alert('Please enter email content');
            return;
        }
        if (formData.sendType === 'SCHEDULED' && !formData.scheduledAt) {
            alert('Please select a scheduled date and time');
            return;
        }

        try {
            const requestData: CreateEmailCampaignRequest = {
                name: formData.name,
                subject: formData.subject,
                content: formData.content,
                audience: formData.audience,
                sendType: formData.sendType,
            };
            
            if (formData.sendType === 'SCHEDULED' && formData.scheduledAt) {
                requestData.scheduledAt = new Date(formData.scheduledAt).toISOString();
            }

            // Add filters for segmented users
            if (formData.audience === 'SEGMENTED_USERS' && formData.filters) {
                const cleanFilters: Record<string, any> = {};
                if (formData.filters.role) cleanFilters.role = formData.filters.role;
                if (formData.filters.status) cleanFilters.status = formData.filters.status;
                if (formData.filters.country) cleanFilters.country = formData.filters.country;
                if (Object.keys(cleanFilters).length > 0) {
                    (requestData as any).filters = cleanFilters;
                }
            }

            await sendCampaign.mutateAsync(requestData);
            await refetch();
            closeModal();
            alert(formData.sendType === 'NOW' ? 'Campaign sent successfully!' : 'Campaign scheduled successfully!');
        } catch (error) {
            console.error('Send campaign failed:', error);
            alert('Failed to send campaign. Please try again.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <span className="status-badge status-draft">Draft</span>;
            case 'SCHEDULED':
                return <span className="status-badge status-upcoming">Scheduled</span>;
            case 'SENT':
                return <span className="status-badge status-active">Sent</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAudienceLabel = (audience: string) => {
        switch (audience) {
            case 'ALL_USERS':
                return 'All Users';
            case 'SEGMENTED_USERS':
                return 'Segmented';
            default:
                return audience;
        }
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="content-section active">
                <div className="section-header-with-btn">
                    <div className="section-intro">
                        <h1>Email Campaigns</h1>
                        <p>Create and manage email campaigns</p>
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
                                    <th>Campaign Name</th>
                                    <th>Subject</th>
                                    <th>Audience</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td><div className="skeleton-box" style={{ width: '150px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '200px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '80px', height: '16px' }}></div></td>
                                        <td><div className="skeleton-box" style={{ width: '70px', height: '24px', borderRadius: '12px' }}></div></td>
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
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Email Campaigns</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Create and manage email campaigns to reach your users</p>
                </div>
                <button className="btn-primary-responsive" onClick={openCreateModal}>
                    <PlusIcon />
                    New Campaign
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">📧</div>
                    <div className="stat-value-responsive">{totalCampaigns}</div>
                    <div className="stat-label-responsive">Total Campaigns</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#6B7280]">📝</div>
                    <div className="stat-value-responsive">{draftCount}</div>
                    <div className="stat-label-responsive">Drafts</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⏰</div>
                    <div className="stat-value-responsive">{scheduledCount}</div>
                    <div className="stat-label-responsive">Scheduled</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">{sentCount}</div>
                    <div className="stat-label-responsive">Sent</div>
                </div>
            </div>

            {/* Campaigns Table - Using DataTable Component */}
            <DataTable<EmailCampaign>
                data={paginatedCampaigns || []}
                columns={[
                    {
                        key: 'name',
                        header: 'Campaign Name',
                        render: (campaign) => <span style={{ fontWeight: 500 }}>{campaign.name}</span>,
                    },
                    {
                        key: 'subject',
                        header: 'Subject',
                        render: (campaign) => campaign.subject,
                    },
                    {
                        key: 'audience',
                        header: 'Audience',
                        render: (campaign) => getAudienceLabel(campaign.audience),
                    },
                    {
                        key: 'status',
                        header: 'Status',
                        align: 'center',
                        render: (campaign) => getStatusBadge(campaign.status),
                    },
                    {
                        key: 'scheduledAt',
                        header: 'Scheduled/Sent',
                        render: (campaign) => formatDate(campaign.scheduledAt),
                    },
                    {
                        key: 'createdAt',
                        header: 'Created',
                        render: (campaign) => formatDate(campaign.createdAt),
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: () => (
                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                <button className="action-btn" title="View">
                                    <ViewIcon />
                                </button>
                            </div>
                        ),
                    },
                ]}
                keyExtractor={(campaign) => campaign.id}
                title="All Campaigns"
                headerActions={
                    <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(0); }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="DRAFT">Drafts ({draftCount})</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled ({scheduledCount})</SelectItem>
                            <SelectItem value="SENT">Sent ({sentCount})</SelectItem>
                        </SelectContent>
                    </Select>
                }
                emptyIcon="📧"
                emptyTitle="No campaigns yet"
                emptyDescription="Create your first email campaign to reach your users"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Create Campaign Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Create Email Campaign</h2>
                            <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828] text-2xl" onClick={closeModal}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-sans text-sm font-semibold text-[#374151]">Campaign Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="e.g., January Newsletter"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="subject" className="font-sans text-sm font-semibold text-[#374151]">Email Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="e.g., 🎉 Exciting News from Bsocio!"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="audience" className="font-sans text-sm font-semibold text-[#374151]">Audience *</label>
                                    <Select value={formData.audience} onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value as EmailAudience }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AUDIENCE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="sendType" className="font-sans text-sm font-semibold text-[#374151]">Send Type *</label>
                                    <Select value={formData.sendType} onValueChange={(value) => setFormData(prev => ({ ...prev, sendType: value as EmailSendType }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select send type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SEND_TYPE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.audience === 'SEGMENTED_USERS' && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-sans text-sm font-semibold text-[#374151] mb-3">Audience Filters</h3>
                                    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="filterRole" className="font-sans text-xs font-medium text-[#6B7280]">Filter by Role</label>
                                            <Select value={formData.filters?.role || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, role: value } }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Roles" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Roles</SelectItem>
                                                    <SelectItem value="USER">Users</SelectItem>
                                                    <SelectItem value="ORGANIZER">Organizers</SelectItem>
                                                    <SelectItem value="ADMIN">Admins</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="filterStatus" className="font-sans text-xs font-medium text-[#6B7280]">Filter by Status</label>
                                            <Select value={formData.filters?.status || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, status: value } }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Statuses</SelectItem>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <label htmlFor="filterCountry" className="font-sans text-xs font-medium text-[#6B7280]">Filter by Country</label>
                                        <input
                                            type="text"
                                            id="filterCountry"
                                            name="filterCountry"
                                            className="py-2.5 px-3 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                            placeholder="e.g., USA, Canada, UK"
                                            value={formData.filters?.country || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                filters: { ...prev.filters, country: e.target.value }
                                            }))}
                                        />
                                    </div>
                                    <p className="text-xs text-[#6B7280] mt-2">💡 Only users matching these filters will receive this campaign</p>
                                </div>
                            )}

                            {formData.sendType === 'SCHEDULED' && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="scheduledAt" className="font-sans text-sm font-semibold text-[#374151]">Schedule Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        id="scheduledAt"
                                        name="scheduledAt"
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10"
                                        value={formData.scheduledAt}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label htmlFor="content" className="font-sans text-sm font-semibold text-[#374151]">Email Content *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                                    placeholder="Compose your email content here. Use the toolbar for formatting."
                                    minHeight="300px"
                                />
                                <small className="text-xs text-[#6B7280]">
                                    Rich text editor with formatting options. Content will be sent as HTML email.
                                </small>
                            </div>

                            <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] -mx-6 max-sm:-mx-4 -mb-6 max-sm:-mb-4 mt-2">
                                <button 
                                    className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" 
                                    onClick={closeModal}
                                    disabled={sendCampaign.isPending || saveDraft.isPending}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#2563EB] bg-white border border-[#2563EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#EFF6FF] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleSaveDraft}
                                    disabled={sendCampaign.isPending || saveDraft.isPending}
                                >
                                    {saveDraft.isPending ? 'Saving...' : 'Save as Draft'}
                                </button>
                                <button 
                                    className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleSendCampaign}
                                    disabled={sendCampaign.isPending || saveDraft.isPending}
                                >
                                    {sendCampaign.isPending 
                                        ? 'Sending...' 
                                        : formData.sendType === 'NOW' 
                                            ? 'Send Now' 
                                            : 'Schedule Campaign'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
