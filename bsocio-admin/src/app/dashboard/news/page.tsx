"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { SortableHeader } from '@/components/ui/SortableHeader';
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

    // Sorting state
    const [sortBy, setSortBy] = useState<string>('publicationDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Handle sort
    const handleSort = useCallback((field: string, order: 'asc' | 'desc') => {
        setSortBy(field);
        setSortOrder(order);
        setCurrentPage(0); // Reset to first page
    }, []);

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

    const handleArchive = async (id: string) => {
        if (!confirm('Are you sure you want to archive this article?')) return;
        try {
            await archiveNews.mutateAsync(id);
            refetch();
        } catch (error) {
            console.error('Failed to archive:', error);
            alert('Failed to archive article');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
        try {
            await deleteNews.mutateAsync(id);
            refetch();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete article');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <span className="status-badge status-published">Published</span>;
            case 'DRAFT':
                return <span className="status-badge status-draft">Draft</span>;
            case 'ARCHIVED':
                return <span className="status-badge status-archived">Archived</span>;
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

    const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>News & Media</h1>
                    <p>Manage articles, blog posts, and media content</p>
                </div>
                <button className="btn-create" onClick={openCreateModal}>
                    <PlusIcon />
                    Create Article
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">📰</div>
                    <div className="stat-value">{totalArticles}</div>
                    <div className="stat-label">Total Articles</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">{publishedCount}</div>
                    <div className="stat-label">Published</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{draftCount}</div>
                    <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">📦</div>
                    <div className="stat-value">{archivedCount}</div>
                    <div className="stat-label">Archived</div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="table-container">
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>All Articles</h2>
                    <div className="table-header-filters" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            {displayArticles.length} {statusFilter !== 'all' ? statusFilter.toLowerCase() : 'total'}
                        </span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger style={{ width: '200px' }}>
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
                </div>
                <div className="table-wrapper">
                    {isLoading ? (
                        <div className="loading-table" role="status" aria-label="Loading articles">
                            <div className="loading-table-skeleton">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="skeleton-table-row">
                                        <div className="skeleton-box" style={{ width: '48px', height: '32px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ flex: 1, height: '20px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ width: '100px', height: '20px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div>
                                    </div>
                                ))}
                            </div>
                            <span className="sr-only">Loading articles...</span>
                        </div>
                    ) : displayArticles.length === 0 ? (
                        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                            <div className="empty-state">
                                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📰</span>
                                <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>
                                    {statusFilter !== 'all' ? `No ${statusFilter.toLowerCase()} articles` : 'No articles found'}
                                </h3>
                                <p style={{ margin: 0, color: '#6B7280' }}>
                                    {statusFilter !== 'all' ? 'Try selecting a different status filter' : 'Create your first article to get started'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <SortableHeader
                                        label="Title"
                                        field="title"
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
                                        label="Author"
                                        field="author"
                                        currentSortBy={sortBy}
                                        currentSortOrder={sortOrder}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Date"
                                        field="publicationDate"
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
                                    <SortableHeader
                                        label="Views"
                                        field="views"
                                        currentSortBy={sortBy}
                                        currentSortOrder={sortOrder}
                                        onSort={handleSort}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedArticles.map((article: NewsArticle) => (
                                    <tr key={article.id}>
                                        <td data-label="Title">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {article.featuredImage ? (
                                                    <img
                                                        src={article.featuredImage}
                                                        alt=""
                                                        loading="lazy"
                                                        style={{
                                                            width: '48px',
                                                            height: '32px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            flexShrink: 0,
                                                            backgroundColor: '#F3F4F6',
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '48px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        backgroundColor: '#F3F4F6',
                                                        flexShrink: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '14px',
                                                    }}>📰</div>
                                                )}
                                                <span>{article.title}</span>
                                            </div>
                                        </td>
                                        <td data-label="Category">{getCategoryLabel(article.category)}</td>
                                        <td data-label="Author">{article.author}</td>
                                        <td data-label="Date">{formatDate(article.publicationDate)}</td>
                                        <td data-label="Status" style={{ textAlign: 'center' }}>{getStatusBadge(article.status)}</td>
                                        <td data-label="Views" style={{ textAlign: 'center' }}>{article.views || 0}</td>
                                        <td data-label="Actions" style={{ textAlign: 'center' }}>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button
                                                    className="action-btn"
                                                    title="Edit"
                                                    aria-label={`Edit ${article.title}`}
                                                    onClick={() => openEditModal(article)}
                                                >
                                                    <EditIcon />
                                                </button>
                                                {article.status !== 'ARCHIVED' && (
                                                    <button
                                                        className="action-btn"
                                                        title="Archive"
                                                        aria-label={`Archive ${article.title}`}
                                                        onClick={() => handleArchive(article.id)}
                                                    >
                                                        <ArchiveIcon />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn"
                                                    title="Delete"
                                                    aria-label={`Delete ${article.title}`}
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            </div>

            {/* Create/Edit Article Modal - using Portal to render at body level */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-header">
                            <div style={{ flex: 1 }}>
                                <h2 id="modal-title">{editingArticle ? 'Edit Article' : 'Create News Article'}</h2>
                                <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
                                    Add news, media coverage, and press releases
                                </p>
                            </div>
                            <button 
                                className="modal-close" 
                                onClick={closeModal}
                                aria-label="Close modal"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Article Title */}
                            <div className="form-group">
                                <label htmlFor="title">Article Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-input"
                                    placeholder="Enter article title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Author, Category, Publication Date */}
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                <div className="form-group">
                                    <label htmlFor="author">Author *</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        className="form-input"
                                        placeholder="Author name"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category">Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select category</option>
                                        {NEWS_CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="publicationDate">Publication Date *</label>
                                    <input
                                        type="date"
                                        id="publicationDate"
                                        name="publicationDate"
                                        className="form-input"
                                        value={formData.publicationDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="form-group">
                                <label>Featured Image *</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    style={{
                                        border: '2px dashed #D1D5DB',
                                        borderRadius: '8px',
                                        padding: '32px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#F9FAFB',
                                        position: 'relative',
                                    }}
                                >
                                    {isUploading ? (
                                        <div style={{ color: '#6B7280' }}>Uploading...</div>
                                    ) : imagePreview ? (
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, featuredImage: '' }));
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px',
                                                    background: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
                                            <div style={{ color: '#374151', fontWeight: 500 }}>
                                                Click to upload or drag and drop
                                            </div>
                                            <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
                                                PNG, JPG or GIF (recommended: 1200x630px, max. 5MB)
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Excerpt / Summary */}
                            <div className="form-group">
                                <label htmlFor="excerpt">Excerpt / Summary *</label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    className="form-textarea"
                                    placeholder="Write a brief summary of the article (2-3 sentences)"
                                    rows={3}
                                    maxLength={200}
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                />
                                <div style={{ textAlign: 'right', fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                                    {formData.excerpt.length}/200
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="form-group" style={{ width: '100%' }}>
                                <label htmlFor="content">Article Content *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                                    placeholder="Write your article content here..."
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                                    <span>{wordCount} words</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="form-group">
                                <label htmlFor="tags">Tags (Optional)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    className="form-input"
                                    placeholder="Enter tags separated by commas (e.g., birthday heroes, impact, festival)"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px', flexWrap: 'wrap' }}>
                                <button className="btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button
                                    className="btn-primary"
                                    style={{ backgroundColor: '#16A34A' }}
                                    onClick={() => handleSubmit('DRAFT')}
                                    disabled={createNews.isPending || updateNews.isPending}
                                >
                                    💾 Save as Draft
                                </button>
                                <button
                                    className="btn-primary"
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
        </div>
    );
}
