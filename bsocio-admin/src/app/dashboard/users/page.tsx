"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon, EditIcon, DeleteIcon, LockIcon } from '@/components/ui/admin-icons';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';

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

    // Define table columns
    const columns: DataTableColumn<User>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Name',
            render: (user) => user.name,
        },
        {
            key: 'email',
            header: 'Email',
            render: (user) => user.email,
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => user.role,
        },
        {
            key: 'lastLogin',
            header: 'Last Login',
            render: (user) => user.lastLogin,
        },
        {
            key: 'status',
            header: 'Status',
            align: 'center',
            render: (user) => getStatusBadge(user.status),
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: () => (
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
            ),
        },
    ], []);

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">User & System</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage admin users and system settings</p>
                </div>
                <button className="btn-primary-responsive" onClick={() => setShowModal(true)}>
                    <PlusIcon />
                    Add User
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">👤</div>
                    <div className="stat-value-responsive">15</div>
                    <div className="stat-label-responsive">Admin Users</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">12</div>
                    <div className="stat-label-responsive">Active</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">🔐</div>
                    <div className="stat-value-responsive">5</div>
                    <div className="stat-label-responsive">Roles</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">⚙️</div>
                    <div className="stat-value-responsive">v2.5</div>
                    <div className="stat-label-responsive">System Version</div>
                </div>
            </div>

            {/* Users Table - Using DataTable Component */}
            <DataTable<User>
                data={paginatedUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                title="Admin Users"
                totalCount={users.length}
                emptyIcon="👤"
                emptyTitle="No users found"
                emptyDescription="Add your first admin user"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

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
