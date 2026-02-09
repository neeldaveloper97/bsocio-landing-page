"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helper';
import { cn } from '@/lib/utils';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Users, AlertCircle, Power, Edit2 } from 'lucide-react';
import { useAdminUsers, useUpdateAdminUserRole, useExportAdminUsers, useToggleAdminUserStatus } from '@/hooks';
import { useAdminActivityOptimized, useAdminActivityStatsOptimized, useExportAdminActivity } from '@/hooks';
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
    { value: 'USER_LOGIN', label: 'User Login' },
    { value: 'FAQ_CREATED', label: 'FAQ Created' },
    { value: 'FAQ_UPDATED', label: 'FAQ Updated' },
    { value: 'NEWS_CREATED', label: 'News Created' },
    { value: 'NEWS_UPDATED', label: 'News Updated' },
    { value: 'EVENT_CREATED', label: 'Event Created' },
    { value: 'EVENT_UPDATED', label: 'Event Updated' },
    { value: 'LEGAL_CREATED', label: 'Legal Created' },
    { value: 'LEGAL_UPDATED', label: 'Legal Updated' },
];

// Helper to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// ============================================
// BADGE COMPONENTS
// ============================================

// Helper function to format role names (removes underscores and capitalizes properly)
const formatRoleName = (role: string): string => {
    // If already properly formatted (has spaces), return as-is
    if (role.includes(' ')) return role;
    // Convert SUPER_ADMIN -> Super Admin
    return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const RoleBadge = ({ role }: { role: string }) => {
    const formattedRole = formatRoleName(role);
    const isSuperAdmin = formattedRole === 'Super Admin';
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                isSuperAdmin
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
            )}
        >
            {formattedRole}
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
    const [userCurrentPage, setUserCurrentPage] = useState(0);
    
    // System Logs state
    const [logSearchQuery, setLogSearchQuery] = useState('');
    const [logTypeFilter, setLogTypeFilter] = useState<string>('all');
    const [logCurrentPage, setLogCurrentPage] = useState(0);
    
    // Modal state
    const [showAssignRolesModal, setShowAssignRolesModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
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
        page: userCurrentPage + 1,
        limit: USER_PAGE_SIZE,
        role: userRoleFilter !== 'all' ? userRoleFilter : undefined,
        search: userSearchQuery || undefined,
    });

    // Fetch all users for accurate stats counts (not limited by pagination)
    const { data: allUsersData } = useAdminUsers({
        page: 1,
        limit: 1000,
    });

    // Stats endpoint not yet implemented on backend
    // const {
    //     data: userStats,
    //     isLoading: statsLoading,
    // } = useAdminUserStats();

    const updateRoleMutation = useUpdateAdminUserRole();
    const exportUsersMutation = useExportAdminUsers();
    const toggleStatusMutation = useToggleAdminUserStatus();
    const exportLogsMutation = useExportAdminActivity();

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
        includeLogin: true, // System Logs page should show ALL logs including login
    });

    // Activity stats for dashboard
    const { data: activityStats } = useAdminActivityStatsOptimized();

    // Lock body scroll when any modal is open
    useEffect(() => {
        if (showAssignRolesModal || showStatusModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showAssignRolesModal, showStatusModal]);

    // Reset page when filters change
    useEffect(() => {
        setUserCurrentPage(0);
    }, [userSearchQuery, userRoleFilter]);

    useEffect(() => {
        setLogCurrentPage(0);
    }, [logSearchQuery, logTypeFilter]);

    // ============================================
    // COMPUTED VALUES
    // ============================================

    const users = usersData?.items || [];
    const userTotal = usersData?.total || 0;
    const userTotalPages = Math.ceil(userTotal / USER_PAGE_SIZE);

    // Stats from all users (not limited by pagination/filters)
    const allUsers = allUsersData?.items || [];

    const logs = logsData?.activities || [];
    const logTotal = logsData?.total || 0;
    const logTotalPages = Math.ceil(logTotal / LOG_PAGE_SIZE);

    // Interaction guards
    const hasUsers = userTotal > 0;
    const canInteractUsers = hasUsers;
    const shouldPaginateUsers = canInteractUsers && userTotalPages > 1;

    const hasLogs = logTotal > 0;
    const canInteractLogs = hasLogs;
    const shouldPaginateLogs = canInteractLogs && logTotalPages > 1;

    // Pagination bounds check - users
    useEffect(() => {
        if (userCurrentPage > 0 && userTotalPages > 0 && userCurrentPage >= userTotalPages) {
            setUserCurrentPage(Math.max(userTotalPages - 1, 0));
        }
    }, [userCurrentPage, userTotalPages]);

    // Pagination bounds check - logs
    useEffect(() => {
        if (logCurrentPage > 0 && logTotalPages > 0 && logCurrentPage >= logTotalPages) {
            setLogCurrentPage(Math.max(logTotalPages - 1, 0));
        }
    }, [logCurrentPage, logTotalPages]);

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
            showSuccessToast('Role updated', 'User role has been updated successfully');
            setShowAssignRolesModal(false);
            setSelectedUser(null);
            setSelectedRole('');
        } catch (error) {
            console.error('Failed to update role:', error);
            showErrorToast(error, 'Update failed');
        }
    };

    const handleExportUsers = () => {
        exportUsersMutation.mutate({
            role: userRoleFilter !== 'all' ? userRoleFilter : undefined,
            search: userSearchQuery || undefined,
        });
    };

    const handleExportLogs = () => {
        exportLogsMutation.mutate({
            type: logTypeFilter !== 'all' ? logTypeFilter : undefined,
            search: logSearchQuery || undefined,
        });
    };

    const handleToggleStatus = (user: AdminUser) => {
        if (user.roleKey === 'SUPER_ADMIN') {
            return;
        }
        setSelectedUser(user);
        setShowStatusModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!selectedUser) return;
        
        const newStatus = selectedUser.status === 'active' ? false : true;
        try {
            await toggleStatusMutation.mutateAsync({
                id: selectedUser.id,
                isActive: newStatus,
            });
            showSuccessToast(
                newStatus ? 'User activated' : 'User deactivated',
                `User has been ${newStatus ? 'activated' : 'deactivated'} successfully`
            );
            setShowStatusModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to toggle user status:', error);
            showErrorToast(error, 'Update failed');
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
                <span className="font-semibold text-gray-900" title={user.name}>{truncateText(user.name, 12)}</span>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            render: (user) => (
                <span className="text-gray-600" title={user.email}>{truncateText(user.email, 18)}</span>
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
                <span className="text-gray-600" title={user.permissions.join(', ')}>
                    {truncateText(user.permissions.join(', '), 15)}
                </span>
            ),
        },
        {
            key: 'lastLogin',
            header: 'Last Login',
            render: (user) => (
                <span className="text-gray-500 text-sm whitespace-nowrap">{user.lastLogin}</span>
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
            align: 'center',
            render: (user) => (
                <div className="flex items-center gap-2 justify-center">
                    <button
                        type="button"
                        className="action-btn text-blue-600 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200"
                        onClick={() => {
                            setSelectedUser(user);
                            setSelectedRole(user.roleKey);
                            setShowAssignRolesModal(true);
                        }}
                        title="Assign Roles"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "action-btn",
                            user.roleKey === 'SUPER_ADMIN'
                                ? "text-gray-300 cursor-not-allowed"
                                : user.status === 'active'
                                    ? "text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                    : "text-green-500 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        )}
                        onClick={() => handleToggleStatus(user)}
                        disabled={toggleStatusMutation.isPending || user.roleKey === 'SUPER_ADMIN'}
                        title={user.roleKey === 'SUPER_ADMIN' ? 'Cannot deactivate Super Admin' : user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                    >
                        <Power className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ], [toggleStatusMutation.isPending]);

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
                <span className="text-gray-700" title={log.adminEmail}>{truncateText(log.adminEmail, 15)}</span>
            ),
        },
        {
            key: 'title',
            header: 'Action',
            render: (log) => (
                <span className="text-gray-600" title={log.title}>{truncateText(log.title, 25)}</span>
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
                    {/* Stats Cards - Using data from users list */}
                    <div className="stats-grid-4">
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#2563EB]">👑</div>
                            <div className="stat-value-responsive">
                                {usersLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : allUsers.filter(u => u.roleKey === 'SUPER_ADMIN').length}
                            </div>
                            <div className="stat-label-responsive">Super Admin</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#10B981]">📝</div>
                            <div className="stat-value-responsive">
                                {usersLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : allUsers.filter(u => u.roleKey === 'CONTENT_ADMIN').length}
                            </div>
                            <div className="stat-label-responsive">Content Manager</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#F59E0B]">📢</div>
                            <div className="stat-value-responsive">
                                {usersLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : allUsers.filter(u => u.roleKey === 'COMMUNICATIONS_ADMIN').length}
                            </div>
                            <div className="stat-label-responsive">Communications Manager</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#6366F1]">📊</div>
                            <div className="stat-value-responsive">
                                {usersLoading ? <div className="skeleton-box" style={{ width: '40px', height: '32px' }} /> : allUsers.filter(u => u.roleKey === 'ANALYTICS_VIEWER').length}
                            </div>
                            <div className="stat-label-responsive">Analytics Viewer</div>
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
                            onPageChange={shouldPaginateUsers ? setUserCurrentPage : undefined}
                            headerActions={
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
                            <div className="stat-value-responsive">{(activityStats?.totalLogs ?? logTotal).toLocaleString()}</div>
                            <div className="stat-label-responsive">Total Logs</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#10B981]">🔐</div>
                            <div className="stat-value-responsive">{(activityStats?.loginActivity ?? 0).toLocaleString()}</div>
                            <div className="stat-label-responsive">Login Activity</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#6366F1]">📝</div>
                            <div className="stat-value-responsive">{(activityStats?.contentChanges ?? 0).toLocaleString()}</div>
                            <div className="stat-label-responsive">Content Changes</div>
                        </div>
                        <div className="stat-card-responsive">
                            <div className="stat-icon-responsive text-[#F59E0B]">📧</div>
                            <div className="stat-value-responsive">{(activityStats?.emailCampaigns ?? 0).toLocaleString()}</div>
                            <div className="stat-label-responsive">Email Campaigns</div>
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
                            onPageChange={shouldPaginateLogs ? setLogCurrentPage : undefined}
                            headerActions={
                                <>
                                    <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                                        <SelectTrigger className="w-[130px] min-w-[100px]">
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LOG_TYPE_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <button 
                                        className="flex items-center gap-2 px-4 py-3 max-sm:px-3 max-sm:py-2 rounded-lg border border-[#D1D5DB] bg-blue-600 hover:bg-blue-700 text-white text-sm max-sm:text-xs font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                                        onClick={handleExportLogs}
                                        disabled={exportLogsMutation.isPending}
                                    >
                                        <Download className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
                                        <span className="hidden sm:inline">{exportLogsMutation.isPending ? 'Exporting...' : 'Export'}</span>
                                    </button>
                                </>
                            }
                        />
                    )}
                </>
            )}

            {/* ============================================ */}
            {/* ASSIGN ROLES MODAL */}
            {/* ============================================ */}
            {showAssignRolesModal && selectedUser && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3 overflow-hidden" onClick={(e) => e.target === e.currentTarget && setShowAssignRolesModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-[640px] shadow-xl flex flex-col max-sm:rounded-xl" style={{ maxHeight: '90vh' }}>
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] flex-shrink-0 relative pr-14 max-sm:pr-12">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Assign Roles</h2>
                                <p className="font-sans text-sm max-sm:text-xs text-[#6B7280] mt-1 truncate">{selectedUser.name}</p>
                            </div>
                            <button 
                                className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" 
                                onClick={() => setShowAssignRolesModal(false)}
                            >×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 overflow-y-auto flex-1">
                            {/* User Info */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="font-sans text-sm max-sm:text-xs font-semibold text-[#374151]">User Email</label>
                                <div className="py-3 px-4 max-sm:py-2.5 max-sm:px-3 font-sans text-sm max-sm:text-xs text-[#101828] bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg truncate">
                                    {selectedUser.email}
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="flex flex-col gap-2 mb-4">
                                <label htmlFor="assignRole" className="font-sans text-sm max-sm:text-xs font-semibold text-[#374151]">Select Role *</label>
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
                                <label className="font-sans text-sm max-sm:text-xs font-semibold text-[#374151]">Current Permissions</label>
                                <div className="py-3 px-4 max-sm:py-2.5 max-sm:px-3 font-sans text-sm max-sm:text-xs text-[#6B7280] bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg min-h-[44px] max-sm:min-h-[40px]">
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

            {/* ============================================ */}
            {/* TOGGLE STATUS CONFIRMATION MODAL */}
            {/* ============================================ */}
            {showStatusModal && selectedUser && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3 overflow-hidden" onClick={(e) => e.target === e.currentTarget && setShowStatusModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-xl max-sm:rounded-xl">
                        <div className="p-6 max-sm:p-5">
                            <div className={cn(
                                "w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-full flex items-center justify-center mx-auto mb-4",
                                selectedUser.status === 'active' ? "bg-red-100" : "bg-green-100"
                            )}>
                                <Power className={cn(
                                    "w-6 h-6 max-sm:w-5 max-sm:h-5",
                                    selectedUser.status === 'active' ? "text-red-600" : "text-green-600"
                                )} />
                            </div>
                            <h2 className="text-xl max-sm:text-lg font-bold text-center text-gray-900 mb-2">
                                {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'} Admin
                            </h2>
                            <p className="text-gray-600 max-sm:text-sm text-center mb-6 max-sm:mb-4">
                                Are you sure you want to {selectedUser.status === 'active' ? 'deactivate' : 'activate'}{' '}
                                <span className="font-semibold">{selectedUser.name}</span>?
                                {selectedUser.status === 'active' && (
                                    <span className="block mt-2 text-sm max-sm:text-xs text-gray-500">
                                        This user will no longer be able to access the admin dashboard.
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-3 max-sm:gap-2">
                                <button 
                                    className="flex-1 py-2.5 px-4 max-sm:py-2 max-sm:px-3 max-sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={cn(
                                        "flex-1 py-2.5 px-4 max-sm:py-2 max-sm:px-3 max-sm:text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60",
                                        selectedUser.status === 'active' 
                                            ? "bg-red-600 hover:bg-red-700" 
                                            : "bg-green-600 hover:bg-green-700"
                                    )}
                                    onClick={confirmToggleStatus}
                                    disabled={toggleStatusMutation.isPending}
                                >
                                    {toggleStatusMutation.isPending 
                                        ? 'Processing...' 
                                        : selectedUser.status === 'active' ? 'Deactivate' : 'Activate'
                                    }
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
