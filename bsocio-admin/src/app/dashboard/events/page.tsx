"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { PlusIcon, EditIcon, DeleteIcon } from '@/components/ui/admin-icons';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useEventStatistics } from '@/hooks';
import type { Event, CreateEventRequest, UpdateEventRequest, EventStatus, EventVisibility, EventFilters } from '@/types';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

// Helper to format date for display
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Helper to format date for input
const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

// Determine status based on event date
const getEventStatus = (eventDate: string): 'upcoming' | 'ongoing' | 'past' => {
    const date = new Date(eventDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (eventDay > today) return 'upcoming';
    if (eventDay.getTime() === today.getTime()) return 'ongoing';
    return 'past';
};

export default function EventsPage() {
    // UI State
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');

    // Build filters with pagination
    const filters: EventFilters = useMemo(() => ({
        filter: filterStatus,
        skip: currentPage * PAGE_SIZE,
        take: PAGE_SIZE,
    }), [filterStatus, currentPage]);

    // API Hooks - server-side pagination
    const { events, total: totalEvents, isLoading, isError, refetch } = useEvents(filters);
    const { data: statistics, isLoading: statsLoading } = useEventStatistics();
    const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();
    const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();
    const { mutateAsync: deleteEvent, isPending: isDeleting } = useDeleteEvent();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        venue: '',
        eventDate: '',
        eventTime: '',
        description: '',
        maxAttendees: '',
        status: 'DRAFT' as EventStatus,
        visibility: 'PUBLIC' as EventVisibility,
    });

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal || showDeleteModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showModal, showDeleteModal]);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(0);
    }, [filterStatus]);

    // Server-side pagination
    const totalPages = Math.ceil(totalEvents / PAGE_SIZE);

    // Stats calculations
    const upcomingCount = statistics?.upcomingEvents || 0;
    const totalAttendees = statistics?.totalAttendees || 0;

    const getStatusBadge = (eventDate: string, publishStatus: EventStatus) => {
        if (publishStatus === 'DRAFT') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5E7EB] text-[#6B7280]">Draft</span>;
        }
        const status = getEventStatus(eventDate);
        switch (status) {
            case 'upcoming':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#166534]">Upcoming</span>;
            case 'ongoing':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E]">Ongoing</span>;
            case 'past':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5E7EB] text-[#6B7280]">Past</span>;
            default:
                return null;
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            venue: '',
            eventDate: '',
            eventTime: '',
            description: '',
            maxAttendees: '',
            status: 'DRAFT',
            visibility: 'PUBLIC',
        });
        setEditingEvent(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            venue: event.venue,
            eventDate: formatDateForInput(event.eventDate),
            eventTime: event.eventTime || '',
            description: event.description || '',
            maxAttendees: event.maxAttendees?.toString() || '',
            status: event.status,
            visibility: event.visibility,
        });
        setShowModal(true);
    };

    const openDeleteModal = (event: Event) => {
        setDeletingEvent(event);
        setShowDeleteModal(true);
    };

    const handleSubmit = async () => {
        try {
            const payload: CreateEventRequest | UpdateEventRequest = {
                title: formData.title,
                venue: formData.venue,
                eventDate: formData.eventDate,
                eventTime: formData.eventTime || undefined,
                description: formData.description || undefined,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
                status: formData.status,
                visibility: formData.visibility,
            };

            if (editingEvent) {
                await updateEvent({ id: editingEvent.id, data: payload as UpdateEventRequest });
            } else {
                await createEvent(payload as CreateEventRequest);
            }

            setShowModal(false);
            resetForm();
            refetch();
        } catch (error) {
            console.error('Failed to save event:', error);
        }
    };

    const handleDelete = async () => {
        if (!deletingEvent) return;
        try {
            await deleteEvent(deletingEvent.id);
            setShowDeleteModal(false);
            setDeletingEvent(null);
            refetch();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    // Show error state if API failed
    if (isError) {
        return (
            <div className="page-content w-full">
                <div className="error-state-container">
                    <span className="error-state-icon">⚠️</span>
                    <h3 className="error-state-title">Failed to load events</h3>
                    <p className="error-state-message">There was an error loading the events. Please try again.</p>
                    <button className="btn-primary-responsive" onClick={refetch}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            {/* Section Header */}
            <div className="page-header-row">
                <div className="flex flex-col gap-1">
                    <h1 className="page-main-title">Events</h1>
                    <p className="font-sans text-base text-[#6B7280] m-0">Create and manage platform events</p>
                </div>
                <button className="btn-primary-responsive" onClick={openCreateModal}>
                    <PlusIcon />
                    Create Event
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-4">
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">🎉</div>
                    <div className="stat-value-responsive">{statsLoading ? '...' : totalEvents}</div>
                    <div className="stat-label-responsive">Total Events</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#10B981]">📅</div>
                    <div className="stat-value-responsive">{statsLoading ? '...' : upcomingCount}</div>
                    <div className="stat-label-responsive">Upcoming</div>
                </div>
                <div className="stat-card-responsive">
                    <div className="stat-icon-responsive text-[#2563EB]">👥</div>
                    <div className="stat-value-responsive">{statsLoading ? '...' : totalAttendees.toLocaleString()}</div>
                    <div className="stat-label-responsive">Total Attendees</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button 
                    className={cn(
                        "filter-tab",
                        filterStatus === 'all' && "active"
                    )}
                    onClick={() => { setFilterStatus('all'); setCurrentPage(0); }}
                >
                    All Events
                </button>
                <button 
                    className={cn(
                        "filter-tab",
                        filterStatus === 'upcoming' && "active"
                    )}
                    onClick={() => { setFilterStatus('upcoming'); setCurrentPage(0); }}
                >
                    Upcoming
                </button>
                <button 
                    className={cn(
                        "filter-tab",
                        filterStatus === 'past' && "active"
                    )}
                    onClick={() => { setFilterStatus('past'); setCurrentPage(0); }}
                >
                    Past
                </button>
            </div>

            {/* Events Table */}
            <DataTable<Event>
                data={events}
                columns={[
                    { 
                        key: 'title', 
                        header: 'Event Name',
                        width: '25%',
                        render: (event) => (
                            <div>
                                <strong>{event.title}</strong>
                                {event.visibility === 'PRIVATE' && (
                                    <span className="text-xs text-[#6B7280] ml-2">🔒</span>
                                )}
                            </div>
                        )
                    },
                    { key: 'venue', header: 'Venue', width: '20%' },
                    { 
                        key: 'eventDate', 
                        header: 'Date',
                        width: '15%',
                        render: (event) => (
                            <div>
                                {formatDate(event.eventDate)}
                                {event.eventTime && <span className="text-xs text-[#6B7280] block">{event.eventTime}</span>}
                            </div>
                        )
                    },
                    { 
                        key: 'attendees', 
                        header: 'Attendees',
                        width: '15%',
                        render: (event) => (
                            <div>
                                {event.currentAttendees.toLocaleString()}
                                {event.maxAttendees && (
                                    <span className="text-xs text-[#6B7280]"> / {event.maxAttendees.toLocaleString()}</span>
                                )}
                            </div>
                        )
                    },
                    { 
                        key: 'status', 
                        header: 'Status',
                        width: '12%',
                        render: (event) => getStatusBadge(event.eventDate, event.status)
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        width: '13%',
                        render: (event) => (
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-transparent border border-[#E5E7EB] cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" title="Edit" onClick={() => openEditModal(event)}>
                                    <EditIcon />
                                </button>
                                <button className="p-2 rounded-lg bg-transparent border border-[#E5E7EB] cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" title="Delete" onClick={() => openDeleteModal(event)}>
                                    <DeleteIcon />
                                </button>
                            </div>
                        )
                    }
                ] as DataTableColumn<Event>[]}
                keyExtractor={(event) => event.id}
                isLoading={isLoading}
                title="All Events"
                totalCount={totalEvents}
                emptyIcon="🎉"
                emptyTitle="No events found"
                emptyDescription="Create your first event to get started"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Create/Edit Event Modal */}
            {showModal && typeof window !== 'undefined' && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-sm:p-3" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-white rounded-2xl max-sm:rounded-xl w-full max-w-[560px] max-sm:max-w-[95vw] max-h-[90vh] overflow-auto shadow-xl">
                        <div className="flex justify-between items-center p-6 max-sm:p-4 border-b border-[#E5E7EB] pr-14 max-sm:pr-12 relative">
                            <h2 className="font-sans text-xl max-sm:text-lg font-bold text-[#101828] m-0">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                            <button className="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-900 transition-colors" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
                        </div>
                        <div className="p-6 max-sm:p-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="eventTitle" className="font-sans text-sm font-semibold text-[#374151]">Event Name *</label>
                                <input 
                                    type="text" 
                                    id="eventTitle" 
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" 
                                    placeholder="Enter event name"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="venue" className="font-sans text-sm font-semibold text-[#374151]">Venue *</label>
                                    <input 
                                        type="text" 
                                        id="venue" 
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" 
                                        placeholder="Enter venue"
                                        value={formData.venue}
                                        onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="eventDate" className="font-sans text-sm font-semibold text-[#374151]">Date *</label>
                                    <input 
                                        type="date" 
                                        id="eventDate" 
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="eventTime" className="font-sans text-sm font-semibold text-[#374151]">Time</label>
                                    <input 
                                        type="time" 
                                        id="eventTime" 
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]"
                                        value={formData.eventTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="maxAttendees" className="font-sans text-sm font-semibold text-[#374151]">Max Attendees</label>
                                    <input 
                                        type="number" 
                                        id="maxAttendees" 
                                        className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF]" 
                                        placeholder="Optional"
                                        value={formData.maxAttendees}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="status" className="font-sans text-sm font-semibold text-[#374151]">Status</label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as EventStatus }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="PUBLISHED">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="visibility" className="font-sans text-sm font-semibold text-[#374151]">Visibility</label>
                                    <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value as EventVisibility }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select visibility" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PUBLIC">Public</SelectItem>
                                            <SelectItem value="PRIVATE">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <label htmlFor="description" className="font-sans text-sm font-semibold text-[#374151]">Description</label>
                                <textarea 
                                    id="description" 
                                    className="py-3 px-4 font-sans text-sm text-[#101828] bg-white border border-[#D1D5DB] rounded-lg transition-all duration-200 w-full focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/10 placeholder:text-[#9CA3AF] resize-none" 
                                    placeholder="Describe the event..." 
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 max-sm:gap-2 p-6 max-sm:p-4 border-t border-[#E5E7EB] -mx-6 max-sm:-mx-4 -mb-6 max-sm:-mb-4 mt-6">
                                <button className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6]" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                <button 
                                    className="py-2.5 px-5 max-sm:text-xs max-sm:py-2 max-sm:px-4 font-sans text-sm font-semibold text-white bg-[#2563EB] border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed" 
                                    onClick={handleSubmit}
                                    disabled={isCreating || isUpdating || !formData.title || !formData.venue || !formData.eventDate}
                                >
                                    {isCreating || isUpdating ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingEvent && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    title="Delete Event"
                    message={`Are you sure you want to delete "${deletingEvent.title}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeletingEvent(null);
                    }}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
}
