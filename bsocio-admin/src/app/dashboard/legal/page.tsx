"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import { useLegal } from '@/hooks';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import type { LegalDocumentType, LegalDocumentState, LegalDocument } from '@/types';
import { cn } from '@/lib/utils';

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
            toast.error('Validation error', { description: 'Please fill in all required fields' });
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
            showSuccessToast(
                state === 'PUBLISHED' ? 'Document published' : 'Draft saved',
                state === 'PUBLISHED' ? 'Document published successfully!' : 'Document saved as draft!'
            );
        } catch (error) {
            console.error('Failed to save document:', error);
            showErrorToast(error, 'Save failed');
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

    // Skeleton loading component
    const LoadingSkeleton = () => (
        <div className="page-content w-full">
            {/* Header skeleton */}
            <div className="page-header-row">
                <div className="flex flex-col gap-2">
                    <div className="skeleton-box" style={{ width: '200px', height: '32px' }} />
                    <div className="skeleton-box" style={{ width: '280px', height: '20px' }} />
                </div>
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-1 border-b border-[#E5E7EB] bg-transparent">
                <div className="skeleton-box" style={{ width: '120px', height: '44px', borderRadius: '8px 8px 0 0' }} />
                <div className="skeleton-box" style={{ width: '120px', height: '44px', borderRadius: '8px 8px 0 0' }} />
            </div>

            {/* Content skeleton */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 w-full">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="skeleton-box" style={{ width: '150px', height: '28px' }} />
                    <div className="flex gap-3">
                        <div className="skeleton-box" style={{ width: '100px', height: '40px', borderRadius: '8px' }} />
                        <div className="skeleton-box" style={{ width: '80px', height: '40px', borderRadius: '8px' }} />
                        <div className="skeleton-box" style={{ width: '100px', height: '40px', borderRadius: '8px' }} />
                    </div>
                </div>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
                    <div className="flex flex-col gap-2">
                        <div className="skeleton-box" style={{ width: '100px', height: '16px' }} />
                        <div className="skeleton-box" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="skeleton-box" style={{ width: '100px', height: '16px' }} />
                        <div className="skeleton-box" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
                    </div>
                    <div className="flex flex-col gap-2 col-span-full">
                        <div className="skeleton-box" style={{ width: '180px', height: '16px' }} />
                        <div className="skeleton-box" style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                    </div>
                    <div className="flex flex-col gap-2 col-span-full">
                        <div className="skeleton-box" style={{ width: '120px', height: '16px' }} />
                        <div className="skeleton-box" style={{ width: '100%', height: '44px', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>

            {/* Version Control skeleton */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 w-full">
                <div className="mb-6">
                    <div className="skeleton-box" style={{ width: '150px', height: '24px', marginBottom: '8px' }} />
                    <div className="skeleton-box" style={{ width: '250px', height: '16px' }} />
                </div>
                <div className="skeleton-box" style={{ width: '100%', height: '120px', borderRadius: '8px' }} />
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Don't show error state - always show the form so admins can create/edit documents
    // Even if there's an error or no document, the form should be accessible

    return (
        <div className="page-content">
            {/* Page Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Legal Documents</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage privacy policy and terms of use</p>
                </div>
            </div>

            {/* Tabs */}
            <div role="tablist" className="flex gap-1 border-b border-[#E5E7EB] bg-transparent">
                <button
                    id="tab-privacy"
                    role="tab"
                    aria-selected={activeTab === 'PRIVACY_POLICY'}
                    className={cn(
                        "py-3 px-4 sm:px-6 font-sans text-base font-medium text-[#6B7280] bg-transparent border-none border-b-2 border-b-transparent cursor-pointer transition-all duration-200 -mb-px hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-t-lg",
                        activeTab === 'PRIVACY_POLICY' && "text-[#2563EB] border-b-[#2563EB] font-semibold bg-[#EFF6FF]"
                    )}
                    onClick={() => setActiveTab('PRIVACY_POLICY')}
                >
                    Privacy Policy
                </button>
                <button
                    id="tab-terms"
                    role="tab"
                    aria-selected={activeTab === 'TERMS_OF_USE'}
                    className={cn(
                        "py-3 px-4 sm:px-6 font-sans text-base font-medium text-[#6B7280] bg-transparent border-none border-b-2 border-b-transparent cursor-pointer transition-all duration-200 -mb-px hover:text-[#2563EB] hover:bg-[#F3F4F6] rounded-t-lg",
                        activeTab === 'TERMS_OF_USE' && "text-[#2563EB] border-b-[#2563EB] font-semibold bg-[#EFF6FF]"
                    )}
                    onClick={() => setActiveTab('TERMS_OF_USE')}
                >
                    Terms of Use
                </button>
            </div>

            {/* Edit Content Section */}
            <div role="tabpanel" aria-labelledby={activeTab === 'PRIVACY_POLICY' ? 'tab-privacy' : 'tab-terms'} className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                {/* Empty state banner when no document exists yet */}
                {!currentDoc && !isLoading && (
                    <div className="mb-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-start gap-3">
                        <span className="text-xl shrink-0">📝</span>
                        <div>
                            <h3 className="font-sans text-sm font-semibold text-[#1E40AF] m-0 mb-1">
                                No {activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'} found
                            </h3>
                            <p className="font-sans text-sm text-[#3B82F6] m-0">
                                Get started by filling in the title and content below, then click <strong>Save</strong> to create a draft or <strong>Publish</strong> to make it live.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className="font-sans text-xl font-bold text-[#101828] m-0">Edit Content</h2>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            className="inline-flex items-center gap-2 py-2.5 px-5 font-sans text-sm font-semibold rounded-lg border border-[#2563EB] cursor-pointer transition-all duration-200 bg-white text-[#2563EB] hover:bg-[#EFF6FF]"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Preview
                        </button>
                        <button
                            className={cn(
                                "inline-flex items-center gap-2 py-2.5 px-5 font-sans text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 bg-[#84CC16] text-white hover:bg-[#65A30D]",
                                isSaving && "opacity-60 cursor-not-allowed"
                            )}
                            onClick={() => handleSave('DRAFT')}
                            disabled={isSaving}
                        >
                            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save
                        </button>
                        <button
                            className={cn(
                                "inline-flex items-center gap-2 py-2.5 px-5 font-sans text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
                                isSaving && "opacity-60 cursor-not-allowed"
                            )}
                            onClick={() => handleSave('PUBLISHED')}
                            disabled={isSaving}
                        >
                            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Policy Title */}
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="policyTitle" className="font-sans text-sm font-semibold text-[#374151]">Policy Title</label>
                        <input
                            type="text"
                            id="policyTitle"
                            className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full box-border focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                            placeholder="Enter policy title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Effective Date */}
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="effectiveDate" className="font-sans text-sm font-semibold text-[#374151]">Effective Date</label>
                        <input
                            type="date"
                            id="effectiveDate"
                            className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full box-border focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                            value={effectiveDate}
                            onChange={(e) => setEffectiveDate(e.target.value)}
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="flex flex-col gap-2 w-full col-span-full">
                        <label className="font-sans text-sm font-semibold text-[#374151]">{activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'} Content</label>
                        {showPreview ? (
                            <div className="min-h-80 p-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg overflow-auto">
                                <div
                                    className="font-sans text-sm text-[#374151] leading-relaxed"
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
                    <div className="flex flex-col gap-2 col-span-full">
                        <label htmlFor="versionNotes" className="font-sans text-sm font-semibold text-[#374151]">Version Notes</label>
                        <input
                            type="text"
                            id="versionNotes"
                            className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full box-border focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                            placeholder="Describe what changed in this version"
                            value={versionNotes}
                            onChange={(e) => setVersionNotes(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Version Control Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <div className="mb-6">
                    <h2 className="font-sans text-xl font-bold text-[#101828] m-0 mb-2">Version Control</h2>
                    <p className="font-sans text-sm text-[#6B7280] m-0">View current version of the {activeTab === 'PRIVACY_POLICY' ? 'Privacy Policy' : 'Terms of Use'}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB] whitespace-nowrap">Version</th>
                                <th className="px-4 py-3 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB] whitespace-nowrap">Last Updated</th>
                                <th className="px-4 py-3 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB] whitespace-nowrap">Effective Date</th>
                                <th className="px-4 py-3 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB] whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 font-sans text-xs font-semibold text-[#6B7280] text-left uppercase tracking-wide bg-[#F9FAFB] border-b border-[#E5E7EB] whitespace-nowrap">Changes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionInfo ? (
                                <tr>
                                    <td className="px-4 py-4 font-sans text-sm border-b border-[#E5E7EB] font-semibold text-[#111827]">{versionInfo.version}</td>
                                    <td className="px-4 py-4 font-sans text-sm text-[#374151] border-b border-[#E5E7EB]">{versionInfo.date}</td>
                                    <td className="px-4 py-4 font-sans text-sm text-[#374151] border-b border-[#E5E7EB]">{versionInfo.effectiveDate}</td>
                                    <td className="px-4 py-4 font-sans text-sm text-[#374151] border-b border-[#E5E7EB]">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            versionInfo.status === 'Current' ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#92400E]"
                                        )}>
                                            {versionInfo.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-sans text-sm text-[#374151] border-b border-[#E5E7EB]">{versionInfo.changes}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 font-sans text-sm text-[#6B7280] border-b border-[#E5E7EB] text-center">
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
