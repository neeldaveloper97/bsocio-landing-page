"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Users, AlertCircle } from 'lucide-react';
import { useAdminUsers, useAdminUserStats, useUpdateAdminUserRole } from '@/hooks';
import { useAdminActivityOptimized } from '@/hooks';
import type { AdminUser, AdminRoleKey, AdminActivity } from '@/types';

// ============================================
// CONSTANTS
// ============================================

const USER_PAGE_SIZE = 5;
const LOG_PAGE_SIZE = 5;

const ROLE_OPTIONS: { value: AdminRoleKey | 'all'; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'CONTENT_ADMIN', label: 'Content Manager' },
    { value: 'COMMUNICATIONS_ADMIN', label: 'Communications Manager' },
    { value: 'ANALYTICS_VIEWER', label: 'Analytics Viewer' },
];

const LOG_TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'FAQ_CREATED', label: 'FAQ Created' },
    { value: 'FAQ_UPDATED', label: 'FAQ Updated' },
    { value: 'NEWS_CREATED', label: 'News Created' },
    { value: 'NEWS_UPDATED', label: 'News Updated' },
    { value: 'EVENT_CREATED', label: 'Event Created' },
    { value: 'EVENT_UPDATED', label: 'Event Updated' },
    { value: 'LEGAL_CREATED', label: 'Legal Created' },
    { value: 'LEGAL_UPDATED', label: 'Legal Updated' },
];

// ============================================
// BADGE COMPONENTS
// ============================================

const RoleBadge = ({ role }: { role: string }) => {
    const isSuperAdmin = role === 'Super Admin';
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                isSuperAdmin
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
            )}
        >
            {role}
        </span>
    );
};

const StatusBadge = ({ status }: { status: 'active' | 'inactive' }) => {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                status === 'active'
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
            )}
        >
            <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === 'active' ? "bg-green-500" : "bg-gray-400"
            )} />
            {status === 'active' ? 'Active' : 'Inactive'}
        </span>
    );
};

const LogTypeBadge = ({ type }: { type: string }) => {
    const getStyles = () => {
        if (type.includes('FAQ')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (type.includes('NEWS')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (type.includes('EVENT')) return 'bg-green-100 text-green-700 border-green-200';
        if (type.includes('LEGAL')) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const formatType = (t: string) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    return (
        <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
            getStyles()
        )}>
            {formatType(type)}
        </span>
    );
};

// ============================================
// LOADING & ERROR COMPONENTS
// ============================================

const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
    <div className="error-state-container">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="error-state-title">Error Loading Data</h3>
        <p className="error-state-message">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="btn-primary-responsive"
            >
                Try Again
            </button>
        )}
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function UsersSystemPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
    
    // Admin Users state
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
    const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
    const [userCurrentPage, setUserCurrentPage] = useState(0);
    
    // System Logs state
    const [logSearchQuery, setLogSearchQuery] = useState('');
    const [logTypeFilter, setLogTypeFilter] = useState<string>('all');
    const [logCurrentPage, setLogCurrentPage] = useState(0);
    
    // Modal state
    const [showAssignRolesModal, setShowAssignRolesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [selectedRole, setSelectedRole] = useState<AdminRoleKey | ''>('');

    // ============================================
    // API HOOKS - ADMIN USERS
    // ============================================
    
    const {
        data: usersData,
        isLoading: usersLoading,
        error: usersError,
        refetch: refetchUsers,
    } = useAdminUsers({
        skip: userCurrentPage * USER_PAGE_SIZE,
        take: USER_PAGE_SIZE,
        role: userRoleFilter !== 'all' ? userRoleFilter : undefined,
        status: userStatusFilter as 'active' | 'inactive' | 'all',
        search: userSearchQuery || undefined,
    });

    const {
        data: userStats,
        isLoading: statsLoading,
    } = useAdminUserStats();

    const updateRoleMutation = useUpdateAdminUserRole();

    // ============================================
    // API HOOKS - SYSTEM LOGS (Activity)
    // ============================================

    const {
        data: logsData,
        isLoading: logsLoading,
        error: logsError,
        refetch: refetchLogs,
    } = useAdminActivityOptimized({
        skip: logCurrentPage * LOG_PAGE_SIZE,
        take: LOG_PAGE_SIZE,
        type: logTypeFilter !== 'all' ? logTypeFilter : undefined,
        search: logSearchQuery || undefined,
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showAssignRolesModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showAssignRolesModal]);

    // Reset page when filters change
    useEffect(() => {
        setUserCurrentPage(0);
    }, [userSearchQuery, userRoleFilter, userStatusFilter]);

    useEffect(() => {
        setLogCurrentPage(0);
    }, [logSearchQuery, logTypeFilter]);

    // ============================================
    // COMPUTED VALUES
    // ============================================

    const users = usersData?.items || [];
    const userTotal = usersData?.total || 0;
    const userTotalPages = Math.ceil(userTotal / USER_PAGE_SIZE);

    const logs = logsData?.activities || [];
    const logTotal = logsData?.total || 0;
    const logTotalPages = Math.ceil(logTotal / LOG_PAGE_SIZE);

    // ============================================
    // HANDLERS
    // ============================================

    const handleAssignRole = async () => {
        if (!selectedUser || !selectedRole) return;
        
        try {
            await updateRoleMutation.mutateAsync({
                id: selectedUser.id,
                role: selectedRole,
            });
            setShowAssignRolesModal(false);
            setSelectedUser(null);
            setSelectedRole('');
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    // ============================================
    // TABLE COLUMNS
    // ============================================

    const userColumns: DataTableColumn<AdminUser>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Name',
            render: (user) => (
                <span className="font-semibold text-gray-900">{user.name}</span>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            render: (user) => (
                <span className="text-gray-600">{user.email}</span>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => <RoleBadge role={user.role} />,
        },
        {
            key: 'permissions',
            header: 'Permissions',
            render: (user) => (
                <span className="text-gray-600">{user.permissions.join(', ')}</span>
            ),
        },
        {
            key: 'lastLogin',
            header: 'Last Login',
            render: (user) => (
                <span className="text-gray-500 text-sm">{user.lastLogin}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            align: 'center',
            render: (user) => (
                <div className="flex items-center gap-2 justify-center">
                    <StatusBadge status={user.status} />
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(user.roleKey);
                            setShowAssignRolesModal(true);
                        }}
                    >
                        Assign Roles
                    </button>
                </div>
            ),
        },
    ], []);

    const logColumns: DataTableColumn<AdminActivity>[] = useMemo(() => [
        {
            key: 'type',
            header: 'Type',
            render: (log) => <LogTypeBadge type={log.type} />,
        },
        {
            key: 'adminEmail',
            header: 'User',
            render: (log) => (
                <span className="text-gray-700">{log.adminEmail}</span>
            ),
        },
        {
            key: 'title',
            header: 'Action',
            render: (log) => (
                <span className="text-gray-600 max-w-[300px] truncate block">{log.title}</span>
            ),
        },
        {
            key: 'createdAt',
            header: 'Timestamp',
            render: (log) => (
                <span className="text-gray-500 text-sm whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                </span>
            ),
        },
    ], []);

    return (
        <div className="page-content">
            {/* Page Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="page-main-title">User & System Management</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">View admin users, assign roles, and monitor system</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={cn(
                        "flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'users'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Admin Users
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={cn(
                        "flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'logs'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="12" height="12" rx="2" />
                        <path d="M5 5h6M5 8h6M5 11h4" />
                    </svg>
                    System Logs
                </button>
            </div>

            {/* ============================================ */}
            {/* ADMIN USERS TAB */}
            {/* ============================================ */}
            {activeTab === 'users' && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid-4">
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">👥</div>
                            <div className="stat-value-responsive">
                                {statsLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : userStats?.total || 0}
                            </div>
                            <div className="stat-label-responsive">Total Admins</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#10B981]">👑</div>
                            <div className="stat-value-responsive">
                                {statsLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : userStats?.superAdmins || 0}
                            </div>
                            <div className="stat-label-responsive">Super Admins</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">📝</div>
                            <div className="stat-value-responsive">
                                {statsLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : userStats?.contentAdmins || 0}
                            </div>
                            <div className="stat-label-responsive">Content Admins</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#F59E0B]">📢</div>
                            <div className="stat-value-responsive">
                                {statsLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : userStats?.communicationsAdmins || 0}
                            </div>
                            <div className="stat-label-responsive">Communications</div>
                        </div>
                    </div>

                    {/* Users Table with isLoading for skeleton */}
                    {usersError ? (
                        <ErrorState 
                            message={usersError.message || 'Failed to load admin users'} 
                            onRetry={() => refetchUsers()} 
                        />
                    ) : (
                        <DataTable<AdminUser>
                            data={users}
                            columns={userColumns}
                            keyExtractor={(user) => user.id}
                            isLoading={usersLoading}
                            title="Admin Users"
                            totalCount={userTotal}
                            emptyIcon="👤"
                            emptyTitle="No admin users found"
                            emptyDescription="Add your first admin user to get started"
                            currentPage={userCurrentPage}
                            totalPages={userTotalPages}
                            onPageChange={setUserCurrentPage}
                            headerActions={
                                <div className="flex items-center gap-3">
                                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                            }
                        />
                    )}
                </>
            )}

            {/* ============================================ */}
            {/* SYSTEM LOGS TAB */}
            {/* ============================================ */}
            {activeTab === 'logs' && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid-4">
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">📋</div>
                            <div className="stat-value-responsive">{logTotal.toLocaleString()}</div>
                            <div className="stat-label-responsive">Total Logs</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#10B981]">✅</div>
                            <div className="stat-value-responsive">{logTotal.toLocaleString()}</div>
                            <div className="stat-label-responsive">Activity Records</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">📄</div>
                            <div className="stat-value-responsive">{LOG_PAGE_SIZE}</div>
                            <div className="stat-label-responsive">Page Size</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#F59E0B]">📑</div>
                            <div className="stat-value-responsive">{logCurrentPage + 1}</div>
                            <div className="stat-label-responsive">Current Page</div>
                        </div>
                    </div>

                    {/* Logs Table with isLoading for skeleton */}
                    {logsError ? (
                        <ErrorState 
                            message={logsError.message || 'Failed to load system logs'} 
                            onRetry={() => refetchLogs()} 
                        />
                    ) : (
                        <DataTable<AdminActivity>
                            data={logs}
                            columns={logColumns}
                            keyExtractor={(log) => log.id}
                            isLoading={logsLoading}
                            title="System Activity Logs"
                            totalCount={logTotal}
                            emptyIcon="📋"
                            emptyTitle="No system logs found"
                            emptyDescription="System activity will appear here"
                            currentPage={logCurrentPage}
                            totalPages={logTotalPages}
                            onPageChange={setLogCurrentPage}
                            headerActions={
                                <div className="flex items-center gap-3">
                                    <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LOG_TYPE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                            }
                        />
                    )}
                </>
            )}

            {/* ============================================ */}
            {/* ASSIGN ROLES MODAL */}
            {/* ============================================ */}
            {showAssignRolesModal && selectedUser && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && setShowAssignRolesModal(false)}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl overflow-hidden shadow-xl flex flex-col" style={{ maxHeight: '90vh' }}>
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] flex-shrink-0">
                            <div>
                                <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Assign Roles</h2>
                                <p className="font-sans text-sm text-[#6B7280] mt-1">{selectedUser.name}</p>
                            </div>
                            <button className="p-2 text-2xl leading-none rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828]" onClick={() => setShowAssignRolesModal(false)}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 overflow-y-auto flex-1">
                            {/* User Info */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="font-sans text-sm font-semibold text-[#374151]">User Email</label>
                                <div className="py-3 px-4 font-sans text-sm text-[#101828] bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg">
                                    {selectedUser.email}
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="assignRole" className="font-sans text-sm font-semibold text-[#374151]">Select Role *</label>
                                <Select 
                                    value={selectedRole} 
                                    onValueChange={(value) => setSelectedRole(value as AdminRoleKey)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a role..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                        <SelectItem value="CONTENT_ADMIN">Content Manager</SelectItem>
                                        <SelectItem value="COMMUNICATIONS_ADMIN">Communications Manager</SelectItem>
                                        <SelectItem value="ANALYTICS_VIEWER">Analytics Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Current Permissions */}
                            <div className="flex flex-col gap-2">
                                <label className="font-sans text-sm font-semibold text-[#374151]">Current Permissions</label>
                                <div className="py-3 px-4 font-sans text-sm text-[#6B7280] bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg min-h-[44px]">
                                    {selectedUser.permissions.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.permissions.map((permission, index) => (
                                                <span 
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium"
                                                >
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="italic">No permissions assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] flex-shrink-0">
                            <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={() => setShowAssignRolesModal(false)}>Cancel</button>
                            <button 
                                className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed" 
                                onClick={handleAssignRole}
                                disabled={updateRoleMutation.isPending || !selectedRole}
                            >
                                {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
