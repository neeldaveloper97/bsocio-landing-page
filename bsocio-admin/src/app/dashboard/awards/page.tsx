"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';

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
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Awards</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage award categories and nominations</p>
                </div>
                <button className="btn-primary-responsive" onClick={() => setShowModal(true)}>
                    <PlusIcon />
                    Create Award
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">🏆</div>
                    <div className="stat-value-responsive">24</div>
                    <div className="stat-label-responsive">Total Awards</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">8</div>
                    <div className="stat-label-responsive">Active</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⭐</div>
                    <div className="stat-value-responsive">456</div>
                    <div className="stat-label-responsive">Total Nominees</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#EF4444]">🎖️</div>
                    <div className="stat-value-responsive">89</div>
                    <div className="stat-label-responsive">Past Winners</div>
                </div>
            </div>

            {/* Awards Table */}
            <DataTable<Award>
                data={awards}
                columns={[
                    { key: 'name', header: 'Award Name' },
                    { key: 'category', header: 'Category' },
                    { key: 'year', header: 'Year' },
                    { key: 'nominees', header: 'Nominees' },
                    { 
                        key: 'status', 
                        header: 'Status',
                        render: (award) => getStatusBadge(award.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (award) => (
                            <div className="action-buttons">
                                <button className="action-btn" title="Edit">
                                    <EditIcon />
                                </button>
                                <button className="action-btn" title="Delete">
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<Award>[]}
                keyExtractor={(award) => award.id}
                title="All Awards"
                totalCount={awards.length}
                emptyIcon="🏆"
                emptyTitle="No awards found"
                emptyDescription="Create your first award to get started"
            />

            {/* Create Award Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Create New Award</h2>
                            <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828] text-2xl" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="awardName" className="font-sans text-sm font-semibold text-[#374151]">Award Name</label>
                                <input type="text" id="awardName" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" placeholder="Enter award name" />
                            </div>
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="category" className="font-sans text-sm font-semibold text-[#374151]">Category</label>
                                    <select id="category" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10">
                                        <option value="">Select category</option>
                                        <option value="leadership">Leadership</option>
                                        <option value="culture">Culture</option>
                                        <option value="youth">Youth Development</option>
                                        <option value="technology">Technology</option>
                                        <option value="heritage">Heritage</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="year" className="font-sans text-sm font-semibold text-[#374151]">Year</label>
                                    <select id="year" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10">
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="criteria" className="font-sans text-sm font-semibold text-[#374151]">Award Criteria</label>
                                <textarea id="criteria" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-none" placeholder="Describe the award criteria..." rows={4}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] -mx-6 max-sm:-mx-4 -mb-6 max-sm:-mb-4 mt-2">
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8]">Create Award</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
