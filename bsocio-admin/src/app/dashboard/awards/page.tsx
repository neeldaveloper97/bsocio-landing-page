"use client";

import { useState } from 'react';

interface Award {
    id: number;
    name: string;
    category: string;
    year: number;
    nominees: number;
    status: 'active' | 'closed' | 'upcoming';
}

const mockAwards: Award[] = [
    { id: 1, name: 'Best Community Leader', category: 'Leadership', year: 2025, nominees: 45, status: 'active' },
    { id: 2, name: 'Youth Excellence Award', category: 'Youth Development', year: 2025, nominees: 78, status: 'active' },
    { id: 3, name: 'Cultural Ambassador', category: 'Culture', year: 2025, nominees: 32, status: 'upcoming' },
    { id: 4, name: 'Innovation Champion', category: 'Technology', year: 2025, nominees: 56, status: 'upcoming' },
    { id: 5, name: 'Heritage Preservation Award', category: 'Heritage', year: 2024, nominees: 23, status: 'closed' },
];

export default function AwardsPage() {
    const [awards] = useState<Award[]>(mockAwards);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="status-badge status-active">Active</span>;
            case 'upcoming':
                return <span className="status-badge status-upcoming">Upcoming</span>;
            case 'closed':
                return <span className="status-badge status-archived">Closed</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Awards</h1>
                    <p>Manage award categories and nominations</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create Award
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-value">24</div>
                    <div className="stat-label">Total Awards</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">8</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">456</div>
                    <div className="stat-label">Total Nominees</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">🎖️</div>
                    <div className="stat-value">89</div>
                    <div className="stat-label">Past Winners</div>
                </div>
            </div>

            {/* Awards Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>All Awards</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Award Name</th>
                                <th>Category</th>
                                <th>Year</th>
                                <th>Nominees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {awards.map((award) => (
                                <tr key={award.id}>
                                    <td>{award.name}</td>
                                    <td>{award.category}</td>
                                    <td>{award.year}</td>
                                    <td>{award.nominees}</td>
                                    <td>{getStatusBadge(award.status)}</td>
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

            {/* Create Award Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Award</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="awardName">Award Name</label>
                                <input type="text" id="awardName" className="form-input" placeholder="Enter award name" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select id="category" className="form-select">
                                        <option value="">Select category</option>
                                        <option value="leadership">Leadership</option>
                                        <option value="culture">Culture</option>
                                        <option value="youth">Youth Development</option>
                                        <option value="technology">Technology</option>
                                        <option value="heritage">Heritage</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="year">Year</label>
                                    <select id="year" className="form-select">
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="criteria">Award Criteria</label>
                                <textarea id="criteria" className="form-textarea" placeholder="Describe the award criteria..." rows={4}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Create Award</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
