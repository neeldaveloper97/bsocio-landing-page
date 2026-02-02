"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { PlusIcon, EditIcon, DeleteIcon, CheckIcon } from '@/components/ui/admin-icons';

interface Nominee {
    id: number;
    name: string;
    award: string;
    category: string;
    votes: number;
    status: 'pending' | 'approved' | 'rejected';
}

const mockNominees: Nominee[] = [
    { id: 1, name: 'Dr. Amara Johnson', award: 'Best Community Leader', category: 'Leadership', votes: 1245, status: 'approved' },
    { id: 2, name: 'Michael Okonkwo', award: 'Youth Excellence Award', category: 'Youth', votes: 987, status: 'approved' },
    { id: 3, name: 'Grace Mensah', award: 'Cultural Ambassador', category: 'Culture', votes: 756, status: 'pending' },
    { id: 4, name: 'David Kamau', award: 'Innovation Champion', category: 'Technology', votes: 654, status: 'approved' },
    { id: 5, name: 'Fatima Hassan', award: 'Youth Excellence Award', category: 'Youth', votes: 432, status: 'rejected' },
];

export default function NomineesPage() {
    const [nominees] = useState<Nominee[]>(mockNominees);
    const [showModal, setShowModal] = useState(false);

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="status-badge status-active">Approved</span>;
            case 'pending':
                return <span className="status-badge status-upcoming">Pending</span>;
            case 'rejected':
                return <span className="status-badge status-draft">Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Nominees</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage award nominees and voting</p>
                </div>
                <button className="btn-primary-responsive" onClick={() => setShowModal(true)}>
                    <PlusIcon />
                    Add Nominee
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">⭐</div>
                    <div className="stat-value-responsive">456</div>
                    <div className="stat-label-responsive">Total Nominees</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">389</div>
                    <div className="stat-label-responsive">Approved</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⏳</div>
                    <div className="stat-value-responsive">52</div>
                    <div className="stat-label-responsive">Pending</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">🗳️</div>
                    <div className="stat-value-responsive">125,678</div>
                    <div className="stat-label-responsive">Total Votes</div>
                </div>
            </div>

            {/* Nominees Table */}
            <DataTable<Nominee>
                data={nominees}
                columns={[
                    { key: 'name', header: 'Nominee Name' },
                    { key: 'award', header: 'Award' },
                    { key: 'category', header: 'Category' },
                    { 
                        key: 'votes', 
                        header: 'Votes',
                        render: (nominee) => nominee.votes.toLocaleString()
                    },
                    { 
                        key: 'status', 
                        header: 'Status',
                        render: (nominee) => getStatusBadge(nominee.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (nominee) => (
                            <div className="action-buttons">
                                <button className="action-btn" title="Approve">
                                    <CheckIcon />
                                </button>
                                <button className="action-btn" title="Edit">
                                    <EditIcon />
                                </button>
                                <button className="action-btn" title="Delete">
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<Nominee>[]}
                keyExtractor={(nominee) => nominee.id}
                title="All Nominees"
                totalCount={nominees.length}
                emptyIcon="⭐"
                emptyTitle="No nominees found"
                emptyDescription="Add your first nominee to get started"
            />

            {/* Add Nominee Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Add New Nominee</h2>
                            <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828] text-2xl" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nomineeName" className="font-sans text-sm font-semibold text-[#374151]">Nominee Name</label>
                                <input type="text" id="nomineeName" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" placeholder="Enter nominee name" />
                            </div>
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="award" className="font-sans text-sm font-semibold text-[#374151]">Award</label>
                                    <select id="award" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10">
                                        <option value="">Select award</option>
                                        <option value="1">Best Community Leader</option>
                                        <option value="2">Youth Excellence Award</option>
                                        <option value="3">Cultural Ambassador</option>
                                        <option value="4">Innovation Champion</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="status" className="font-sans text-sm font-semibold text-[#374151]">Status</label>
                                    <select id="status" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10">
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="bio" className="font-sans text-sm font-semibold text-[#374151]">Nominee Bio</label>
                                <textarea id="bio" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-none" placeholder="Enter nominee biography..." rows={4}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] -mx-6 max-sm:-mx-4 -mb-6 max-sm:-mb-4 mt-2">
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8]">Add Nominee</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
