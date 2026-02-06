"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import { useFAQs } from '@/hooks';
import { cn } from '@/lib/utils';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import type { FAQ, CreateFAQRequest, FAQCategory, FAQStatus, FAQState, FAQVisibility, FAQFilters } from '@/types';

const PAGE_SIZE = 5;

// Helper to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export default function FAQsPage() {
    // State
    const [showModal, setShowModal] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Sorting state
    const [sortBy, setSortBy] = useState<string>('sortOrder');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    // Build filters with pagination
    const filters: FAQFilters = useMemo(() => ({
        sortBy,
        sortOrder,
        page: currentPage + 1, // API uses 1-indexed pages
        limit: PAGE_SIZE,
    }), [sortBy, sortOrder, currentPage]);

    const { faqs, data, isLoading, isError, error, refetch, createFAQ, updateFAQ, deleteFAQ, isMutating } = useFAQs({ filters });
    const totalFAQs = data?.total ?? faqs.length;
    
    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        faqId: string | null;
        faqQuestion: string;
    }>({
        isOpen: false,
        faqId: null,
        faqQuestion: '',
    });
    
    // Form state
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState<FAQCategory>('GENERAL');
    const [status, setStatus] = useState<FAQStatus>('ACTIVE');
    const [state, setState] = useState<FAQState>('PUBLISHED');
    const [visibility, setVisibility] = useState<FAQVisibility>('PUBLIC');

    // Server-side pagination
    const totalPages = Math.ceil(totalFAQs / PAGE_SIZE);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showModal]);

    // Handle sort
    const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
        setSortBy(field);
        setSortOrder(order);
        setCurrentPage(0); // Reset to first page
    }, []);

    // Handle sort from DataTable
    const handleSortColumn = useCallback((key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
        setCurrentPage(0);
    }, [sortBy, sortOrder]);

    const resetForm = () => {
        setQuestion('');
        setAnswer('');
        setCategory('GENERAL');
        setStatus('ACTIVE');
        setState('PUBLISHED');
        setVisibility('PUBLIC');
        setEditingFAQ(null);
    };

    const openModal = (faq?: FAQ) => {
        if (faq) {
            setEditingFAQ(faq);
            setQuestion(faq.question);
            setAnswer(faq.answer);
            setCategory(faq.category);
            setStatus(faq.status);
            setState(faq.state);
            setVisibility(faq.visibility);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async () => {
        if (!question.trim() || !answer.trim()) return;

        let result;
        if (editingFAQ) {
            result = await updateFAQ(editingFAQ.id, { question, answer, category, status, state, visibility });
            if (result) {
                showSuccessToast('FAQ updated', 'FAQ has been updated successfully');
                closeModal();
            } else {
                showErrorToast(error || new Error('Failed to update FAQ'), 'Update failed');
            }
        } else {
            // Calculate sortOrder - use the max sortOrder + 1, or 1 if no FAQs exist
            const maxSortOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.sortOrder)) : 0;
            const data: CreateFAQRequest = { 
                question, 
                answer, 
                category, 
                status, 
                state, 
                visibility, 
                sortOrder: maxSortOrder + 1 
            };
            result = await createFAQ(data);
            if (result) {
                showSuccessToast('FAQ created', 'FAQ has been created successfully');
                closeModal();
            } else {
                showErrorToast(error || new Error('Failed to create FAQ'), 'Create failed');
            }
        }
    };

    const openDeleteConfirm = (faq: FAQ) => {
        setConfirmModal({
            isOpen: true,
            faqId: faq.id,
            faqQuestion: faq.question,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            faqId: null,
            faqQuestion: '',
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmModal.faqId) return;
        const success = await deleteFAQ(confirmModal.faqId);
        if (success) {
            showSuccessToast('FAQ deleted', 'FAQ has been removed successfully');
        } else {
            showErrorToast(error || new Error('Failed to delete FAQ'), 'Delete failed');
        }
        closeConfirmModal();
    };

    const getStatusBadge = (faqStatus: FAQStatus) => {
        switch (faqStatus) {
            case 'ACTIVE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#166534]">Active</span>;
            case 'INACTIVE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5E7EB] text-[#6B7280]">Inactive</span>;
            default:
                return null;
        }
    };

    const activeFaqs = faqs.filter(f => f.status === 'ACTIVE');

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">FAQs</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage frequently asked questions</p>
                </div>
                <button className="btn-primary-responsive" onClick={() => openModal()}>
                    <PlusIcon />
                    Add FAQ
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">❓</div>
                    <div className="stat-value-responsive">{faqs.length}</div>
                    <div className="stat-label-responsive">Total FAQs</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">{activeFaqs.length}</div>
                    <div className="stat-label-responsive">Active</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#6B7280]">📝</div>
                    <div className="stat-value-responsive">{faqs.length - activeFaqs.length}</div>
                    <div className="stat-label-responsive">Inactive</div>
                </div>
            </div>

            {/* FAQs Table */}
            <DataTable<FAQ>
                data={faqs}
                columns={[
                    { 
                        key: 'question', 
                        header: 'Question',
                        sortable: true,
                        render: (faq) => (
                            <span title={faq.question}>{truncateText(faq.question, 40)}</span>
                        )
                    },
                    { 
                        key: 'category', 
                        header: 'Category',
                        sortable: true,
                        render: (faq) => (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#1D4ED8]">{faq.category}</span>
                        )
                    },
                    { 
                        key: 'status', 
                        header: 'Status',
                        sortable: true,
                        align: 'center',
                        render: (faq) => getStatusBadge(faq.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (faq) => (
                            <div className="flex items-center gap-2 justify-center">
                                <button 
                                    type="button"
                                    className="action-btn" 
                                    title="Edit" 
                                    onClick={() => openModal(faq)}
                                >
                                    <EditIcon />
                                </button>
                                <button 
                                    type="button"
                                    className="action-btn" 
                                    title="Delete" 
                                    onClick={() => openDeleteConfirm(faq)} 
                                    disabled={isMutating}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<FAQ>[]}
                keyExtractor={(faq) => faq.id}
                isLoading={isLoading}
                title="All FAQs"
                totalCount={faqs.length}
                emptyIcon="❓"
                emptyTitle="No FAQs found"
                emptyDescription="Create your first FAQ to get started"
                sortConfig={{ key: sortBy, order: sortOrder }}
                onSort={handleSortColumn}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Add/Edit FAQ Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-2xl max-sm:rounded-xl w-full max-w-[560px] max-sm:max-w-[95vw] max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] pr-14 max-sm:pr-12 relative">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                            <button className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" onClick={closeModal}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="question" className="font-sans text-sm font-semibold text-[#374151]">Question</label>
                                    <input 
                                        type="text" 
                                        id="question" 
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" 
                                        placeholder="Enter the question"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="category" className="font-sans text-sm font-semibold text-[#374151]">Category</label>
                                        <Select value={category} onValueChange={(value) => setCategory(value as FAQCategory)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="GENERAL">General</SelectItem>
                                                <SelectItem value="TECHNICAL">Technical</SelectItem>
                                                <SelectItem value="BILLING">Billing</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="status" className="font-sans text-sm font-semibold text-[#374151]">Status</label>
                                        <Select value={status} onValueChange={(value) => setStatus(value as FAQStatus)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="answer" className="font-sans text-sm font-semibold text-[#374151]">Answer</label>
                                    <RichTextEditor
                                        value={answer}
                                        onChange={setAnswer}
                                        placeholder="Enter the answer..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 max-sm:gap-2 mt-4 flex-wrap border-t border-[#E5E7EB] pt-6 max-sm:pt-4">
                                    <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={closeModal}>Cancel</button>
                                    <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={isMutating}>
                                        {isMutating ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Add FAQ')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmDelete}
                title="Delete FAQ"
                message={`Are you sure you want to delete this FAQ? "${confirmModal.faqQuestion.substring(0, 50)}${confirmModal.faqQuestion.length > 50 ? '...' : ''}"`}
                confirmText="Delete"
                variant="danger"
                isLoading={isMutating}
            />
        </div>
    );
}
