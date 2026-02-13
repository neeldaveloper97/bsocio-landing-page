"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
    useSpecialGuests,
    useCreateSpecialGuest,
    useUpdateSpecialGuest,
    useDeleteSpecialGuest,
    useUploadImage,
} from '@/hooks';
import type { SpecialGuest, CreateSpecialGuestRequest, SpecialGuestStatus, SpecialGuestFilters } from '@/types';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';
import { X } from 'lucide-react';
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
    title: string;
    bio: string;
    imageUrl: string;
}

const initialFormData: FormData = {
    name: '',
    title: '',
    bio: '',
    imageUrl: '',
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function GuestsPage() {
    // State
    const [showModal, setShowModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState<SpecialGuest | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | null;
        guestId: string | null;
        guestName: string;
    }>({
        isOpen: false,
        type: null,
        guestId: null,
        guestName: '',
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
    const filters: SpecialGuestFilters = useMemo(() => ({
        ...(statusFilter !== 'all' ? { status: statusFilter as SpecialGuestStatus } : {}),
        skip: currentPage * PAGE_SIZE,
        take: PAGE_SIZE,
    }), [statusFilter, currentPage]);

    // API Hooks - server-side pagination
    const { guests: rawGuests, total: rawTotal, isLoading: guestsLoading, refetch } = useSpecialGuests(filters);

    // Fetch stats separately (for counts)
    const { guests: allGuests, refetch: refetchStats } = useSpecialGuests({ take: 1000 });
    const activeCount = allGuests?.filter((g: SpecialGuest) => g.status === 'ACTIVE').length || 0;
    const inactiveCount = allGuests?.filter((g: SpecialGuest) => g.status === 'INACTIVE').length || 0;

    // Skip unnecessary loading when stats already confirm 0 results for this filter
    const filterHasNoResults = useMemo(() => {
        if (!allGuests || allGuests.length === 0) return false;
        if (statusFilter === 'ACTIVE' && activeCount === 0) return true;
        if (statusFilter === 'INACTIVE' && inactiveCount === 0) return true;
        return false;
    }, [statusFilter, activeCount, inactiveCount, allGuests]);

    const displayGuests = filterHasNoResults ? [] : rawGuests;
    const totalGuests = filterHasNoResults ? 0 : rawTotal;
    const isLoading = filterHasNoResults ? false : guestsLoading;

    const { mutateAsync: createGuest, isPending: isCreating } = useCreateSpecialGuest();
    const { mutateAsync: updateGuest, isPending: isUpdating } = useUpdateSpecialGuest();
    const { mutateAsync: deleteGuest, isPending: isDeleting } = useDeleteSpecialGuest();
    const uploadImage = useUploadImage();

    // Server-side pagination
    const totalPages = Math.ceil(totalGuests / PAGE_SIZE);

    // Interaction guards
    const hasGuests = totalGuests > 0;
    const canInteract = hasGuests;
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
        setEditingGuest(null);
        setFormData(initialFormData);
        setImagePreview(null);
        setUploadedImageUrl(null);
        setOriginalImageUrl(null);
        setShowModal(true);
    };

    const openEditModal = (guest: SpecialGuest) => {
        setEditingGuest(guest);
        setFormData({
            name: guest.name,
            title: guest.title || '',
            bio: guest.bio || '',
            imageUrl: guest.imageUrl || '',
        });
        setImagePreview(guest.imageUrl || null);
        setOriginalImageUrl(guest.imageUrl || null);
        setUploadedImageUrl(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingGuest(null);
        setFormData(initialFormData);
        setImagePreview(null);
        setUploadedImageUrl(null);
        setOriginalImageUrl(null);
        setFieldErrors({});
    };

    const handleSubmit = async (status: SpecialGuestStatus) => {
        // Validation
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = 'Please enter a name';
        else if (formData.name.trim().length > 100) errors.name = 'Name must be 100 characters or less';
        if (!formData.title.trim()) errors.title = 'Please enter a title';

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const payload: CreateSpecialGuestRequest = {
            name: formData.name.trim(),
            title: formData.title.trim(),
            bio: formData.bio.trim() || undefined,
            imageUrl: formData.imageUrl || undefined,
            status,
        };

        try {
            if (editingGuest) {
                await updateGuest({ id: editingGuest.id, data: payload });
                showSuccessToast('Guest updated', `${formData.name} has been updated successfully`);
            } else {
                await createGuest(payload);
                showSuccessToast('Guest created', `${formData.name} has been added successfully`);
            }
            setUploadedImageUrl(null);
            closeModal();
            refetch();
            refetchStats();
        } catch (error) {
            console.error('Failed to save guest:', error);
            showErrorToast(error, 'Save failed');
        }
    };

    const openDeleteConfirm = (guest: SpecialGuest) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            guestId: guest.id,
            guestName: guest.name,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: null,
            guestId: null,
            guestName: '',
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.guestId) return;

        try {
            await deleteGuest(confirmModal.guestId);
            showSuccessToast('Guest deleted', `${confirmModal.guestName} has been removed`);
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
    const getStatusBadge = (status: SpecialGuestStatus) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Published</span>;
            case 'INACTIVE':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
            default:
                return null;
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        // Strip HTML tags for display
        const strippedText = text.replace(/<[^>]*>/g, '');
        if (strippedText.length <= maxLength) return strippedText;
        return strippedText.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="page-main-title">Special Guests Management</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Create, edit, and manage special guests for events</p>
                </div>
                <button className="btn-primary-responsive" onClick={openCreateModal}>
                    <PlusIcon />
                    <span>Add Guest</span>
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-3">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">⭐</div>
                    <div className="stat-value-responsive">{allGuests?.length || 0}</div>
                    <div className="stat-label-responsive">Total Guests</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">{activeCount}</div>
                    <div className="stat-label-responsive">Published</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#6B7280]">📝</div>
                    <div className="stat-value-responsive">{inactiveCount}</div>
                    <div className="stat-label-responsive">Drafts</div>
                </div>
            </div>

            {/* Guests Table */}
            <DataTable<SpecialGuest>
                data={displayGuests}
                columns={[
                    {
                        key: 'name',
                        header: 'Guest',
                        sortable: true,
                        render: (guest) => (
                            <div className="flex items-center gap-3">
                                {guest.imageUrl ? (
                                    <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[#F3F4F6]">
                                        <Image
                                            src={guest.imageUrl}
                                            alt={guest.name}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] shrink-0 flex items-center justify-center text-sm font-medium">
                                        {guest.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium" title={guest.name}>{truncateText(guest.name, 25)}</span>
                                    {guest.title && <div className="text-xs text-[#6B7280]">{truncateText(guest.title, 30)}</div>}
                                </div>
                            </div>
                        )
                    },
                    {
                        key: 'title',
                        header: 'Title',
                        render: (guest) => <span title={guest.title}>{truncateText(guest.title || '-', 25)}</span>
                    },
                    {
                        key: 'bio',
                        header: 'Bio',
                        render: (guest) => (
                            <span className="text-[#6B7280]" title={guest.bio?.replace(/<[^>]*>/g, '')}>
                                {truncateText(guest.bio || '-', 40)}
                            </span>
                        )
                    },
                    {
                        key: 'status',
                        header: 'Status',
                        sortable: true,
                        align: 'center',
                        render: (guest) => getStatusBadge(guest.status)
                    },
                    {
                        key: 'createdAt',
                        header: 'Created',
                        sortable: true,
                        render: (guest) => formatDate(guest.createdAt)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (guest) => (
                            <div className="flex items-center gap-2 justify-center">
                                <button
                                    type="button"
                                    className="action-btn"
                                    title="Edit"
                                    aria-label={`Edit ${guest.name}`}
                                    onClick={() => openEditModal(guest)}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    type="button"
                                    className="action-btn"
                                    title="Delete"
                                    aria-label={`Delete ${guest.name}`}
                                    onClick={() => openDeleteConfirm(guest)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<SpecialGuest>[]}
                keyExtractor={(guest) => guest.id}
                isLoading={isLoading}
                title="All Guests"
                totalCount={displayGuests.length}
                headerActions={
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Guests</SelectItem>
                            <SelectItem value="ACTIVE" disabled={activeCount === 0}>
                                Published ({activeCount})
                            </SelectItem>
                            <SelectItem value="INACTIVE" disabled={inactiveCount === 0}>
                                Drafts ({inactiveCount})
                            </SelectItem>
                        </SelectContent>
                    </Select>
                }
                emptyIcon="⭐"
                emptyTitle={statusFilter !== 'all' ? `No ${statusFilter === 'ACTIVE' ? 'published' : 'draft'} guests` : 'No guests found'}
                emptyDescription={statusFilter !== 'all' ? 'Try selecting a different status filter' : 'Add your first special guest to get started'}
                sortConfig={{ key: sortBy, order: sortOrder }}
                onSort={canInteract ? handleSortColumn : undefined}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={shouldPaginate ? setCurrentPage : undefined}
            />

            {/* Create/Edit Guest Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-2xl max-sm:rounded-xl w-full max-w-[560px] max-sm:max-w-[95vw] max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] pr-14 max-sm:pr-12 relative">
                            <div className="flex-1 min-w-0">
                                <h2 id="modal-title" className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">{editingGuest ? 'Edit Guest' : 'Add Special Guest'}</h2>
                                <p className="text-[#6B7280] text-sm max-sm:text-xs mt-1">
                                    Add distinguished guests for ceremonies and events
                                </p>
                            </div>
                            <button
                                className="absolute right-4 max-sm:right-3 top-6 max-sm:top-4 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                onClick={closeModal}
                                aria-label="Close modal"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 max-sm:p-4">
                            {/* Guest Name */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="name" className="font-sans text-sm font-semibold text-[#374151]">Guest Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="Enter guest name"
                                    value={formData.name}
                                    onChange={(e) => { handleInputChange(e); setFieldErrors(prev => ({ ...prev, name: '' })); }}
                                />
                                {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                            </div>

                            {/* Title */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="title" className="font-sans text-sm font-semibold text-[#374151]">Title / Role *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="e.g., Keynote Speaker, Guest of Honor, CEO"
                                    value={formData.title}
                                    onChange={(e) => { handleInputChange(e); setFieldErrors(prev => ({ ...prev, title: '' })); }}
                                />
                                {fieldErrors.title && <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>}
                            </div>

                            {/* Guest Photo */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="font-sans text-sm font-semibold text-[#374151]">Guest Photo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D1D5DB] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#2563EB] hover:bg-[#F9FAFB] bg-[#F9FAFB] relative text-center"
                                >
                                    {isUploading ? (
                                        <div className="text-[#6B7280]">Uploading...</div>
                                    ) : imagePreview ? (
                                        <div className="relative group shrink-0">
                                            <div className="relative w-24 h-24 overflow-hidden rounded-full border border-gray-200">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Guest photo preview"
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                }}
                                                className="absolute -top-1 -right-1 bg-white hover:bg-red-50 text-red-500 border border-gray-200 shadow-sm rounded-full w-6 h-6 cursor-pointer flex items-center justify-center z-50 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-[32px] mb-2">⭐</div>
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

                            {/* Bio */}
                            <div className="flex flex-col gap-2 w-full mb-4">
                                <label htmlFor="bio" className="font-sans text-sm font-semibold text-[#374151]">Biography</label>
                                <RichTextEditor
                                    value={formData.bio}
                                    onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
                                    placeholder="Write a brief biography about the guest..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end mt-2 flex-wrap border-t border-[#E5E7EB] pt-6">
                                <button className="py-2.5 px-5 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    className="py-2.5 px-5 font-sans text-sm font-semibold text-white bg-[#16A34A] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#15803D] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => handleSubmit('INACTIVE')}
                                    disabled={isCreating || isUpdating}
                                >
                                    💾 Save as Draft
                                </button>
                                <button
                                    className="py-2.5 px-5 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => handleSubmit('ACTIVE')}
                                    disabled={isCreating || isUpdating}
                                >
                                    ✓ Publish Guest
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
                title="Delete Guest"
                message={`Are you sure you want to delete "${confirmModal.guestName}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
