"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { 
    useAwardCategories,
    useNominees, 
    useCreateNominee, 
    useUpdateNominee, 
    useDeleteNominee,
    useUploadImage,
} from '@/hooks';
import type { Nominee, CreateNomineeRequest, NomineeStatus, NomineeFilters } from '@/types';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ============================================
// CONSTANTS
// ============================================

const PAGE_SIZE = 5;

interface FormData {
    name: string;
    categoryId: string;
    title: string;
    organization: string;
    about: string;
    quote: string;
    imageUrl: string;
}

const initialFormData: FormData = {
    name: '',
    categoryId: '',
    title: '',
    organization: '',
    about: '',
    quote: '',
    imageUrl: '',
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function NomineesPage() {
    // State
    const [showModal, setShowModal] = useState(false);
    const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | null;
        nomineeId: string | null;
        nomineeName: string;
    }>({
        isOpen: false,
        type: null,
        nomineeId: null,
        nomineeName: '',
    });

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

    // Sorting state
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    // Build filters for server-side pagination
    const filters: NomineeFilters = useMemo(() => ({
        ...(statusFilter !== 'all' ? { status: statusFilter as NomineeStatus } : {}),
        skip: currentPage * PAGE_SIZE,
        take: PAGE_SIZE,
    }), [statusFilter, currentPage]);

    // API Hooks - server-side pagination
    const { categories } = useAwardCategories();
    const { nominees: rawNominees, total: rawTotal, isLoading: nomineesLoading, refetch } = useNominees(filters);
    
    // Fetch stats separately (for counts)
    const { nominees: allNominees, refetch: refetchStats } = useNominees({ take: 1000 });
    const approvedCount = allNominees?.filter((n: Nominee) => n.status === 'APPROVED').length || 0;
    const pendingCount = allNominees?.filter((n: Nominee) => n.status === 'PENDING').length || 0;
    const rejectedCount = allNominees?.filter((n: Nominee) => n.status === 'REJECTED').length || 0;

    // Skip unnecessary loading when stats already confirm 0 results for this filter
    const filterHasNoResults = useMemo(() => {
        if (!allNominees || allNominees.length === 0) return false;
        if (statusFilter === 'APPROVED' && approvedCount === 0) return true;
        if (statusFilter === 'PENDING' && pendingCount === 0) return true;
        if (statusFilter === 'REJECTED' && rejectedCount === 0) return true;
        return false;
    }, [statusFilter, approvedCount, pendingCount, rejectedCount, allNominees]);

    const displayNominees = filterHasNoResults ? [] : rawNominees;
    const totalNominees = filterHasNoResults ? 0 : rawTotal;
    const isLoading = filterHasNoResults ? false : nomineesLoading;

    const { mutateAsync: createNominee, isPending: isCreating } = useCreateNominee();
    const { mutateAsync: updateNominee, isPending: isUpdating } = useUpdateNominee();
    const { mutateAsync: deleteNominee, isPending: isDeleting } = useDeleteNominee();
    const uploadImage = useUploadImage();

    // Server-side pagination
    const totalPages = Math.ceil(totalNominees / PAGE_SIZE);

    // Interaction guards
    const hasNominees = totalNominees > 0;
    const canInteract = hasNominees;
    const shouldPaginate = canInteract && totalPages > 1;

    // Pagination bounds check
    useEffect(() => {
        if (currentPage > 0 && totalPages > 0 && currentPage >= totalPages) {
            setCurrentPage(Math.max(totalPages - 1, 0));
        }
    }, [currentPage, totalPages]);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(0);
    }, [statusFilter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type', { description: 'Please upload an image file' });
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File too large', { description: 'File size should not exceed 2MB' });
            return;
        }

        try {
            setIsUploading(true);
            const result = await uploadImage.mutateAsync(file);
            const imageUrl = result.data.url;
            setImagePreview(imageUrl);
            setFormData(prev => ({ ...prev, imageUrl }));
            setUploadedImageUrl(imageUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            showErrorToast(error, 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const input = fileInputRef.current;
            if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                input.files = dataTransfer.files;
                handleImageUpload({ target: input } as React.ChangeEvent<HTMLInputElement>);
            }
        }
    };

    const openCreateModal = () => {
        setEditingNominee(null);
        setFormData(initialFormData);
        setImagePreview(null);
        setUploadedImageUrl(null);
        setOriginalImageUrl(null);
        setShowModal(true);
    };

    const openEditModal = (nominee: Nominee) => {
        setEditingNominee(nominee);
        setFormData({
            name: nominee.name,
            categoryId: nominee.categoryId,
            title: nominee.title || '',
            organization: nominee.organization || '',
            about: nominee.about || '',
            quote: nominee.quote || '',
            imageUrl: nominee.imageUrl || '',
        });
        setImagePreview(nominee.imageUrl || null);
        setOriginalImageUrl(nominee.imageUrl || null);
        setUploadedImageUrl(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNominee(null);
        setFormData(initialFormData);
        setFieldErrors({});
        setImagePreview(null);
        setUploadedImageUrl(null);
        setOriginalImageUrl(null);
    };

    const handleSubmit = async (status: NomineeStatus) => {
        // Validation
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = 'Please enter a name';
        else if (formData.name.trim().length > 100) errors.name = 'Name must be 100 characters or less';
        if (!formData.categoryId) errors.categoryId = 'Please select a category';
        
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const payload: CreateNomineeRequest = {
            name: formData.name.trim(),
            categoryId: formData.categoryId,
            title: formData.title.trim() || undefined,
            organization: formData.organization.trim() || undefined,
            about: formData.about.trim() || undefined,
            quote: formData.quote.trim() || undefined,
            imageUrl: formData.imageUrl || undefined,
            status,
        };

        try {
            if (editingNominee) {
                await updateNominee({ id: editingNominee.id, data: payload });
                showSuccessToast('Nominee updated', `${formData.name} has been updated successfully`);
            } else {
                await createNominee(payload);
                showSuccessToast('Nominee created', `${formData.name} has been added successfully`);
            }
            setUploadedImageUrl(null);
            closeModal();
            refetch();
            refetchStats();
        } catch (error) {
            console.error('Failed to save nominee:', error);
            showErrorToast(error, 'Save failed');
        }
    };

    const openDeleteConfirm = (nominee: Nominee) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            nomineeId: nominee.id,
            nomineeName: nominee.name,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: null,
            nomineeId: null,
            nomineeName: '',
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.nomineeId) return;

        try {
            await deleteNominee(confirmModal.nomineeId);
            showSuccessToast('Nominee deleted', `${confirmModal.nomineeName} has been removed`);
            refetch();
            refetchStats();
        } catch (error) {
            console.error('Failed to delete:', error);
            showErrorToast(error, 'Delete failed');
        } finally {
            closeConfirmModal();
        }
    };

    // Helper functions
    const getStatusBadge = (status: NomineeStatus) => {
        switch (status) {
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            default:
                return null;
        }
    };

    const getCategoryName = (categoryId: string) => {
        return categories?.find(c => c.id === categoryId)?.name || '-';
    };

    const truncateText = (text: string, maxLength: number) => {
        // Strip HTML tags for display
        const strippedText = text.replace(/<[^>]*>/g, '');
        if (strippedText.length <= maxLength) return strippedText;
        return strippedText.substring(0, maxLength) + '...';
    };

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="page-main-title">Nominee Management</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Create, edit, and manage award nominees</p>
                </div>
                <button className="btn-primary-responsive" onClick={openCreateModal}>
                    <PlusIcon />
                    <span>Create Nominee</span>
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">👤</div>
                    <div className="stat-value-responsive">{allNominees?.length || 0}</div>
                    <div className="stat-label-responsive">Total Nominees</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">{approvedCount}</div>
                    <div className="stat-label-responsive">Approved</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⏳</div>
                    <div className="stat-value-responsive">{pendingCount}</div>
                    <div className="stat-label-responsive">Pending</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">❌</div>
                    <div className="stat-value-responsive">{rejectedCount}</div>
                    <div className="stat-label-responsive">Rejected</div>
                </div>
            </div>

            {/* Nominees Table */}
            <DataTable<Nominee>
                data={displayNominees}
                columns={[
                    { 
                        key: 'name', 
                        header: 'Nominee',
                        sortable: true,
                        render: (nominee) => (
                            <div className="flex items-center gap-3">
                                {nominee.imageUrl ? (
                                    <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[#F3F4F6]">
                                        <Image
                                            src={nominee.imageUrl}
                                            alt={nominee.name}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                            loading="lazy"
                                            quality={75}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] shrink-0 flex items-center justify-center text-sm font-medium">
                                        {nominee.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium" title={nominee.name}>{truncateText(nominee.name, 25)}</span>
                                    {nominee.title && <div className="text-xs text-[#6B7280]">{truncateText(nominee.title, 30)}</div>}
                                </div>
                            </div>
                        )
                    },
                    { 
                        key: 'category', 
                        header: 'Category',
                        sortable: true,
                        render: (nominee) => getCategoryName(nominee.categoryId)
                    },
                    { 
                        key: 'organization', 
                        header: 'Organization',
                        render: (nominee) => <span title={nominee.organization}>{truncateText(nominee.organization || '-', 20)}</span>
                    },
                    { 
                        key: 'status', 
                        header: 'Status',
                        sortable: true,
                        align: 'center',
                        render: (nominee) => getStatusBadge(nominee.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (nominee) => (
                            <div className="flex items-center gap-2 justify-center">
                                <button
                                    type="button"
                                    className="action-btn"
                                    title="Edit"
                                    aria-label={`Edit ${nominee.name}`}
                                    onClick={() => openEditModal(nominee)}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    type="button"
                                    className="action-btn"
                                    title="Delete"
                                    aria-label={`Delete ${nominee.name}`}
                                    onClick={() => openDeleteConfirm(nominee)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<Nominee>[]}
                keyExtractor={(nominee) => nominee.id}
                isLoading={isLoading}
                title="All Nominees"
                totalCount={displayNominees.length}
                headerActions={
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Nominees</SelectItem>
                            <SelectItem value="APPROVED" disabled={approvedCount === 0}>
                                Approved ({approvedCount})
                            </SelectItem>
                            <SelectItem value="PENDING" disabled={pendingCount === 0}>
                                Pending ({pendingCount})
                            </SelectItem>
                            <SelectItem value="REJECTED" disabled={rejectedCount === 0}>
                                Rejected ({rejectedCount})
                            </SelectItem>
                        </SelectContent>
                    </Select>
                }
                emptyIcon="👤"
                emptyTitle={statusFilter !== 'all' ? `No ${statusFilter.toLowerCase()} nominees` : 'No nominees found'}
                emptyDescription={statusFilter !== 'all' ? 'Try selecting a different status filter' : 'Create your first nominee to get started'}
                sortConfig={{ key: sortBy, order: sortOrder }}
                onSort={canInteract ? handleSortColumn : undefined}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={shouldPaginate ? setCurrentPage : undefined}
            />

            {/* Create/Edit Nominee Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-2xl max-sm:rounded-xl w-full max-w-[560px] max-sm:max-w-[95vw] max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] pr-14 max-sm:pr-12 relative">
                            <div className="flex-1 min-w-0">
                                <h2 id="modal-title" className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">{editingNominee ? 'Edit Nominee' : 'Create Nominee'}</h2>
                                <p className="text-[#6B7280] text-sm max-sm:text-xs mt-1">
                                    Add nominees to celebrate heroes making an impact
                                </p>
                            </div>
                            <button 
                                className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" 
                                onClick={closeModal}
                                aria-label="Close modal"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6 max-sm:p-4">
                            {/* Nominee Name */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="name" className="font-sans text-sm font-semibold text-[#374151]">Nominee Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="Enter nominee name"
                                    value={formData.name}
                                    onChange={(e) => { handleInputChange(e); setFieldErrors(prev => ({ ...prev, name: '' })); }}
                                />
                                {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                            </div>

                            {/* Category and Title */}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="categoryId" className="font-sans text-sm font-semibold text-[#374151]">Award Category *</label>
                                    <Select value={formData.categoryId} onValueChange={(value) => { setFormData(prev => ({ ...prev, categoryId: value })); setFieldErrors(prev => ({ ...prev, categoryId: '' })); }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldErrors.categoryId && <p className="text-xs text-red-500 mt-1">{fieldErrors.categoryId}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="title" className="font-sans text-sm font-semibold text-[#374151]">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                        placeholder="e.g., CEO, Director"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Organization */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="organization" className="font-sans text-sm font-semibold text-[#374151]">Organization</label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="organization"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="Organization name"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Nominee Photo */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="font-sans text-sm font-semibold text-[#374151]">Nominee Photo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D1D5DB] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#2563EB] hover:bg-[#F9FAFB] bg-[#F9FAFB] relative text-center"
                                >
                                    {isUploading ? (
                                        <div className="text-[#6B7280]">Uploading...</div>
                                    ) : imagePreview ? (
                                        <div className="relative w-24 h-24 overflow-hidden rounded-full">
                                            <Image
                                                src={imagePreview}
                                                alt="Nominee photo preview"
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                                quality={85}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-[#EF4444] text-white border-none rounded-full w-6 h-6 cursor-pointer flex items-center justify-center z-10"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-[32px] mb-2">👤</div>
                                            <div className="text-[#374151] font-medium">
                                                Click to upload or drag and drop
                                            </div>
                                            <div className="text-[#9CA3AF] text-[13px] mt-1">
                                                PNG, JPG (recommended: 400x400px, max. 2MB)
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* About / Bio */}
                            <div className="flex flex-col gap-2 w-full mb-4">
                                <label htmlFor="about" className="font-sans text-sm font-semibold text-[#374151]">About / Bio</label>
                                <RichTextEditor
                                    value={formData.about}
                                    onChange={(value) => setFormData(prev => ({ ...prev, about: value }))}
                                    placeholder="Describe the nominee's impact and achievements..."
                                />
                            </div>

                            {/* Quote */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="quote" className="font-sans text-sm font-semibold text-[#374151]">Quote (Optional)</label>
                                <textarea
                                    id="quote"
                                    name="quote"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-y"
                                    placeholder="A memorable quote from the nominee"
                                    rows={2}
                                    maxLength={300}
                                    value={formData.quote}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end mt-2 flex-wrap border-t border-[#E5E7EB] pt-6">
                                <button className="py-2.5 px-5 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    className="py-2.5 px-5 font-sans text-sm font-semibold text-white bg-[#16A34A] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#15803D] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => handleSubmit('PENDING')}
                                    disabled={isCreating || isUpdating}
                                >
                                    💾 Save as Pending
                                </button>
                                <button
                                    className="py-2.5 px-5 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => handleSubmit('APPROVED')}
                                    disabled={isCreating || isUpdating}
                                >
                                    ✓ Approve Nominee
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
                onConfirm={handleConfirmAction}
                title="Delete Nominee"
                message={`Are you sure you want to delete "${confirmModal.nomineeName}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
