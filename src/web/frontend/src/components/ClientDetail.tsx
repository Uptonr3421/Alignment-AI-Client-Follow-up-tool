import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Edit2, 
  Trash2, 
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Client } from './types';

interface EmailHistoryItem {
  id: string;
  template_name: string;
  subject: string;
  sent_at: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed';
}

interface ClientDetailProps {
  client: Client;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  emailHistory?: EmailHistoryItem[];
  loading?: boolean;
}

const statusConfig = {
  intake: { label: 'Intake', bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle },
  confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  reminded: { label: 'Reminded', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  no_show: { label: 'No Show', bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  rescheduled: { label: 'Rescheduled', bg: 'bg-purple-100', text: 'text-purple-700', icon: Calendar },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle }
};

const emailStatusConfig = {
  sent: { label: 'Sent', color: 'text-blue-600', bg: 'bg-blue-50' },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
  opened: { label: 'Opened', color: 'text-purple-600', bg: 'bg-purple-50' },
  failed: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-50' }
};

export const ClientDetail: React.FC<ClientDetailProps> = ({
  client,
  onClose,
  onEdit,
  onDelete,
  emailHistory = [],
  loading = false
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    closeButtonRef.current?.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const status = statusConfig[client.status];
  const StatusIcon = status.icon;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${client.first_name} ${client.last_name}? This action cannot be undone.`)) {
      onDelete(client.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-detail-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#E6511A]/10 rounded-full flex items-center justify-center">
              <span className="text-[#E6511A] font-light text-xl">
                {client.first_name.charAt(0)}{client.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 id="client-detail-title" className="font-light text-2xl text-[#252422]">
                {client.first_name} {client.last_name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </span>
                <span className="text-sm text-gray-500">
                  Client since {formatDate(client.intake_date)}
                </span>
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close client details"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#E6511A] animate-spin" />
              <span className="ml-3 text-gray-600">Loading client details...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Contact Information */}
              <section aria-labelledby="contact-info-heading">
                <h3 id="contact-info-heading" className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#E6511A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-[#E6511A]" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <a 
                        href={`mailto:${client.email}`} 
                        className="text-sm text-[#252422] hover:text-[#E6511A] truncate block"
                      >
                        {client.email}
                      </a>
                    </div>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#E6511A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="text-[#E6511A]" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a 
                          href={`tel:${client.phone}`} 
                          className="text-sm text-[#252422] hover:text-[#E6511A]"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Appointment Details */}
              <section aria-labelledby="appointment-heading">
                <h3 id="appointment-heading" className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Intake Date</p>
                      <p className="text-sm text-[#252422]">{formatDate(client.intake_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Appointment Date</p>
                      <p className="text-sm text-[#252422]">
                        {client.appointment_date ? formatDate(client.appointment_date) : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notes */}
              {client.notes && (
                <section aria-labelledby="notes-heading">
                  <h3 id="notes-heading" className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Notes
                  </h3>
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <div className="flex items-start gap-3">
                      <FileText className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-[#252422]/80 whitespace-pre-wrap">{client.notes}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Email History */}
              <section aria-labelledby="email-history-heading">
                <h3 id="email-history-heading" className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Email History
                </h3>
                {emailHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-light">No emails sent yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Automated emails will appear here when sent
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emailHistory.map((email) => {
                      const emailStatus = emailStatusConfig[email.status];
                      return (
                        <div 
                          key={email.id}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${emailStatus.bg}`}>
                            <Mail className={emailStatus.color} size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-[#252422] truncate">{email.template_name}</p>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${emailStatus.bg} ${emailStatus.color}`}>
                                {emailStatus.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{email.subject}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDateTime(email.sent_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 flex-shrink-0">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Delete Client
          </button>
          <div className="flex-1"></div>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 text-[#252422] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(client);
              onClose();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E6511A] text-white rounded-xl hover:bg-[#d14815] transition-colors"
          >
            <Edit2 size={18} />
            Edit Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
