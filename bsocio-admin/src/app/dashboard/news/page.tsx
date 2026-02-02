"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
    useNews,
    useCreateNews,
    useUpdateNews,
    useArchiveNews,
    useDeleteNews,
    useUploadImage,
    useDeleteImage,
} from '@/hooks';
import { PlusIcon, EditIcon, DeleteIcon, ArchiveIcon } from '@/components/ui/admin-icons';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { NewsArticle, CreateNewsRequest, NewsCategory, NewsStatus, NewsFilters } from '@/types';

const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
    { value: 'PRESS_RELEASE', label: 'Press Release' },
    { value: 'MEDIA_COVERAGE', label: 'Media Coverage' },
    { value: 'ANNOUNCEMENT', label: 'Announcement' },
    { value: 'IMPACT_STORY', label: 'Impact Story' },
    { value: 'PARTNERSHIP', label: 'Partnership' },
];

const PAGE_SIZE = 10;

interface FormData {
    title: string;
    author: string;
    category: NewsCategory | '';
    publicationDate: string;
    featuredImage: string;
    excerpt: string;
    content: string;
    tags: string;
}

const initialFormData: FormData = {
    title: '',
    author: '',
    category: '',
    publicationDate: '',
    featuredImage: '',
    excerpt: '',
    content: '',
    tags: '',
};

export default function NewsPage() {
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
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
        type: 'archive' | 'delete' | null;
        articleId: string | null;
        articleTitle: string;
    }>({
        isOpen: false,
        type: null,
        articleId: null,
        articleTitle: '',
    });

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

    // Sorting state
    const [sortBy, setSortBy] = useState<string>('publicationDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    // Build filters with sorting
    const buildFilters = useCallback((status?: NewsStatus): NewsFilters => ({
        ...(status ? { status } : {}),
        sortBy,
        sortOrder,
    }), [sortBy, sortOrder]);

    // First, always fetch ALL articles to get accurate counts
    const { data: allArticlesData, isLoading: isLoadingAll, refetch } = useNews(buildFilters());
    const allArticles: NewsArticle[] = allArticlesData || [];

    // Calculate stats from ALL articles (not filtered)
    const totalArticles = allArticles.length;
    const publishedCount = allArticles.filter((a: NewsArticle) => a.status === 'PUBLISHED').length;
    const draftCount = allArticles.filter((a: NewsArticle) => a.status === 'DRAFT').length;
    const archivedCount = allArticles.filter((a: NewsArticle) => a.status === 'ARCHIVED').length;

    // Get count for current filter
    const getFilterCount = useCallback((filter: string): number => {
        switch (filter) {
            case 'PUBLISHED': return publishedCount;
            case 'DRAFT': return draftCount;
            case 'ARCHIVED': return archivedCount;
            default: return totalArticles;
        }
    }, [publishedCount, draftCount, archivedCount, totalArticles]);

    // Determine if we should skip API call (when count is 0)
    const shouldSkipFilteredFetch = statusFilter !== 'all' && getFilterCount(statusFilter) === 0;

    // Fetch filtered articles from server (only if count > 0)
    const { data: filteredData, isLoading: isLoadingFiltered } = useNews(
        statusFilter !== 'all' && !shouldSkipFilteredFetch 
            ? buildFilters(statusFilter as NewsStatus)
            : undefined
    );

    // Determine which articles to display
    const displayArticles = useMemo(() => {
        if (shouldSkipFilteredFetch) return []; // No API call, return empty
        if (statusFilter === 'all') return allArticles;
        return filteredData || [];
    }, [statusFilter, shouldSkipFilteredFetch, allArticles, filteredData]);

    const isLoading = isLoadingAll || (statusFilter !== 'all' && !shouldSkipFilteredFetch && isLoadingFiltered);

    const createNews = useCreateNews();
    const updateNews = useUpdateNews();
    const archiveNews = useArchiveNews();
    const deleteNews = useDeleteNews();
    const uploadImage = useUploadImage();
    const deleteImage = useDeleteImage();

    // Pagination
    const totalPages = Math.ceil(displayArticles.length / PAGE_SIZE);
    const paginatedArticles = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return displayArticles.slice(start, start + PAGE_SIZE);
    }, [displayArticles, currentPage]);

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
            alert('Please upload an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to S3
        setIsUploading(true);
        try {
            const response = await uploadImage.mutateAsync(file);
            // response is ImageUploadResponse: { success, message, status, data: { url, ... } }
            const imageUrl = response.data?.url || '';
            setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
            // Track the newly uploaded image URL for cleanup if user cancels
            setUploadedImageUrl(imageUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const openCreateModal = () => {
        setEditingArticle(null);
        setFormData(initialFormData);
        setImagePreview(null);
        setUploadedImageUrl(null); // Reset uploaded image tracking
        setOriginalImageUrl(null); // No original image for new articles
        setShowModal(true);
    };

    const openEditModal = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            author: article.author,
            category: article.category,
            publicationDate: article.publicationDate.split('T')[0],
            featuredImage: article.featuredImage,
            excerpt: article.excerpt,
            content: article.content,
            tags: article.tags?.join(', ') || '',
        });
        setImagePreview(article.featuredImage);
        setUploadedImageUrl(null); // Reset - no new upload yet
        setOriginalImageUrl(article.featuredImage); // Track original image
        setShowModal(true);
    };

    const closeModal = async () => {
        // If user uploaded a new image but is canceling, delete the uploaded image
        if (uploadedImageUrl) {
            try {
                await deleteImage.mutateAsync(uploadedImageUrl);
                console.log('Deleted orphaned image:', uploadedImageUrl);
            } catch (error) {
                console.error('Failed to delete orphaned image:', error);
                // Don't block modal close even if delete fails
            }
        }
        
        setShowModal(false);
        setEditingArticle(null);
        setFormData(initialFormData);
        setImagePreview(null);
        setUploadedImageUrl(null);
        setOriginalImageUrl(null);
    };

    const handleSubmit = async (status: NewsStatus) => {
        // Validation
        if (!formData.title.trim()) {
            alert('Please enter an article title');
            return;
        }
        if (!formData.author.trim()) {
            alert('Please enter an author name');
            return;
        }
        if (!formData.category) {
            alert('Please select a category');
            return;
        }
        if (!formData.publicationDate) {
            alert('Please select a publication date');
            return;
        }
        if (!formData.featuredImage) {
            alert('Please upload a featured image');
            return;
        }
        if (!formData.excerpt.trim()) {
            alert('Please enter an excerpt/summary');
            return;
        }
        if (!formData.content.trim()) {
            alert('Please enter article content');
            return;
        }

        const payload: CreateNewsRequest = {
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category as NewsCategory,
            publicationDate: formData.publicationDate,
            featuredImage: formData.featuredImage,
            excerpt: formData.excerpt.trim(),
            content: formData.content.trim(),
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            status,
        };

        try {
            if (editingArticle) {
                await updateNews.mutateAsync({ id: editingArticle.id, data: payload });
            } else {
                await createNews.mutateAsync(payload);
            }
            // Article saved successfully - clear uploadedImageUrl so closeModal won't delete it
            setUploadedImageUrl(null);
            // Close modal without deleting the image (since it's now part of the article)
            setShowModal(false);
            setEditingArticle(null);
            setFormData(initialFormData);
            setImagePreview(null);
            setOriginalImageUrl(null);
            refetch();
        } catch (error) {
            console.error('Failed to save article:', error);
            alert('Failed to save article. Please try again.');
        }
    };

    const openArchiveConfirm = (article: NewsArticle) => {
        setConfirmModal({
            isOpen: true,
            type: 'archive',
            articleId: article.id,
            articleTitle: article.title,
        });
    };

    const openDeleteConfirm = (article: NewsArticle) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            articleId: article.id,
            articleTitle: article.title,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: null,
            articleId: null,
            articleTitle: '',
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.articleId) return;

        try {
            if (confirmModal.type === 'archive') {
                await archiveNews.mutateAsync(confirmModal.articleId);
            } else if (confirmModal.type === 'delete') {
                await deleteNews.mutateAsync(confirmModal.articleId);
            }
            refetch();
        } catch (error) {
            console.error(`Failed to ${confirmModal.type}:`, error);
            alert(`Failed to ${confirmModal.type} article`);
        } finally {
            closeConfirmModal();
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case 'PUBLISHED':
                return <span className={cn(baseClasses, "bg-[#DCFCE7] text-[#166534]")}>Published</span>;
            case 'DRAFT':
                return <span className={cn(baseClasses, "bg-[#FEF3C7] text-[#92400E]")}>Draft</span>;
            case 'ARCHIVED':
                return <span className={cn(baseClasses, "bg-[#E5E7EB] text-[#6B7280]")}>Archived</span>;
            default:
                return null;
        }
    };

    const getCategoryLabel = (category: NewsCategory) => {
        return NEWS_CATEGORIES.find(c => c.value === category)?.label || category;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="page-main-title">News & Media</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage articles, blog posts, and media content</p>
                </div>
                <button className="btn-primary-responsive" onClick={openCreateModal}>
                    <PlusIcon />
                    <span>Create Article</span>
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">📰</div>
                    <div className="stat-value-responsive">{totalArticles}</div>
                    <div className="stat-label-responsive">Total Articles</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">{publishedCount}</div>
                    <div className="stat-label-responsive">Published</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">📝</div>
                    <div className="stat-value-responsive">{draftCount}</div>
                    <div className="stat-label-responsive">Drafts</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">📦</div>
                    <div className="stat-value-responsive">{archivedCount}</div>
                    <div className="stat-label-responsive">Archived</div>
                </div>
            </div>

            {/* Articles Table */}
            <DataTable<NewsArticle>
                data={paginatedArticles}
                columns={[
                    { 
                        key: 'title', 
                        header: 'Title',
                        sortable: true,
                        render: (article) => (
                            <div className="flex items-center gap-3">
                                {article.featuredImage ? (
                                    <img
                                        src={article.featuredImage}
                                        alt=""
                                        loading="lazy"
                                        className="w-12 h-8 object-cover rounded-md shrink-0 bg-[#F3F4F6]"
                                    />
                                ) : (
                                    <div className="w-12 h-8 rounded-md bg-[#F3F4F6] shrink-0 flex items-center justify-center text-sm">📰</div>
                                )}
                                <span title={article.title}>{truncateText(article.title, 20)}</span>
                            </div>
                        )
                    },
                    { 
                        key: 'category', 
                        header: 'Category',
                        sortable: true,
                        render: (article) => getCategoryLabel(article.category)
                    },
                    { 
                        key: 'author', 
                        header: 'Author',
                        sortable: true,
                        render: (article) => <span title={article.author}>{truncateText(article.author, 20)}</span>
                    },
                    { 
                        key: 'publicationDate', 
                        header: 'Date',
                        sortable: true,
                        render: (article) => formatDate(article.publicationDate)
                    },
                    { 
                        key: 'status', 
                        header: 'Status',
                        sortable: true,
                        align: 'center',
                        render: (article) => getStatusBadge(article.status)
                    },
                    { 
                        key: 'views', 
                        header: 'Views',
                        sortable: true,
                        align: 'center',
                        render: (article) => article.views || 0
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (article) => (
                            <div className="flex items-center gap-2 justify-center">
                                <button
                                    className="p-2 rounded-lg bg-transparent border border-[#E5E7EB] cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]"
                                    title="Edit"
                                    aria-label={`Edit ${article.title}`}
                                    onClick={() => openEditModal(article)}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    className="p-2 rounded-lg bg-transparent border border-[#E5E7EB] cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
                                    title={article.status === 'ARCHIVED' ? 'Already Archived' : 'Archive'}
                                    aria-label={`Archive ${article.title}`}
                                    onClick={() => openArchiveConfirm(article)}
                                    disabled={article.status === 'ARCHIVED'}
                                >
                                    <ArchiveIcon />
                                </button>
                                <button
                                    className="p-2 rounded-lg bg-transparent border border-[#E5E7EB] cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]"
                                    title="Delete"
                                    aria-label={`Delete ${article.title}`}
                                    onClick={() => openDeleteConfirm(article)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<NewsArticle>[]}
                keyExtractor={(article) => article.id}
                isLoading={isLoading}
                title="All Articles"
                totalCount={displayArticles.length}
                headerActions={
                    <div className="flex items-center gap-3">
                        <span className="font-sans text-sm text-[#6B7280]">
                            {displayArticles.length} {statusFilter !== 'all' ? statusFilter.toLowerCase() : 'total'}
                        </span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger style={{ width: '180px' }}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Articles</SelectItem>
                                <SelectItem value="PUBLISHED" disabled={publishedCount === 0}>
                                    Published ({publishedCount})
                                </SelectItem>
                                <SelectItem value="DRAFT" disabled={draftCount === 0}>
                                    Drafts ({draftCount})
                                </SelectItem>
                                <SelectItem value="ARCHIVED" disabled={archivedCount === 0}>
                                    Archived ({archivedCount})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
                emptyIcon="📰"
                emptyTitle={statusFilter !== 'all' ? `No ${statusFilter.toLowerCase()} articles` : 'No articles found'}
                emptyDescription={statusFilter !== 'all' ? 'Try selecting a different status filter' : 'Create your first article to get started'}
                sortConfig={{ key: sortBy, order: sortOrder }}
                onSort={handleSortColumn}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Create/Edit Article Modal - using Portal to render at body level */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <div className="flex-1 min-w-0">
                                <h2 id="modal-title" className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">{editingArticle ? 'Edit Article' : 'Create News Article'}</h2>
                                <p className="text-[#6B7280] text-sm max-sm:text-xs mt-1">
                                    Add news, media coverage, and press releases
                                </p>
                            </div>
                            <button 
                                className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828]" 
                                onClick={closeModal}
                                aria-label="Close modal"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6 max-sm:p-4">
                            {/* Article Title */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="title" className="font-sans text-sm font-semibold text-[#374151]">Article Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="Enter article title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Author, Category, Publication Date */}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="author" className="font-sans text-sm font-semibold text-[#374151]">Author *</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                        placeholder="Author name"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="category" className="font-sans text-sm font-semibold text-[#374151]">Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select category</option>
                                        {NEWS_CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="publicationDate" className="font-sans text-sm font-semibold text-[#374151]">Publication Date *</label>
                                    <input
                                        type="date"
                                        id="publicationDate"
                                        name="publicationDate"
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10"
                                        value={formData.publicationDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="font-sans text-sm font-semibold text-[#374151]">Featured Image *</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D1D5DB] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#2563EB] hover:bg-[#F9FAFB] bg-[#F9FAFB] relative text-center"
                                >
                                    {isUploading ? (
                                        <div className="text-[#6B7280]">Uploading...</div>
                                    ) : imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-w-full max-h-50 rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, featuredImage: '' }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-[#EF4444] text-white border-none rounded-full w-6 h-6 cursor-pointer flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-[32px] mb-2">🖼️</div>
                                            <div className="text-[#374151] font-medium">
                                                Click to upload or drag and drop
                                            </div>
                                            <div className="text-[#9CA3AF] text-[13px] mt-1">
                                                PNG, JPG or GIF (recommended: 1200x630px, max. 5MB)
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

                            {/* Excerpt / Summary */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="excerpt" className="font-sans text-sm font-semibold text-[#374151]">Excerpt / Summary *</label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-y"
                                    placeholder="Write a brief summary of the article (2-3 sentences)"
                                    rows={3}
                                    maxLength={200}
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                />
                                <div className="text-right text-xs text-[#9CA3AF] mt-1">
                                    {formData.excerpt.length}/200
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="flex flex-col gap-2 w-full mb-4">
                                <label htmlFor="content" className="font-sans text-sm font-semibold text-[#374151]">Article Content *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                                    placeholder="Write your article content here..."
                                />
                                <div className="flex justify-end text-xs text-[#9CA3AF] mt-1">
                                    <span>{wordCount} words</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="tags" className="font-sans text-sm font-semibold text-[#374151]">Tags (Optional)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-[3px] focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                    placeholder="Enter tags separated by commas (e.g., birthday heroes, impact, festival)"
                                    value={formData.tags}
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
                                    onClick={() => handleSubmit('DRAFT')}
                                    disabled={createNews.isPending || updateNews.isPending}
                                >
                                    💾 Save as Draft
                                </button>
                                <button
                                    className="py-2.5 px-5 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() => handleSubmit('PUBLISHED')}
                                    disabled={createNews.isPending || updateNews.isPending}
                                >
                                    ✓ Publish Article
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
                title={confirmModal.type === 'archive' ? 'Archive Article' : 'Delete Article'}
                message={
                    confirmModal.type === 'archive'
                        ? `Are you sure you want to archive "${confirmModal.articleTitle}"?`
                        : `Are you sure you want to delete "${confirmModal.articleTitle}"? This action cannot be undone.`
                }
                confirmText={confirmModal.type === 'archive' ? 'Archive' : 'Delete'}
                variant={confirmModal.type === 'delete' ? 'danger' : 'warning'}
                isLoading={archiveNews.isPending || deleteNews.isPending}
            />
        </div>
    );
}
