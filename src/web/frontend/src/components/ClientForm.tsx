import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, FileText, Save } from 'lucide-react';
import { Client } from './types';

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (clientData: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const statusOptions = [
  { value: 'intake', label: 'Intake' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'reminded', label: 'Reminded' },
  { value: 'no_show', label: 'No Show' },
  { value: 'rescheduled', label: 'Rescheduled' },
  { value: 'completed', label: 'Completed' }
];

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    intake_date: '',
    appointment_date: '',
    status: 'intake' as Client['status'],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone || '',
        intake_date: client.intake_date,
        appointment_date: client.appointment_date || '',
        status: client.status,
        notes: client.notes || ''
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.intake_date) {
      newErrors.intake_date = 'Intake date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || undefined,
        intake_date: formData.intake_date,
        appointment_date: formData.appointment_date || undefined,
        status: formData.status,
        notes: formData.notes || undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 id="client-form-title" className="font-light text-2xl text-[#252422]">
            {isEditing ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                    errors.first_name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                  }`}
                  placeholder="Enter first name"
                  aria-invalid={errors.first_name ? 'true' : 'false'}
                  aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                />
              </div>
              {errors.first_name && (
                <p id="first_name-error" className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                    errors.last_name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                  }`}
                  placeholder="Enter last name"
                  aria-invalid={errors.last_name ? 'true' : 'false'}
                  aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                />
              </div>
              {errors.last_name && (
                <p id="last_name-error" className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                  }`}
                  placeholder="Enter email address"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-gray-400 font-light">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="intake_date" className="block text-sm font-medium text-gray-700 mb-2">
                Intake Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  id="intake_date"
                  name="intake_date"
                  value={formData.intake_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                    errors.intake_date ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                  }`}
                  aria-invalid={errors.intake_date ? 'true' : 'false'}
                  aria-describedby={errors.intake_date ? 'intake_date-error' : undefined}
                />
              </div>
              {errors.intake_date && (
                <p id="intake_date-error" className="mt-1 text-sm text-red-600">{errors.intake_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date <span className="text-gray-400 font-light">(optional)</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes <span className="text-gray-400 font-light">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors resize-none"
                placeholder="Add any additional notes about the client..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-xl text-[#252422] font-light hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#E6511A] text-white rounded-xl font-light hover:bg-[#d14815] transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isEditing ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
