"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
    useAwardCategories, 
    useCreateAwardCategory, 
    useUpdateAwardCategory, 
    useDeleteAwardCategory,
    useAwardsStatistics 
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

function StatCard({ label, value, color = 'text-foreground' }: { label: string; value: number | string; color?: string }) {
    return (
        <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
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
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showModal, showDeleteModal]);

    // Stats
    const totalCategories = statistics?.totalCategories || categories?.length || 0;
    const totalNominees = statistics?.totalNominees || 0;
    const activeAwards = statistics?.activeAwards || 0;
    const upcomingCeremonies = statistics?.upcomingCeremonies || 0;

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
        try {
            if (editingCategory) {
                await updateCategory({ id: editingCategory.id, data: formData });
            } else {
                await createCategory(formData as CreateAwardCategoryRequest);
            }
            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category');
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategory(deletingCategory.id);
            setShowDeleteModal(false);
            setDeletingCategory(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category');
        }
    };

    const iconOptions = ['🏆', '⭐', '🎖️', '🎯', '💎', '🌟', '🎪', '🎭', '❤️', '🌍'];
    const colorOptions = ['#1F6AE1', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-1">Awards & Recognition Management</h1>
                <p className="text-muted-foreground">Manage award categories and recognition programs</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Categories" value={totalCategories} color="text-primary" />
                <StatCard label="Total Nominees" value={totalNominees} />
                <StatCard label="Active Awards" value={activeAwards} color="text-primary" />
                <StatCard label="Upcoming Ceremonies" value={upcomingCeremonies} color="text-primary" />
            </div>

            {/* Award Categories Section */}
            <div className="bg-white rounded-xl border border-border p-6 mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">Award Categories</h2>
                
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : categories && categories.length > 0 ? (
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <div 
                                key={category.id} 
                                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <CategoryIcon icon={category.icon} color={category.color} />
                                    <div>
                                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="9" cy="7" r="4"/>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                                </svg>
                                                {category._count?.nominees || 0} Nominees
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                </svg>
                                                {category.status === 'ACTIVE' ? category._count?.nominees || 0 : 0} Active Awards
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                                    onClick={() => openEditModal(category)}
                                >
                                    Manage Category
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No categories found. Click "Add New Category" to create one.
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickActionCard
                        icon={<span>○</span>}
                        title="Add New Category"
                        description="Create a new award category"
                        onClick={openCreateModal}
                    />
                    <Link href="/dashboard/nominees">
                        <QuickActionCard
                            icon={<span>👤</span>}
                            title="Manage Nominees"
                            description="View and edit all nominees"
                            onClick={() => {}}
                        />
                    </Link>
                    <QuickActionCard
                        icon={<span>🎭</span>}
                        title="Award Ceremony"
                        description="Schedule new ceremony"
                        onClick={() => alert('Ceremony scheduling coming soon!')}
                    />
                </div>
            </div>

            {/* Create/Edit Category Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {editingCategory ? 'Update award category details' : 'Add a new award category'}
                                </p>
                            </div>
                            <button 
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                onClick={() => { setShowModal(false); resetForm(); }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Category Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Birthday Heroes"
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Icon
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all ${
                                                formData.icon === icon 
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
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                                formData.color === color 
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
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the award category..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Status
                                </label>
                                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AwardCategoryStatus }))}>
                                    <SelectTrigger>
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
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-5 py-2.5 text-sm font-medium text-foreground bg-white border border-border rounded-lg hover:bg-muted transition-colors"
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
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isCreating || isUpdating || !formData.name.trim()}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
