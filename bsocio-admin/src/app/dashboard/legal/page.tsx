"use client";

import { useState, useEffect } from 'react';
import { useLegal } from '@/hooks';
import type { LegalDocument, LegalDocumentType } from '@/types';

export default function LegalPage() {
    const [activeDoc, setActiveDoc] = useState<LegalDocumentType>('TERMS');
    const [showModal, setShowModal] = useState(false);
    
    // Fetch both documents
    const termsHook = useLegal('TERMS');
    const privacyHook = useLegal('PRIVACY');
    
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [version, setVersion] = useState('');

    const currentDoc = activeDoc === 'TERMS' ? termsHook.data : privacyHook.data;
    const currentHook = activeDoc === 'TERMS' ? termsHook : privacyHook;

    useEffect(() => {
        if (currentDoc) {
            setTitle(currentDoc.title || '');
            setContent(currentDoc.content || '');
            setVersion(currentDoc.version || '');
        }
    }, [currentDoc]);

    const openEditModal = (type: LegalDocumentType) => {
        setActiveDoc(type);
        const doc = type === 'TERMS' ? termsHook.data : privacyHook.data;
        if (doc) {
            setTitle(doc.title);
            setContent(doc.content);
            setVersion(doc.version);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        await currentHook.updateDocument({
            title,
            content,
            version,
        });
        closeModal();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (isActive?: boolean) => {
        if (isActive) {
            return <span className="status-badge status-published">Published</span>;
        }
        return <span className="status-badge status-draft">Draft</span>;
    };

    const isLoading = termsHook.isLoading || privacyHook.isLoading;
    const isError = termsHook.isError || privacyHook.isError;

    const documents = [
        { type: 'TERMS' as LegalDocumentType, data: termsHook.data, hook: termsHook },
        { type: 'PRIVACY' as LegalDocumentType, data: privacyHook.data, hook: privacyHook },
    ].filter(d => d.data);

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Legal Documents</h1>
                    <p>Manage terms, policies, and legal content</p>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid cols-3">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">2</div>
                    <div className="stat-label">Total Documents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">{documents.filter(d => d.data?.isActive).length}</div>
                    <div className="stat-label">Published</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{documents.filter(d => !d.data?.isActive).length}</div>
                    <div className="stat-label">Drafts</div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>All Documents</h2>
                </div>
                {isLoading ? (
                    <div className="loading-state" style={{ padding: '24px' }}>Loading documents...</div>
                ) : isError ? (
                    <div className="error-state" style={{ padding: '24px' }}>
                        Failed to load documents.{' '}
                        <button onClick={() => { termsHook.refetch(); privacyHook.refetch(); }}>Retry</button>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Version</th>
                                    <th>Last Updated</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {termsHook.data && (
                                    <tr>
                                        <td>{termsHook.data.title || 'Terms of Service'}</td>
                                        <td>Terms</td>
                                        <td>{termsHook.data.version || '1.0'}</td>
                                        <td>{formatDate(termsHook.data.updatedAt)}</td>
                                        <td>{getStatusBadge(termsHook.data.isActive)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn" title="Edit" onClick={() => openEditModal('TERMS')}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {privacyHook.data && (
                                    <tr>
                                        <td>{privacyHook.data.title || 'Privacy Policy'}</td>
                                        <td>Privacy</td>
                                        <td>{privacyHook.data.version || '1.0'}</td>
                                        <td>{formatDate(privacyHook.data.updatedAt)}</td>
                                        <td>{getStatusBadge(privacyHook.data.isActive)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn" title="Edit" onClick={() => openEditModal('PRIVACY')}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!termsHook.data && !privacyHook.data && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>No documents found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Document Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit {activeDoc === 'TERMS' ? 'Terms of Service' : 'Privacy Policy'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="docTitle">Document Title</label>
                                <input 
                                    type="text" 
                                    id="docTitle" 
                                    className="form-input" 
                                    placeholder="Enter document title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="docVersion">Version</label>
                                <input 
                                    type="text" 
                                    id="docVersion" 
                                    className="form-input" 
                                    placeholder="e.g., 1.0.0"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="docContent">Content</label>
                                <textarea 
                                    id="docContent" 
                                    className="form-textarea" 
                                    placeholder="Enter document content..." 
                                    rows={12}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                                <button className="btn-primary" onClick={handleSave} disabled={currentHook.isMutating}>
                                    {currentHook.isMutating ? 'Saving...' : 'Save Document'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
