"use client";

import { useState } from 'react';

interface Message {
    id: number;
    subject: string;
    sender: string;
    email: string;
    date: string;
    status: 'unread' | 'read' | 'replied';
}

const mockMessages: Message[] = [
    { id: 1, subject: 'Event Registration Query', sender: 'John Smith', email: 'john@email.com', date: '2025-01-15', status: 'unread' },
    { id: 2, subject: 'Partnership Proposal', sender: 'ABC Corp', email: 'contact@abc.com', date: '2025-01-14', status: 'read' },
    { id: 3, subject: 'Award Nomination Help', sender: 'Mary Johnson', email: 'mary@email.com', date: '2025-01-13', status: 'replied' },
    { id: 4, subject: 'Sponsorship Inquiry', sender: 'XYZ Ltd', email: 'info@xyz.com', date: '2025-01-12', status: 'unread' },
    { id: 5, subject: 'Feedback on Platform', sender: 'David Brown', email: 'david@email.com', date: '2025-01-10', status: 'read' },
];

export default function CommunicationsPage() {
    const [messages] = useState<Message[]>(mockMessages);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unread':
                return <span className="status-badge status-draft">Unread</span>;
            case 'read':
                return <span className="status-badge status-upcoming">Read</span>;
            case 'replied':
                return <span className="status-badge status-active">Replied</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Communications</h1>
                    <p>Manage contact messages and announcements</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    New Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">✉️</div>
                    <div className="stat-value">256</div>
                    <div className="stat-label">Total Messages</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">🔴</div>
                    <div className="stat-value">34</div>
                    <div className="stat-label">Unread</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">198</div>
                    <div className="stat-label">Replied</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📢</div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Announcements Sent</div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Recent Messages</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Sender</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td style={{ fontWeight: message.status === 'unread' ? 700 : 400 }}>{message.subject}</td>
                                    <td>{message.sender}</td>
                                    <td>{message.email}</td>
                                    <td>{message.date}</td>
                                    <td>{getStatusBadge(message.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="View">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 8C1 8 3.54545 3 8 3C12.4545 3 15 8 15 8C15 8 12.4545 13 8 13C3.54545 13 1 8 1 8Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button className="action-btn" title="Reply">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 8L2 4M2 4L6 0M2 4H10C11.0609 4 12.0783 4.42143 12.8284 5.17157C13.5786 5.92172 14 6.93913 14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12H8" stroke="#1F6AE1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* New Announcement Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create Announcement</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" className="form-input" placeholder="Announcement title" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="audience">Audience</label>
                                    <select id="audience" className="form-select">
                                        <option value="all">All Users</option>
                                        <option value="members">Members Only</option>
                                        <option value="nominees">Nominees</option>
                                        <option value="guests">Guests</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="priority">Priority</label>
                                    <select id="priority" className="form-select">
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" className="form-textarea" placeholder="Write your announcement..." rows={5}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Send Announcement</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
