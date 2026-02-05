"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
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
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingCampaign, setViewingCampaign] = useState<EmailCampaign | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(0);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal || showViewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showModal, showViewModal]);

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

    const openViewModal = (campaign: EmailCampaign) => {
        setViewingCampaign(campaign);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewingCampaign(null);
    };

    const handleSaveDraft = async () => {
        if (!formData.name.trim()) {
            toast.error('Validation error', { description: 'Please enter a campaign name' });
            return;
        }
        if (!formData.subject.trim()) {
            toast.error('Validation error', { description: 'Please enter an email subject' });
            return;
        }
        if (!formData.content.trim()) {
            toast.error('Validation error', { description: 'Please enter email content' });
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
            toast.success('Draft saved', { description: 'Campaign saved as draft successfully!' });
        } catch (error) {
            console.error('Save draft failed:', error);
            toast.error('Save failed', { description: 'Failed to save draft. Please try again.' });
        }
    };

    const handleSendCampaign = async () => {
        if (!formData.name.trim()) {
            toast.error('Validation error', { description: 'Please enter a campaign name' });
            return;
        }
        if (!formData.subject.trim()) {
            toast.error('Validation error', { description: 'Please enter an email subject' });
            return;
        }
        if (!formData.content.trim()) {
            toast.error('Validation error', { description: 'Please enter email content' });
            return;
        }
        if (formData.sendType === 'SCHEDULED' && !formData.scheduledAt) {
            toast.error('Validation error', { description: 'Please select a scheduled date and time' });
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
            toast.success(
                formData.sendType === 'NOW' ? 'Campaign sent' : 'Campaign scheduled',
                { description: formData.sendType === 'NOW' ? 'Campaign sent successfully!' : 'Campaign scheduled successfully!' }
            );
        } catch (error) {
            console.error('Send campaign failed:', error);
            toast.error('Send failed', { description: 'Failed to send campaign. Please try again.' });
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
            <div className="page-content w-full">
                <div className="page-header-row">
                    <div className="flex flex-col gap-1">
                        <div className="w-48 h-7 bg-gray-100 rounded" />
                        <div className="w-72 h-5 bg-gray-100 rounded" />
                    </div>
                </div>
                <div className="stats-grid-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card-responsive">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                            <div className="w-16 h-8 bg-gray-100 rounded mt-2" />
                            <div className="w-20 h-4 bg-gray-100 rounded mt-2" />
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden w-full">
                    <div className="flex gap-4 p-4 bg-gray-50 border-b border-gray-100">
                        <div className="w-1/4 h-4 bg-gray-100 rounded" />
                        <div className="w-1/4 h-4 bg-gray-100 rounded" />
                        <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
                        <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 p-4 border-b border-gray-50 last:border-0">
                            <div className="w-1/4 h-4 bg-gray-100 rounded" />
                            <div className="w-1/4 h-4 bg-gray-100 rounded" />
                            <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
                            <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
                        </div>
                    ))}
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
                        render: (campaign) => (
                            <span className="line-clamp-2 max-w-[150px] font-medium" title={campaign.name}>
                                {campaign.name}
                            </span>
                        ),
                    },
                    {
                        key: 'subject',
                        header: 'Subject',
                        render: (campaign) => (
                            <span className="line-clamp-2 max-w-[250px]" title={campaign.subject}>
                                {campaign.subject}
                            </span>
                        ),
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
                        render: (campaign) => (
                            <span className="whitespace-nowrap">{formatDate(campaign.scheduledAt)}</span>
                        ),
                    },
                    {
                        key: 'createdAt',
                        header: 'Created',
                        render: (campaign) => (
                            <span className="whitespace-nowrap">{formatDate(campaign.createdAt)}</span>
                        ),
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (campaign) => (
                            <div className="flex items-center justify-center">
                                <button className="action-btn" title="View" onClick={() => openViewModal(campaign)}>
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

            {/* View Campaign Modal */}
            {showViewModal && viewingCampaign && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && closeViewModal()}>
                    <div className="bg-white rounded-2xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] max-sm:max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <div>
                                <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Campaign Details</h2>
                                <p className="font-sans text-sm text-muted-foreground m-0 mt-1">{viewingCampaign.name}</p>
                            </div>
                            <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-muted-foreground hover:bg-background hover:text-[#101828] text-2xl" onClick={closeViewModal}>×</button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 max-sm:p-4">
                            <div className="space-y-6">
                                {/* Status and Audience */}
                                <div className="flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        viewingCampaign.status === 'SENT' ? 'bg-green-100 text-green-800' :
                                        viewingCampaign.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {viewingCampaign.status}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {viewingCampaign.audience === 'ALL_USERS' ? 'All Users' : 'Segmented'}
                                    </span>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Subject</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-sans text-sm text-[#101828]">
                                        {viewingCampaign.subject}
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Email Content</label>
                                    <div 
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 font-sans text-sm text-[#101828] prose prose-sm max-w-none max-h-[300px] overflow-y-auto"
                                        dangerouslySetInnerHTML={{ __html: viewingCampaign.content }}
                                    />
                                </div>

                                {/* Stats if sent */}
                                {viewingCampaign.status === 'SENT' && (
                                    <div>
                                        <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Send Statistics</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="text-lg font-bold text-green-800">{viewingCampaign.successCount || 0}</div>
                                                <div className="text-xs text-green-600">Successfully Sent</div>
                                            </div>
                                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="text-lg font-bold text-red-800">{viewingCampaign.failedCount || 0}</div>
                                                <div className="text-xs text-red-600">Failed</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Scheduled Time */}
                                {viewingCampaign.scheduledAt && (
                                    <div>
                                        <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Scheduled For</label>
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 font-sans text-sm text-blue-800">
                                            📅 {new Date(viewingCampaign.scheduledAt).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {/* Sent At */}
                                {viewingCampaign.sentAt && (
                                    <div>
                                        <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Sent At</label>
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200 font-sans text-sm text-green-800">
                                            ✅ {new Date(viewingCampaign.sentAt).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {/* Created At */}
                                <div>
                                    <label className="block font-sans text-sm font-medium text-[#374151] mb-2">Created</label>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-sans text-sm text-gray-600">
                                        {new Date(viewingCampaign.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 max-sm:p-4 border-t border-[#E5E7EB]">
                            <button 
                                className="py-2.5 px-5 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-background"
                                onClick={closeViewModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
