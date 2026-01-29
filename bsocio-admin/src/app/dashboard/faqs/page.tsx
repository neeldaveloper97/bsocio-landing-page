"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFAQs } from '@/hooks';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import type { FAQ, CreateFAQRequest, FAQCategory, FAQStatus, FAQState, FAQVisibility, FAQFilters } from '@/types';

const PAGE_SIZE = 10;

export default function FAQsPage() {
    // Sorting state
    const [sortBy, setSortBy] = useState<string>('sortOrder');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    const filters: FAQFilters = useMemo(() => ({
        sortBy,
        sortOrder,
    }), [sortBy, sortOrder]);

    const { faqs, isLoading, isError, refetch, createFAQ, updateFAQ, deleteFAQ, isMutating } = useFAQs({ filters });
    const [showModal, setShowModal] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    
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

    // Pagination
    const totalPages = Math.ceil(faqs.length / PAGE_SIZE);
    const paginatedFaqs = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return faqs.slice(start, start + PAGE_SIZE);
    }, [faqs, currentPage]);

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

    // Handle sort
    const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
        setSortBy(field);
        setSortOrder(order);
        setCurrentPage(0); // Reset to first page
    }, []);

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

        if (editingFAQ) {
            await updateFAQ(editingFAQ.id, { question, answer, category, status, state, visibility });
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
            await createFAQ(data);
        }
        closeModal();
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
        await deleteFAQ(confirmModal.faqId);
        closeConfirmModal();
    };

    const getStatusBadge = (faqStatus: FAQStatus) => {
        switch (faqStatus) {
            case 'ACTIVE':
                return <span className="status-badge status-active">Active</span>;
            case 'INACTIVE':
                return <span className="status-badge status-inactive">Inactive</span>;
            default:
                return null;
        }
    };

    const activeFaqs = faqs.filter(f => f.status === 'ACTIVE');

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>FAQs</h1>
                    <p>Manage frequently asked questions</p>
                </div>
                <button className="btn-create" onClick={() => openModal()}>
                    <PlusIcon />
                    Add FAQ
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid cols-3">
                <div className="stat-card">
                    <div className="stat-icon">❓</div>
                    <div className="stat-value">{faqs.length}</div>
                    <div className="stat-label">Total FAQs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">{activeFaqs.length}</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{faqs.length - activeFaqs.length}</div>
                    <div className="stat-label">Inactive</div>
                </div>
            </div>

            {/* FAQs Table */}
            <div className="table-container">
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>All FAQs</h2>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{faqs.length} total</span>
                </div>
                {isLoading ? (
                    <div className="loading-state" style={{ padding: '24px' }}>Loading FAQs...</div>
                ) : isError ? (
                    <div className="error-state" style={{ padding: '24px' }}>
                        Failed to load FAQs.{' '}
                        <button onClick={refetch}>Retry</button>
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <SortableHeader
                                            label="Question"
                                            field="question"
                                            currentSortBy={sortBy}
                                            currentSortOrder={sortOrder}
                                            onSort={handleSort}
                                        />
                                        <SortableHeader
                                            label="Category"
                                            field="category"
                                            currentSortBy={sortBy}
                                            currentSortOrder={sortOrder}
                                            onSort={handleSort}
                                        />
                                        <SortableHeader
                                            label="Status"
                                            field="status"
                                            currentSortBy={sortBy}
                                            currentSortOrder={sortOrder}
                                            onSort={handleSort}
                                            style={{ textAlign: 'center' }}
                                        />
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedFaqs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '48px 24px' }}>
                                                <div className="empty-state">
                                                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>❓</span>
                                                    <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>No FAQs found</h3>
                                                    <p style={{ margin: 0, color: '#6B7280' }}>Create your first FAQ to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedFaqs.map((faq) => (
                                            <tr key={faq.id}>
                                                <td data-label="Question">{faq.question}</td>
                                                <td data-label="Category">{faq.category}</td>
                                                <td data-label="Status" style={{ textAlign: 'center' }}>{getStatusBadge(faq.status)}</td>
                                                <td data-label="Actions" style={{ textAlign: 'center' }}>
                                                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                        <button className="action-btn" title="Edit" onClick={() => openModal(faq)}>
                                                            <EditIcon />
                                                        </button>
                                                        <button className="action-btn" title="Delete" onClick={() => openDeleteConfirm(faq)} disabled={isMutating}>
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
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
                    </>
                )}
            </div>

            {/* Add/Edit FAQ Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-header">
                            <h2>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="question">Question</label>
                                <input 
                                    type="text" 
                                    id="question" 
                                    className="form-input" 
                                    placeholder="Enter the question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select 
                                        id="category" 
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as FAQCategory)}
                                    >
                                        <option value="GENERAL">General</option>
                                        <option value="TECHNICAL">Technical</option>
                                        <option value="BILLING">Billing</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select 
                                        id="status" 
                                        className="form-select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as FAQStatus)}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group" style={{ width: '100%' }}>
                                <label htmlFor="answer">Answer</label>
                                <RichTextEditor
                                    value={answer}
                                    onChange={setAnswer}
                                    placeholder="Enter the answer..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
                                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                                <button className="btn-primary" onClick={handleSubmit} disabled={isMutating}>
                                    {isMutating ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Add FAQ')}
                                </button>
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
