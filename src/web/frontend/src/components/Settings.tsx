import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Save, 
  Mail,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { CenterSettings } from './types';

interface SettingsProps {
  settings: CenterSettings;
  onSave: (settings: CenterSettings) => void;
  onConnectGmail?: () => void;
  onDisconnectGmail?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSave,
  onConnectGmail,
  onDisconnectGmail
}) => {
  const [formData, setFormData] = useState<CenterSettings>({
    center_name: '',
    center_address: '',
    center_phone: '',
    staff_name: '',
    staff_signature: '',
    gmail_connected: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSavedMessage(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.center_name?.trim()) {
      newErrors.center_name = 'Center name is required';
    }
    if (!formData.center_address?.trim()) {
      newErrors.center_address = 'Center address is required';
    }
    if (!formData.center_phone?.trim()) {
      newErrors.center_phone = 'Center phone is required';
    }
    if (!formData.staff_name?.trim()) {
      newErrors.staff_name = 'Staff name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSaving(true);
      await onSave(formData);
      setSavedMessage('Settings saved successfully!');
      setIsSaving(false);
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure your center information and email settings
        </p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div 
          className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          role="alert"
        >
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-green-800">{savedMessage}</p>
        </div>
      )}

      {/* Center Information Form */}
      <section 
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        aria-labelledby="center-info-heading"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 id="center-info-heading" className="font-light text-xl text-[#252422]">
            Center Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This information will be used in your email templates and communications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Center Name */}
          <div>
            <label htmlFor="center_name" className="block text-sm font-medium text-gray-700 mb-2">
              Center Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="center_name"
                name="center_name"
                value={formData.center_name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                  errors.center_name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                }`}
                placeholder="e.g., Hope Community Center"
                aria-invalid={errors.center_name ? 'true' : 'false'}
                aria-describedby={errors.center_name ? 'center_name-error' : undefined}
              />
            </div>
            {errors.center_name && (
              <p id="center_name-error" className="mt-1 text-sm text-red-600">{errors.center_name}</p>
            )}
          </div>

          {/* Center Address */}
          <div>
            <label htmlFor="center_address" className="block text-sm font-medium text-gray-700 mb-2">
              Center Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="center_address"
                name="center_address"
                value={formData.center_address}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                  errors.center_address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                }`}
                placeholder="e.g., 123 Main Street, City, ST 12345"
                aria-invalid={errors.center_address ? 'true' : 'false'}
                aria-describedby={errors.center_address ? 'center_address-error' : undefined}
              />
            </div>
            {errors.center_address && (
              <p id="center_address-error" className="mt-1 text-sm text-red-600">{errors.center_address}</p>
            )}
          </div>

          {/* Center Phone */}
          <div>
            <label htmlFor="center_phone" className="block text-sm font-medium text-gray-700 mb-2">
              Center Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                id="center_phone"
                name="center_phone"
                value={formData.center_phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                  errors.center_phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                }`}
                placeholder="e.g., (555) 123-4567"
                aria-invalid={errors.center_phone ? 'true' : 'false'}
                aria-describedby={errors.center_phone ? 'center_phone-error' : undefined}
              />
            </div>
            {errors.center_phone && (
              <p id="center_phone-error" className="mt-1 text-sm text-red-600">{errors.center_phone}</p>
            )}
          </div>

          {/* Staff Name */}
          <div>
            <label htmlFor="staff_name" className="block text-sm font-medium text-gray-700 mb-2">
              Staff Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="staff_name"
                name="staff_name"
                value={formData.staff_name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 transition-colors ${
                  errors.staff_name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#E6511A]'
                }`}
                placeholder="e.g., Amanda Thompson"
                aria-invalid={errors.staff_name ? 'true' : 'false'}
                aria-describedby={errors.staff_name ? 'staff_name-error' : undefined}
              />
            </div>
            {errors.staff_name && (
              <p id="staff_name-error" className="mt-1 text-sm text-red-600">{errors.staff_name}</p>
            )}
          </div>

          {/* Staff Signature */}
          <div>
            <label htmlFor="staff_signature" className="block text-sm font-medium text-gray-700 mb-2">
              Staff Signature <span className="text-gray-400 font-light">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                id="staff_signature"
                name="staff_signature"
                value={formData.staff_signature}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] transition-colors resize-none"
                placeholder={`e.g., Best regards,\nAmanda Thompson\nCase Manager\nHope Community Center`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This signature will be automatically added to the end of your emails
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 bg-[#E6511A] text-white px-6 py-3 rounded-xl font-light hover:bg-[#d14815] transition-colors shadow-lg disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </section>

      {/* Gmail Connection */}
      <section 
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        aria-labelledby="gmail-connection-heading"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 id="gmail-connection-heading" className="font-light text-xl text-[#252422]">
            Email Integration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Connect your Gmail account to send automated follow-up emails
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                formData.gmail_connected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Mail className={formData.gmail_connected ? 'text-green-600' : 'text-gray-500'} size={24} />
              </div>
              <div>
                <h3 className="font-medium text-[#252422]">Gmail Connection</h3>
                <div className="flex items-center gap-2 mt-1">
                  {formData.gmail_connected ? (
                    <>
                      <CheckCircle2 className="text-green-600" size={16} />
                      <span className="text-sm text-green-700">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-500">Not connected</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.gmail_connected 
                    ? 'Your Gmail account is connected. Automated emails will be sent from your account.'
                    : 'Connect your Gmail account to enable automated email follow-ups to clients.'
                  }
                </p>
              </div>
            </div>

            <button
              onClick={formData.gmail_connected ? onDisconnectGmail : onConnectGmail}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-light transition-colors whitespace-nowrap ${
                formData.gmail_connected
                  ? 'border border-gray-200 text-[#252422] hover:bg-gray-50'
                  : 'bg-[#E6511A] text-white hover:bg-[#d14815] shadow-lg'
              }`}
            >
              {formData.gmail_connected ? (
                <>
                  <XCircle size={18} />
                  Disconnect
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  Connect Gmail
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-medium text-[#252422] mb-2">Need Help?</h3>
        <p className="text-sm text-[#252422]/70 mb-4">
          If you're having trouble with setup or have questions, we're here to help.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a 
            href="tel:216-200-7861" 
            className="flex items-center gap-2 text-[#E6511A] hover:underline"
          >
            <Phone size={16} />
            216-200-7861
          </a>
          <a 
            href="mailto:hello@alignment-ai.io" 
            className="flex items-center gap-2 text-[#E6511A] hover:underline"
          >
            <Mail size={16} />
            hello@alignment-ai.io
          </a>
        </div>
      </section>
    </div>
  );
};

export default Settings;
