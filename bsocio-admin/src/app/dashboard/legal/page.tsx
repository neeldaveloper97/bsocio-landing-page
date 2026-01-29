"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLegal } from '@/hooks';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import type { LegalDocumentType, LegalDocumentState, LegalDocument } from '@/types';
import './legal.css';

/**
 * Format date string for display
 */
function formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get version info from document
 */
function getVersionInfo(doc: LegalDocument | null) {
    if (!doc) return null;
    
    return {
        version: 'v1.0', // Single version since we don't have history
        date: formatDate(doc.updatedAt),
        status: doc.state === 'PUBLISHED' ? 'Current' : 'Draft',
        changes: doc.versionNotes || 'No version notes',
        effectiveDate: formatDate(doc.effectiveDate),
    };
}

export default function LegalPage() {
    const [activeTab, setActiveTab] = useState<LegalDocumentType>('PRIVACY_POLICY');
    
    // Fetch both documents
    const termsHook = useLegal('TERMS_OF_USE');
    const privacyHook = useLegal('PRIVACY_POLICY');
    
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [versionNotes, setVersionNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const currentHook = activeTab === 'TERMS_OF_USE' ? termsHook : privacyHook;
    const currentDoc = currentHook.data;
    const versionInfo = getVersionInfo(currentDoc);

    // Debug logging
    useEffect(() => {
        console.log('Legal Page Debug:', {
            activeTab,
            isLoading: currentHook.isLoading,
            isError: currentHook.isError,
            error: currentHook.error,
            currentDoc,
        });
    }, [activeTab, currentHook.isLoading, currentHook.isError, currentHook.error, currentDoc]);

    // Load document data when tab changes or document loads
    useEffect(() => {
        if (currentDoc) {
            setTitle(currentDoc.title || '');
            setContent(currentDoc.content || '');
            setEffectiveDate(currentDoc.effectiveDate ? currentDoc.effectiveDate.split('T')[0] : new Date().toISOString().split('T')[0]);
            setVersionNotes(currentDoc.versionNotes || '');
        } else {
            // Set defaults for new document
            setTitle(activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use');
            setContent('');
            setEffectiveDate(new Date().toISOString().split('T')[0]);
            setVersionNotes('');
        }
    }, [currentDoc, activeTab]);

    const handleSave = useCallback(async (state: LegalDocumentState) => {
        if (!title.trim() || !content.trim() || !effectiveDate) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            await currentHook.updateDocument({
                title: title.trim(),
                content: content.trim(),
                effectiveDate,
                versionNotes: versionNotes.trim() || undefined,
                state,
            });
            alert(state === 'PUBLISHED' ? 'Document published successfully!' : 'Document saved as draft!');
        } catch (error) {
            console.error('Failed to save document:', error);
            alert('Failed to save document. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [title, content, effectiveDate, versionNotes, currentHook]);

    const isLoading = termsHook.isLoading || privacyHook.isLoading;
    const hasError = currentHook.isError;

    // Handle retry
    const handleRetry = useCallback(() => {
        currentHook.refetch();
    }, [currentHook]);

    if (isLoading) {
        return (
            <div className="legal-page">
                <div className="legal-loading">
                    <div className="legal-loading-spinner"></div>
                    <p>Loading documents...</p>
                </div>
            </div>
        );
    }

    // Show error state with retry button
    if (hasError && !currentDoc) {
        return (
            <div className="legal-page">
                {/* Tabs */}
                <div className="legal-tabs">
                    <button
                        className={`legal-tab ${activeTab === 'PRIVACY_POLICY' ? 'active' : ''}`}
                        onClick={() => setActiveTab('PRIVACY_POLICY')}
                    >
                        Privacy Policy
                    </button>
                    <button
                        className={`legal-tab ${activeTab === 'TERMS_OF_USE' ? 'active' : ''}`}
                        onClick={() => setActiveTab('TERMS_OF_USE')}
                    >
                        Terms of Use
                    </button>
                </div>

                <div className="legal-error">
                    <div className="legal-error-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3>Failed to load {activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'}</h3>
                    <p>There was an error loading the document. Please check your connection and try again.</p>
                    <button className="legal-btn legal-btn-publish" onClick={handleRetry}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="legal-page">
            {/* Tabs */}
            <div className="legal-tabs">
                <button
                    className={`legal-tab ${activeTab === 'PRIVACY_POLICY' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PRIVACY_POLICY')}
                >
                    Privacy Policy
                </button>
                <button
                    className={`legal-tab ${activeTab === 'TERMS_OF_USE' ? 'active' : ''}`}
                    onClick={() => setActiveTab('TERMS_OF_USE')}
                >
                    Terms of Use
                </button>
            </div>

            {/* Edit Content Section */}
            <div className="legal-edit-section">
                <div className="legal-edit-header">
                    <h2>Edit Content</h2>
                    <div className="legal-edit-actions">
                        <button 
                            className="legal-btn legal-btn-preview"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Preview
                        </button>
                        <button 
                            className="legal-btn legal-btn-save"
                            onClick={() => handleSave('DRAFT')}
                            disabled={isSaving}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save
                        </button>
                        <button 
                            className="legal-btn legal-btn-publish"
                            onClick={() => handleSave('PUBLISHED')}
                            disabled={isSaving}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Publish
                        </button>
                    </div>
                </div>

                <div className="legal-form">
                    {/* Policy Title */}
                    <div className="legal-form-group">
                        <label htmlFor="policyTitle">Policy Title</label>
                        <input
                            type="text"
                            id="policyTitle"
                            className="legal-input"
                            placeholder="Enter policy title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Effective Date */}
                    <div className="legal-form-group">
                        <label htmlFor="effectiveDate">Effective Date</label>
                        <input
                            type="date"
                            id="effectiveDate"
                            className="legal-input legal-date-input"
                            value={effectiveDate}
                            onChange={(e) => setEffectiveDate(e.target.value)}
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="legal-form-group legal-form-group-full">
                        <label>{activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'} Content</label>
                        {showPreview ? (
                            <div className="legal-preview">
                                <div 
                                    className="legal-preview-content"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </div>
                        ) : (
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder={`Enter ${activeTab === 'PRIVACY_POLICY' ? 'privacy policy' : 'terms of use'} content...`}
                            />
                        )}
                    </div>

                    {/* Version Notes */}
                    <div className="legal-form-group legal-form-group-full">
                        <label htmlFor="versionNotes">Version Notes</label>
                        <input
                            type="text"
                            id="versionNotes"
                            className="legal-input"
                            placeholder="Describe what changed in this version"
                            value={versionNotes}
                            onChange={(e) => setVersionNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Version Control Section */}
            <div className="legal-version-section">
                <div className="legal-version-header">
                    <h2>Version Control</h2>
                    <p>View current version of the {activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'}</p>
                </div>

                <div className="legal-version-table-wrapper">
                    <table className="legal-version-table">
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Last Updated</th>
                                <th>Effective Date</th>
                                <th>Status</th>
                                <th>Changes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionInfo ? (
                                <tr>
                                    <td className="legal-version-number">{versionInfo.version}</td>
                                    <td>{versionInfo.date}</td>
                                    <td>{versionInfo.effectiveDate}</td>
                                    <td>
                                        <span className={`legal-status-badge ${versionInfo.status === 'Current' ? 'legal-status-current' : 'legal-status-draft'}`}>
                                            {versionInfo.status}
                                        </span>
                                    </td>
                                    <td>{versionInfo.changes}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#6B7280' }}>
                                        No document found. Create a new {activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'} above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
