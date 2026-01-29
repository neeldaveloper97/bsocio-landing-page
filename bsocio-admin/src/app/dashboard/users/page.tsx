"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, EditIcon, DeleteIcon, LockIcon } from '@/components/ui/admin-icons';

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

const PAGE_SIZE = 10;

export default function UsersPage() {
    const [users] = useState<User[]>(mockUsers);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

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

    // Pagination
    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const paginatedUsers = useMemo(() => {
        const start = currentPage * PAGE_SIZE;
        return users.slice(start, start + PAGE_SIZE);
    }, [users, currentPage]);

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
                    <PlusIcon />
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
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Admin Users</h2>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{users.length} total</span>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Last Login</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 24px' }}>
                                        <div className="empty-state">
                                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👤</span>
                                            <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>No users found</h3>
                                            <p style={{ margin: 0, color: '#6B7280' }}>Add your first admin user</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td data-label="Name">{user.name}</td>
                                        <td data-label="Email">{user.email}</td>
                                        <td data-label="Role">{user.role}</td>
                                        <td data-label="Last Login">{user.lastLogin}</td>
                                        <td data-label="Status" style={{ textAlign: 'center' }}>{getStatusBadge(user.status)}</td>
                                        <td data-label="Actions" style={{ textAlign: 'center' }}>
                                            <div className="action-buttons" style={{ justifyContent: 'center' }}>
                                                <button className="action-btn" title="Edit">
                                                    <EditIcon />
                                                </button>
                                                <button className="action-btn" title="Reset Password">
                                                    <LockIcon />
                                                </button>
                                                <button className="action-btn" title="Delete">
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <h2>Add Admin User</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
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
                </div>,
                document.body
            )}
        </div>
    );
}
