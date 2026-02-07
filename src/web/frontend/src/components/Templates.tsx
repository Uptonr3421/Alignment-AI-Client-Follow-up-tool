import React, { useState } from 'react';
import { 
  Edit2, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
  subject: string;
  body: string;
  description: string;
  when_sent: string;
}

interface TemplatesProps {
  templates?: Template[];
  onSave?: (templates: Template[]) => void;
  centerInfo?: {
    center_name: string;
    center_address: string;
    center_phone: string;
    staff_name: string;
    staff_signature: string;
  };
  loading?: boolean;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome & Confirmation',
    type: 'welcome',
    subject: 'Welcome to {{center_name}} - Your Appointment is Confirmed',
    body: `Hi {{client_first_name}},

Thank you for reaching out to {{center_name}}. We've received your intake and your appointment is confirmed.

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

If you need to reschedule, please call us at {{center_phone}} or reply to this email.

We look forward to seeing you!

{{staff_signature}}`,
    description: 'Sent immediately after a new client is added',
    when_sent: 'Immediately after intake'
  },
  {
    id: 'reminder',
    name: 'Appointment Reminder',
    type: 'reminder',
    subject: 'Reminder: Your Appointment Tomorrow at {{center_name}}',
    body: `Hi {{client_first_name}},

This is a friendly reminder about your appointment tomorrow:

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

Need to reschedule? Call {{center_phone}} or reply to this email.

See you tomorrow!

{{staff_signature}}`,
    description: 'Sent the day before the scheduled appointment',
    when_sent: '24 hours before appointment'
  },
  {
    id: 'no_show',
    name: 'No-Show Follow-up',
    type: 'no_show',
    subject: 'We Missed You Today - Can We Reschedule?',
    body: `Hi {{client_first_name}},

We missed you at your appointment today. We understand that things come up!

Would you like to reschedule? We're here to help and would love to connect with you.

Please call {{center_phone}} or reply to this email to find a time that works better.

{{staff_signature}}`,
    description: 'Sent when a client misses their appointment',
    when_sent: 'Same day as missed appointment'
  },
  {
    id: 're_engagement',
    name: 'Re-engagement',
    type: 're_engagement',
    subject: 'Checking In - {{center_name}}',
    body: `Hi {{client_first_name}},

We wanted to check in and see how you're doing. We know life gets busy, but we're still here to support you.

If you'd like to schedule a new appointment, just reply to this email or call {{center_phone}}.

Take care,

{{staff_signature}}`,
    description: 'Sent to re-engage clients who missed appointments',
    when_sent: '7 days after no-show'
  }
];

const VARIABLES = [
  { name: '{{client_first_name}}', description: 'Client\'s first name' },
  { name: '{{appointment_date}}', description: 'Formatted appointment date' },
  { name: '{{appointment_time}}', description: 'Formatted appointment time' },
  { name: '{{center_name}}', description: 'Your center name' },
  { name: '{{center_address}}', description: 'Your center address' },
  { name: '{{center_phone}}', description: 'Your center phone number' },
  { name: '{{staff_signature}}', description: 'Your email signature' },
];

export const Templates: React.FC<TemplatesProps> = ({
  templates: initialTemplates,
  onSave,
  centerInfo,
  loading = false
}) => {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates || DEFAULT_TEMPLATES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ subject: string; body: string }>({ subject: '', body: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setEditForm({ subject: template.subject, body: template.body });
    setPreviewId(null);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ subject: '', body: '' });
    setSaveMessage(null);
  };

  const handleSave = async (templateId: string) => {
    setIsSaving(true);
    setSaveMessage(null);
    
    const updatedTemplates = templates.map(t => 
      t.id === templateId 
        ? { ...t, subject: editForm.subject, body: editForm.body }
        : t
    );
    
    setTemplates(updatedTemplates);
    
    try {
      await onSave?.(updatedTemplates);
      setSaveMessage({ type: 'success', text: 'Template saved successfully!' });
      setTimeout(() => {
        setEditingId(null);
        setSaveMessage(null);
      }, 1500);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save template. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (templateId: string) => {
    const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === templateId);
    if (defaultTemplate) {
      setEditForm({ subject: defaultTemplate.subject, body: defaultTemplate.body });
    }
  };

  const getPreviewContent = (template: Template): { subject: string; body: string } => {
    const sampleData = {
      client_first_name: 'Maria',
      appointment_date: 'February 15, 2024',
      appointment_time: '2:00 PM',
      center_name: centerInfo?.center_name || 'Your Center',
      center_address: centerInfo?.center_address || '123 Main St, City, ST 12345',
      center_phone: centerInfo?.center_phone || '(555) 123-4567',
      staff_signature: centerInfo?.staff_signature || centerInfo?.staff_name || 'Staff'
    };

    let subject = template.subject;
    let body = template.body;
    
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    });

    return { subject, body };
  };

  const togglePreview = (templateId: string) => {
    setPreviewId(previewId === templateId ? null : templateId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-light text-2xl sm:text-3xl text-[#252422]">
            Email Templates
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your automated email communications
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#E6511A] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading templates...</p>
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
            Email Templates
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your automated email communications
          </p>
        </div>
      </div>

      {/* Variables Help */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-[#252422] mb-2">Template Variables</h3>
            <p className="text-sm text-[#252422]/70 mb-3">
              Use these variables in your templates. They will be automatically replaced with actual client and center information.
            </p>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map((variable) => (
                <code 
                  key={variable.name}
                  className="px-2 py-1 bg-white rounded text-xs text-[#E6511A] font-mono border border-blue-200"
                  title={variable.description}
                >
                  {variable.name}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => {
          const isEditing = editingId === template.id;
          const isPreview = previewId === template.id;
          const preview = getPreviewContent(template);

          return (
            <div 
              key={template.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Template Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E6511A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="text-[#E6511A]" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-[#252422]">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{template.when_sent}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePreview(template.id)}
                        className="flex items-center gap-2 px-4 py-2 text-[#E6511A] hover:bg-[#E6511A]/5 rounded-lg transition-colors"
                      >
                        {isPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                        {isPreview ? 'Hide Preview' : 'Preview'}
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#E6511A] text-white hover:bg-[#d14815] rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="p-6 bg-gray-50">
                  {saveMessage && (
                    <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${
                      saveMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      {saveMessage.type === 'success' ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <AlertCircle className="text-red-600" size={20} />
                      )}
                      <p className={saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {saveMessage.text}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A]"
                        placeholder="Email subject line..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Body
                      </label>
                      <textarea
                        value={editForm.body}
                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6511A]/20 focus:border-[#E6511A] font-mono text-sm resize-none"
                        placeholder="Email body..."
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-200 text-[#252422] rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReset(template.id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <RotateCcw size={18} />
                        Reset to Default
                      </button>
                      <button
                        onClick={() => handleSave(template.id)}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E6511A] text-white rounded-xl hover:bg-[#d14815] transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {isPreview && !isEditing && (
                <div className="p-6 bg-gray-50">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Subject</p>
                    <p className="text-[#252422] font-medium mb-6">{preview.subject}</p>
                    
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Body</p>
                    <pre className="text-[#252422]/80 whitespace-pre-wrap font-sans text-sm">
                      {preview.body}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper component for the clock icon
const ClockIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Templates;
