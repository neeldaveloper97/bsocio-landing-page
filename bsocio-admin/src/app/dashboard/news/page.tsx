"use client";

import { useState } from 'react';

interface NewsArticle {
    id: number;
    title: string;
    category: string;
    author: string;
    date: string;
    status: 'published' | 'draft' | 'archived';
}

const mockArticles: NewsArticle[] = [
    { id: 1, title: 'Annual Cultural Festival 2025', category: 'Events', author: 'John Doe', date: '2025-01-15', status: 'published' },
    { id: 2, title: 'Community Leader Awards Announced', category: 'Awards', author: 'Jane Smith', date: '2025-01-14', status: 'published' },
    { id: 3, title: 'New Partnership with Local NGO', category: 'News', author: 'Admin', date: '2025-01-13', status: 'draft' },
    { id: 4, title: 'Youth Development Program Launch', category: 'Programs', author: 'John Doe', date: '2025-01-12', status: 'published' },
    { id: 5, title: 'Heritage Month Celebrations', category: 'Events', author: 'Jane Smith', date: '2025-01-10', status: 'archived' },
];

export default function NewsPage() {
    const [articles] = useState<NewsArticle[]>(mockArticles);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="status-badge status-published">Published</span>;
            case 'draft':
                return <span className="status-badge status-draft">Draft</span>;
            case 'archived':
                return <span className="status-badge status-archived">Archived</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>News & Media</h1>
                    <p>Manage articles, blog posts, and media content</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create Article
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">📰</div>
                    <div className="stat-value">248</div>
                    <div className="stat-label">Total Articles</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">189</div>
                    <div className="stat-label">Published</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">42</div>
                    <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">📦</div>
                    <div className="stat-value">17</div>
                    <div className="stat-label">Archived</div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>All Articles</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>{article.title}</td>
                                    <td>{article.category}</td>
                                    <td>{article.author}</td>
                                    <td>{article.date}</td>
                                    <td>{getStatusBadge(article.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button className="action-btn" title="Delete">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Article Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Article</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" className="form-input" placeholder="Enter article title" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select id="category" className="form-select">
                                        <option value="">Select category</option>
                                        <option value="news">News</option>
                                        <option value="events">Events</option>
                                        <option value="awards">Awards</option>
                                        <option value="programs">Programs</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select id="status" className="form-select">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea id="content" className="form-textarea" placeholder="Write your article content..." rows={6}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Create Article</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
