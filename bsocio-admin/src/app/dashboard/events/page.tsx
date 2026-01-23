"use client";

import { useState } from 'react';

interface Event {
    id: number;
    name: string;
    location: string;
    date: string;
    attendees: number;
    status: 'upcoming' | 'ongoing' | 'past';
}

const mockEvents: Event[] = [
    { id: 1, name: 'Annual Cultural Festival', location: 'Lagos, Nigeria', date: '2025-03-15', attendees: 5000, status: 'upcoming' },
    { id: 2, name: 'Community Leadership Summit', location: 'Accra, Ghana', date: '2025-02-28', attendees: 800, status: 'upcoming' },
    { id: 3, name: 'Youth Empowerment Workshop', location: 'Nairobi, Kenya', date: '2025-02-10', attendees: 300, status: 'upcoming' },
    { id: 4, name: 'Heritage Month Gala', location: 'Johannesburg, SA', date: '2025-01-20', attendees: 1200, status: 'ongoing' },
    { id: 5, name: 'New Year Celebration', location: 'Lagos, Nigeria', date: '2025-01-01', attendees: 3500, status: 'past' },
];

export default function EventsPage() {
    const [events] = useState<Event[]>(mockEvents);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <span className="status-badge status-upcoming">Upcoming</span>;
            case 'ongoing':
                return <span className="status-badge status-active">Ongoing</span>;
            case 'past':
                return <span className="status-badge status-past">Past</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>Events</h1>
                    <p>Create and manage platform events</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create Event
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid cols-3">
                <div className="stat-card">
                    <div className="stat-icon">🎉</div>
                    <div className="stat-value">45</div>
                    <div className="stat-label">Total Events</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">📅</div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Upcoming</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">25,000+</div>
                    <div className="stat-label">Total Attendees</div>
                </div>
            </div>

            {/* Events Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>All Events</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Attendees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.name}</td>
                                    <td>{event.location}</td>
                                    <td>{event.date}</td>
                                    <td>{event.attendees.toLocaleString()}</td>
                                    <td>{getStatusBadge(event.status)}</td>
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

            {/* Create Event Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Create New Event</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="eventName">Event Name</label>
                                <input type="text" id="eventName" className="form-input" placeholder="Enter event name" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input type="text" id="location" className="form-input" placeholder="Enter location" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="eventDate">Date</label>
                                    <input type="date" id="eventDate" className="form-input" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" className="form-textarea" placeholder="Describe the event..." rows={4}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Create Event</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
