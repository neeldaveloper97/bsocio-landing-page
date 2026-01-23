"use client";

import { useState } from 'react';
import { useFAQs } from '@/hooks';
import type { FAQ, CreateFAQRequest, FAQCategory, FAQStatus, FAQState, FAQVisibility } from '@/types';

export default function FAQsPage() {
    const { faqs, isLoading, isError, refetch, createFAQ, updateFAQ, deleteFAQ, isMutating } = useFAQs();
    const [showModal, setShowModal] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    
    // Form state
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState<FAQCategory>('GENERAL');
    const [status, setStatus] = useState<FAQStatus>('ACTIVE');
    const [state, setState] = useState<FAQState>('PUBLISHED');
    const [visibility, setVisibility] = useState<FAQVisibility>('PUBLIC');

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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            await deleteFAQ(id);
        }
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                <div className="table-header">
                    <h2>All FAQs</h2>
                </div>
                {isLoading ? (
                    <div className="loading-state" style={{ padding: '24px' }}>Loading FAQs...</div>
                ) : isError ? (
                    <div className="error-state" style={{ padding: '24px' }}>
                        Failed to load FAQs.{' '}
                        <button onClick={refetch}>Retry</button>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center' }}>No FAQs found</td>
                                    </tr>
                                ) : (
                                    faqs.map((faq) => (
                                        <tr key={faq.id}>
                                            <td>{faq.question}</td>
                                            <td>{faq.category}</td>
                                            <td>{getStatusBadge(faq.status)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn" title="Edit" onClick={() => openModal(faq)}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                    <button className="action-btn" title="Delete" onClick={() => handleDelete(faq.id)} disabled={isMutating}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit FAQ Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            <div className="form-group">
                                <label htmlFor="answer">Answer</label>
                                <textarea 
                                    id="answer" 
                                    className="form-textarea" 
                                    placeholder="Enter the answer..." 
                                    rows={5}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                                <button className="btn-primary" onClick={handleSubmit} disabled={isMutating}>
                                    {isMutating ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Add FAQ')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
