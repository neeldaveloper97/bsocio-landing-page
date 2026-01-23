"use client";

import { useState } from 'react';

interface Guest {
    id: number;
    name: string;
    title: string;
    event: string;
    email: string;
    status: 'confirmed' | 'pending' | 'declined';
}

const mockGuests: Guest[] = [
    { id: 1, name: 'Hon. Chief Adeleke', title: 'Traditional Ruler', event: 'Annual Cultural Festival', email: 'adeleke@mail.com', status: 'confirmed' },
    { id: 2, name: 'Dr. Ngozi Okonjo', title: 'Economist', event: 'Community Leadership Summit', email: 'ngozi@mail.com', status: 'confirmed' },
    { id: 3, name: 'Prof. Kwame Asante', title: 'Academic', event: 'Youth Empowerment Workshop', email: 'kwame@mail.com', status: 'pending' },
    { id: 4, name: 'Mrs. Aisha Mohammed', title: 'Business Leader', event: 'Heritage Month Gala', email: 'aisha@mail.com', status: 'confirmed' },
    { id: 5, name: 'Mr. John Okafor', title: 'Actor/Comedian', event: 'Annual Cultural Festival', email: 'john@mail.com', status: 'declined' },
];

export default function GuestsPage() {
    const [guests] = useState<Guest[]>(mockGuests);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="status-badge status-active">Confirmed</span>;
            case 'pending':
                return <span className="status-badge status-upcoming">Pending</span>;
            case 'declined':
                return <span className="status-badge status-draft">Declined</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Guests</h1>
                    <p>Manage event guests and VIPs</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Guest
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid cols-3">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">156</div>
                    <div className="stat-label">Total Guests</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">124</div>
                    <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">32</div>
                    <div className="stat-label">Pending</div>
                </div>
            </div>

            {/* Guests Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>All Guests</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Title</th>
                                <th>Event</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id}>
                                    <td>{guest.name}</td>
                                    <td>{guest.title}</td>
                                    <td>{guest.event}</td>
                                    <td>{guest.email}</td>
                                    <td>{getStatusBadge(guest.status)}</td>
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

            {/* Add Guest Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Guest</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="guestName">Guest Name</label>
                                    <input type="text" id="guestName" className="form-input" placeholder="Enter guest name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title">Title/Position</label>
                                    <input type="text" id="title" className="form-input" placeholder="Enter title" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="event">Event</label>
                                    <select id="event" className="form-select">
                                        <option value="">Select event</option>
                                        <option value="1">Annual Cultural Festival</option>
                                        <option value="2">Community Leadership Summit</option>
                                        <option value="3">Youth Empowerment Workshop</option>
                                        <option value="4">Heritage Month Gala</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" className="form-input" placeholder="Enter email" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea id="notes" className="form-textarea" placeholder="Additional notes..." rows={3}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Add Guest</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
