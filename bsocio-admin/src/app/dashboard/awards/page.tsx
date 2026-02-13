"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import Link from 'next/link';
import { X } from 'lucide-react';
import {
    useAwardCategories,
    useCreateAwardCategory,
    useUpdateAwardCategory,
    useDeleteAwardCategory,
    useAwardsStatistics,
    useEventStatistics
} from '@/hooks';
import type { AwardCategory, CreateAwardCategoryRequest, AwardCategoryStatus } from '@/types';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ============================================
// ICON COMPONENTS
// ============================================

// Helper to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

function CategoryIcon({ icon, color }: { icon?: string; color?: string }) {
    const bgColor = color || '#1F6AE1';
    return (
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: bgColor }}
        >
            {icon || '🏆'}
        </div>
    );
}

function QuickActionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
    return (
        <div
            className="bg-white rounded-xl border border-border p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 text-center"
            onClick={onClick}
        >
            <div className="text-primary text-2xl mb-3 flex justify-center">{icon}</div>
            <h4 className="font-semibold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AwardsPage() {
    // API Hooks
    const { data, isLoading, refetch } = useAwardCategories();
    const categories = data?.items ?? [];
    const { data: statistics } = useAwardsStatistics();
    const { data: eventStats } = useEventStatistics();
    const { mutateAsync: createCategory, isPending: isCreating } = useCreateAwardCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateAwardCategory();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteAwardCategory();

    // UI State
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AwardCategory | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<AwardCategory | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '🏆',
        color: '#1F6AE1',
        status: 'ACTIVE' as AwardCategoryStatus,
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal || showDeleteModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => { document.body.classList.remove('modal-open'); };
    }, [showModal, showDeleteModal]);

    // Stats
    const totalCategories = statistics?.totalCategories || categories?.length || 0;
    const totalNominees = statistics?.totalNominees || 0;
    const activeAwards = statistics?.activeAwards || 0;
    const upcomingCeremonies = eventStats?.upcomingEvents || 0;

    const resetForm = () => {
        setFormData({ name: '', description: '', icon: '🏆', color: '#1F6AE1', status: 'ACTIVE' });
        setEditingCategory(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (category: AwardCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '🏆',
            color: category.color || '#1F6AE1',
            status: category.status,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        // Validation matching API rules
        if (!formData.name.trim()) {
            toast.error('Validation error', { description: 'Please enter a category name' });
            return;
        }
        if (formData.name.trim().length > 100) {
            toast.error('Validation error', { description: 'Category name must be 100 characters or less' });
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Validation error', { description: 'Please enter a description' });
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory({ id: editingCategory.id, data: formData });
                showSuccessToast('Category updated', `${formData.name} has been updated successfully`);
            } else {
                await createCategory(formData as CreateAwardCategoryRequest);
                showSuccessToast('Category created', `${formData.name} has been added successfully`);
            }
            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            console.error('Failed to save category:', error);
            showErrorToast(error, 'Save failed');
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategory(deletingCategory.id);
            showSuccessToast('Category deleted', `${deletingCategory.name} has been removed`);
            setShowDeleteModal(false);
            setDeletingCategory(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete category:', error);
            showErrorToast(error, 'Delete failed');
        }
    };

    const iconOptions = ['🏆', '⭐', '🎖️', '🎯', '💎', '🌟', '🎪', '🎭', '❤️', '🌍'];
    const colorOptions = ['#1F6AE1', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

    return (
        <div className="page-content">
            {/* Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Awards & Recognition Management</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage award categories and recognition programs</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">🏆</div>
                    <div className="stat-value-responsive">{totalCategories}</div>
                    <div className="stat-label-responsive">Total Categories</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#101828]">👤</div>
                    <div className="stat-value-responsive">{totalNominees}</div>
                    <div className="stat-label-responsive">Total Nominees</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">⭐</div>
                    <div className="stat-value-responsive">{activeAwards}</div>
                    <div className="stat-label-responsive">Active Awards</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">🎭</div>
                    <div className="stat-value-responsive">{upcomingCeremonies}</div>
                    <div className="stat-label-responsive">Upcoming Ceremonies</div>
                </div>
            </div>

            {/* Award Categories Section */}
            <div className="bg-white rounded-xl border border-border p-4 sm:p-6 w-full overflow-hidden">
                <h2 className="text-lg font-semibold text-foreground mb-4 sm:mb-6">Award Categories</h2>

                {isLoading ? (
                    <div className="space-y-4 w-full">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="award-skeleton">
                                <div className="skeleton-icon" />
                                <div className="skeleton-text">
                                    <div className="skeleton-text-line" style={{ width: '60%' }} />
                                    <div className="skeleton-text-line" />
                                </div>
                                <div className="skeleton-btn" />
                            </div>
                        ))}
                    </div>
                ) : categories && categories.length > 0 ? (
                    <div className="space-y-4 w-full">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all gap-4"
                            >
                                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <CategoryIcon icon={category.icon} color={category.color} />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-foreground" title={category.name}>{truncateText(category.name, 30)}</h3>
                                        <p className="text-sm text-muted-foreground" title={category.description}>{truncateText(category.description || '', 50)}</p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                {category._count?.nominees || 0} Nominees
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                                {category.status === 'ACTIVE' ? category._count?.nominees || 0 : 0} Active Awards
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full sm:w-auto px-4 py-2 text-sm bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors shrink-0"
                                    onClick={() => openEditModal(category)}
                                >
                                    Manage Category
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground w-full bg-gray-50 rounded-lg">
                        No categories found. Click "Add New Category" to create one.
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <QuickActionCard
                        icon={<span>➕</span>}
                        title="Add New Category"
                        description="Create a new award category"
                        onClick={openCreateModal}
                    />
                    <Link href="/dashboard/nominees">
                        <QuickActionCard
                            icon={<span>👤</span>}
                            title="Manage Nominees"
                            description="View and edit all nominees"
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/dashboard/events">
                        <QuickActionCard
                            icon={<span>🎭</span>}
                            title="Award Ceremony"
                            description="Schedule new ceremony"
                            onClick={() => { }}
                        />
                    </Link>
                </div>
            </div>

            {/* Create/Edit Category Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-[560px] max-sm:max-w-[95vw] max-sm:rounded-xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 max-sm:p-4 border-b border-border pr-14 max-sm:pr-12 relative">
                            <div>
                                <h2 className="text-xl max-sm:text-lg font-semibold text-foreground">
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h2>
                                <p className="text-sm max-sm:text-xs text-muted-foreground">
                                    {editingCategory ? 'Update award category details' : 'Add a new award category'}
                                </p>
                            </div>
                            <button
                                className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-lg text-gray-600 hover:text-gray-900"
                                onClick={() => { setShowModal(false); resetForm(); }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-sm:p-4 space-y-5 max-sm:space-y-4">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm max-sm:text-xs font-medium text-foreground mb-2">
                                    Category Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Birthday Heroes"
                                    className="w-full px-4 py-3 max-sm:px-3 max-sm:py-2 max-sm:text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm max-sm:text-xs font-medium text-foreground mb-2">
                                    Icon
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg text-xl max-sm:text-lg flex items-center justify-center border-2 transition-all ${formData.icon === icon
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm max-sm:text-xs font-medium text-foreground mb-2">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg border-2 transition-all ${formData.color === color
                                                    ? 'border-foreground scale-110'
                                                    : 'border-transparent hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm max-sm:text-xs font-medium text-foreground mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the award category..."
                                    rows={3}
                                    className="w-full px-4 py-3 max-sm:px-3 max-sm:py-2 max-sm:text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm max-sm:text-xs font-medium text-foreground mb-2">
                                    Status
                                </label>
                                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AwardCategoryStatus }))}>
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

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-border">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-5 py-2.5 max-sm:px-3 max-sm:py-2 text-sm max-sm:text-xs font-medium text-foreground bg-white border border-border rounded-lg hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            {editingCategory && (
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setDeletingCategory(editingCategory);
                                        setShowDeleteModal(true);
                                    }}
                                    className="px-5 py-2.5 max-sm:px-3 max-sm:py-2 text-sm max-sm:text-xs font-medium text-white bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating || !formData.name.trim()}
                                className="px-5 py-2.5 max-sm:px-3 max-sm:py-2 text-sm max-sm:text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating || isUpdating ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal && !!deletingCategory}
                onClose={() => { setShowDeleteModal(false); setDeletingCategory(null); }}
                onConfirm={handleDelete}
                title="Delete Award Category"
                message={deletingCategory ? `Are you sure you want to delete "${deletingCategory.name}"? This action cannot be undone.` : ''}
                confirmText={isDeleting ? "Deleting..." : "Delete"}
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
