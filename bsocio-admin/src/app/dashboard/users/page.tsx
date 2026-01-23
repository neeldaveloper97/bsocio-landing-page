"use client";

import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
    status: 'active' | 'inactive' | 'suspended';
}

const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@bsocio.com', role: 'Super Admin', lastLogin: '2025-01-15 10:30', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@bsocio.com', role: 'Content Manager', lastLogin: '2025-01-15 09:15', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@bsocio.com', role: 'Event Manager', lastLogin: '2025-01-14 16:45', status: 'active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@bsocio.com', role: 'Moderator', lastLogin: '2025-01-12 11:20', status: 'inactive' },
    { id: 5, name: 'David Brown', email: 'david@bsocio.com', role: 'Support', lastLogin: '2025-01-10 08:00', status: 'suspended' },
];

export default function UsersPage() {
    const [users] = useState<User[]>(mockUsers);
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="status-badge status-active">Active</span>;
            case 'inactive':
                return <span className="status-badge status-archived">Inactive</span>;
            case 'suspended':
                return <span className="status-badge status-draft">Suspended</span>;
            default:
                return null;
        }
    };

    return (
        <div className="content-section active">
            {/* Section Header */}
            <div className="section-header-with-btn">
                <div className="section-intro">
                    <h1>User & System</h1>
                    <p>Manage admin users and system settings</p>
                </div>
                <button className="btn-create" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className="stats-cards-grid">
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-value">15</div>
                    <div className="stat-label">Admin Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">✅</div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔐</div>
                    <div className="stat-value">5</div>
                    <div className="stat-label">Roles</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-red">⚙️</div>
                    <div className="stat-value">v2.5</div>
                    <div className="stat-label">System Version</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <div className="table-header">
                    <h2>Admin Users</h2>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Last Login</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.lastLogin}</td>
                                    <td>{getStatusBadge(user.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button className="action-btn" title="Reset Password">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.6667 7.33333H3.33333C2.59695 7.33333 2 7.93029 2 8.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V8.66667C14 7.93029 13.403 7.33333 12.6667 7.33333Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M4.66699 7.33333V4.66667C4.66699 3.78261 5.01818 2.93477 5.64329 2.30964C6.26842 1.68452 7.11627 1.33333 8.00033 1.33333C8.88438 1.33333 9.73223 1.68452 10.3574 2.30964C10.9825 2.93477 11.3337 3.78261 11.3337 4.66667V7.33333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

            {/* System Settings Section */}
            <div className="table-container">
                <div className="table-header">
                    <h2>System Settings</h2>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="siteName">Site Name</label>
                            <input type="text" id="siteName" className="form-input" defaultValue="Bsocio" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="siteEmail">Contact Email</label>
                            <input type="email" id="siteEmail" className="form-input" defaultValue="contact@bsocio.com" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="timezone">Timezone</label>
                            <select id="timezone" className="form-select" defaultValue="UTC">
                                <option value="UTC">UTC</option>
                                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                                <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="language">Default Language</label>
                            <select id="language" className="form-select" defaultValue="en">
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="sw">Swahili</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button className="btn-primary">Save Settings</button>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add Admin User</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="userName">Full Name</label>
                                    <input type="text" id="userName" className="form-input" placeholder="Enter full name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userEmail">Email</label>
                                    <input type="email" id="userEmail" className="form-input" placeholder="Enter email" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="userRole">Role</label>
                                    <select id="userRole" className="form-select">
                                        <option value="">Select role</option>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="content_manager">Content Manager</option>
                                        <option value="event_manager">Event Manager</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="support">Support</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userStatus">Status</label>
                                    <select id="userStatus" className="form-select">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tempPassword">Temporary Password</label>
                                <input type="password" id="tempPassword" className="form-input" placeholder="Set temporary password" />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn-primary">Add User</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
