import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Loader2,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import { Client } from './types';
import { ClientDetail } from './ClientDetail';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ClientListProps {
  clients?: Client[];
  onAdd?: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
  loading?: boolean;
}

const statusConfig = {
  intake: { label: 'Intake', bg: 'bg-blue-100', text: 'text-blue-700' },
  confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700' },
  reminded: { label: 'Reminded', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  no_show: { label: 'No Show', bg: 'bg-red-100', text: 'text-red-700' },
  rescheduled: { label: 'Rescheduled', bg: 'bg-purple-100', text: 'text-purple-700' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-700' }
};

const ITEMS_PER_PAGE = 10;

// Mock email history for demo
const mockEmailHistory = [
  {
    id: '1',
    template_name: 'Welcome & Confirmation',
    subject: 'Welcome to Hope Community Center',
    sent_at: '2024-02-01T10:30:00',
    status: 'delivered' as const
  },
  {
    id: '2',
    template_name: 'Appointment Reminder',
    subject: 'Reminder: Your Appointment Tomorrow',
    sent_at: '2024-02-14T09:00:00',
    status: 'opened' as const
  }
];

export const ClientList: React.FC<ClientListProps> = ({
  clients = [],
  onAdd,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery));
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenMenuId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    setDeletingId(clientToDelete.id);
    try {
      await onDelete?.(clientToDelete.id);
    } finally {
      setDeletingId(null);
      setDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
    setOpenMenuId(null);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
              Clients
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your client follow-ups
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#E6511A] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
            Clients
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track your client follow-ups
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#E6511A] text-white px-5 py-3 rounded-xl font-light hover:bg-[#d14815] transition-colors shadow-lg"
          aria-label="Add new client"
        >
          <UserPlus size={20} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Empty State - No Clients At All */}
      {clients.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-[#E6511A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-10 h-10 text-[#E6511A]" />
          </div>
          <h2 className="text-xl font-light text-[#252422] mb-2">No Clients Yet</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by adding your first client. Once added, they'll appear here and you can track their follow-up status.
          </p>
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 bg-[#E6511A] text-white px-6 py-3 rounded-xl font-light hover:bg-[#d14815] transition-colors"
          >
            <UserPlus size={20} />
            <span>Add Your First Client</span>
          </button>
        </div>
      )}

      {/* Filters and Table - Only show if there are clients */}
      {clients.length > 0 && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors"
                  aria-label="Search clients"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* Status Filter */}
              <div className="relative sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors appearance-none bg-white cursor-pointer"
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="intake">Intake</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="reminded">Reminded</option>
                  <option value="no_show">No Show</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Active filters indicator */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-gray-900">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                    Status: {statusConfig[statusFilter as keyof typeof statusConfig]?.label || statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-gray-900">
                      <X size={14} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#E6511A] hover:underline ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Client Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Client list">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Intake Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Appointment
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <AlertCircle size={48} className="mx-auto mb-4" />
                          <p className="font-light text-lg">No clients found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          <button
                            onClick={clearFilters}
                            className="mt-4 text-[#E6511A] hover:underline text-sm"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => {
                      const status = statusConfig[client.status];
                      const isDeleting = deletingId === client.id;
                      return (
                        <tr 
                          key={client.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleViewClient(client)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#E6511A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-[#E6511A] font-light">
                                  {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-[#252422]">
                                  {client.first_name} {client.last_name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-[#252422]">{client.email}</p>
                              {client.phone && (
                                <p className="text-gray-500 hidden sm:block">{client.phone}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="text-sm text-[#252422]">
                              {formatDate(client.intake_date)}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-sm text-[#252422]">
                              {formatDate(client.appointment_date)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative" ref={openMenuId === client.id ? menuRef : null}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === client.id ? null : client.id);
                                }}
                                disabled={isDeleting}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                aria-label={`Actions for ${client.first_name} ${client.last_name}`}
                                aria-expanded={openMenuId === client.id}
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                ) : (
                                  <MoreVertical size={18} className="text-gray-500" />
                                )}
                              </button>
                              
                              {openMenuId === client.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewClient(client);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#252422] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit?.(client);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#252422] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Edit2 size={16} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(client);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} of {filteredClients.length} clients
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-[#E6511A] text-white'
                          : 'border border-gray-200 hover:bg-gray-50 text-[#252422]'
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Client Detail Modal */}
      {viewingClient && (
        <ClientDetail
          client={viewingClient}
          onClose={() => setViewingClient(null)}
          onEdit={(client) => {
            onEdit?.(client);
            setViewingClient(null);
          }}
          onDelete={(id) => {
            onDelete?.(id);
            setViewingClient(null);
          }}
          emailHistory={mockEmailHistory}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Client"
        message="Are you sure you want to delete this client? All their data and email history will be permanently removed. This action cannot be undone."
        itemName={clientToDelete ? `${clientToDelete.first_name} ${clientToDelete.last_name}` : undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setClientToDelete(null);
        }}
        isDeleting={!!deletingId}
      />
    </div>
  );
};

export default ClientList;
