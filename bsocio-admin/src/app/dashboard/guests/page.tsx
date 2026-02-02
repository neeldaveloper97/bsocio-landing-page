"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';

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
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Guests</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Manage event guests and VIPs</p>
                </div>
                <button className="btn-primary-responsive" onClick={() => setShowModal(true)}>
                    <PlusIcon />
                    Add Guest
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">👥</div>
                    <div className="stat-value-responsive">156</div>
                    <div className="stat-label-responsive">Total Guests</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">✅</div>
                    <div className="stat-value-responsive">124</div>
                    <div className="stat-label-responsive">Confirmed</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#F59E0B]">⏳</div>
                    <div className="stat-value-responsive">32</div>
                    <div className="stat-label-responsive">Pending</div>
                </div>
            </div>

            {/* Guests Table */}
            <DataTable<Guest>
                data={guests}
                columns={[
                    { key: 'name', header: 'Guest Name' },
                    { key: 'title', header: 'Title' },
                    { key: 'event', header: 'Event' },
                    { key: 'email', header: 'Email' },
                    { 
                        key: 'status', 
                        header: 'Status',
                        render: (guest) => getStatusBadge(guest.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        align: 'center',
                        render: (guest) => (
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
                ] as DataTableColumn<Guest>[]}
                keyExtractor={(guest) => guest.id}
                title="All Guests"
                totalCount={guests.length}
                emptyIcon="👥"
                emptyTitle="No guests found"
                emptyDescription="Add your first guest to get started"
            />

            {/* Add Guest Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center max-sm:items-end justify-center p-4 max-sm:p-0" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-white rounded-xl max-sm:rounded-b-none w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB]">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">Add New Guest</h2>
                            <button className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#101828] text-2xl" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4 flex flex-col gap-4">
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="guestName" className="font-sans text-sm font-semibold text-[#374151]">Guest Name</label>
                                    <input type="text" id="guestName" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" placeholder="Enter guest name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="title" className="font-sans text-sm font-semibold text-[#374151]">Title/Position</label>
                                    <input type="text" id="title" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" placeholder="Enter title" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="event" className="font-sans text-sm font-semibold text-[#374151]">Event</label>
                                    <select id="event" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10">
                                        <option value="">Select event</option>
                                        <option value="1">Annual Cultural Festival</option>
                                        <option value="2">Community Leadership Summit</option>
                                        <option value="3">Youth Empowerment Workshop</option>
                                        <option value="4">Heritage Month Gala</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="font-sans text-sm font-semibold text-[#374151]">Email</label>
                                    <input type="email" id="email" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" placeholder="Enter email" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="notes" className="font-sans text-sm font-semibold text-[#374151]">Notes</label>
                                <textarea id="notes" className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-none" placeholder="Additional notes..." rows={3}></textarea>
                            </div>
                            <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] -mx-6 max-sm:-mx-4 -mb-6 max-sm:-mb-4 mt-2">
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8]">Add Guest</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
