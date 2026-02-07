/**
 * SetupWizard Component
 * 
 * 6-step guided setup for first-time users:
 * 1. Welcome
 * 2. Center Information
 * 3. Gmail Connection
 * 4. Email Templates
 * 5. Add First Client
 * 6. Test & Complete
 */

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Mail, 
  Building, 
  FileText, 
  Rocket, 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink,
  UserPlus,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';


interface SetupStep {
  id: number;
  title: string;
  icon: React.ElementType;
  description: string;
}

const STEPS: SetupStep[] = [
  { id: 1, title: 'Welcome', icon: Rocket, description: 'Get started with your automation system' },
  { id: 2, title: 'Center Info', icon: Building, description: 'Tell us about your organization' },
  { id: 3, title: 'Gmail Setup', icon: Mail, description: 'Connect your email account' },
  { id: 4, title: 'Templates', icon: FileText, description: 'Customize your emails' },
  { id: 5, title: 'First Client', icon: UserPlus, description: 'Add your first client' },
  { id: 6, title: 'Complete', icon: CheckCircle, description: 'Test and finish setup' },
];

// Default email templates
const DEFAULT_TEMPLATES = {
  welcome: {
    subject: 'Welcome to {{center_name}} - Your Appointment is Confirmed',
    body: `Hi {{client_first_name}},

Thank you for reaching out to {{center_name}}. We've received your intake and your appointment is confirmed.

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

If you need to reschedule, please call us at {{center_phone}} or reply to this email.

We look forward to seeing you!

{{staff_signature}}`
  },
  reminder: {
    subject: 'Reminder: Your Appointment Tomorrow at {{center_name}}',
    body: `Hi {{client_first_name}},

This is a friendly reminder about your appointment tomorrow:

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

Need to reschedule? Call {{center_phone}} or reply to this email.

See you tomorrow!

{{staff_signature}}`
  },
  no_show: {
    subject: 'We Missed You Today - Can We Reschedule?',
    body: `Hi {{client_first_name}},

We missed you at your appointment today. We understand that things come up!

Would you like to reschedule? We're here to help and would love to connect with you.

Please call {{center_phone}} or reply to this email to find a time that works better.

{{staff_signature}}`
  },
  re_engagement: {
    subject: 'Checking In - {{center_name}}',
    body: `Hi {{client_first_name}},

We wanted to check in and see how you're doing. We know life gets busy, but we're still here to support you.

If you'd like to schedule a new appointment, just reply to this email or call {{center_phone}}.

Take care,

{{staff_signature}}`
  }
};

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    centerName: '',
    centerAddress: '',
    centerPhone: '',
    staffName: '',
    staffSignature: '',
    gmailConnected: false,
    templatesReviewed: false,
  });
  
  // Templates
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  
  // First client
  const [firstClient, setFirstClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    intake_date: new Date().toISOString().split('T')[0],
    appointment_date: '',
    notes: ''
  });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  
  // Test email
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('setup_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || formData);
        setTemplates(parsed.templates || templates);
        setFirstClient(parsed.firstClient || firstClient);
      } catch (e) {
        console.error('Failed to load saved progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('setup_progress', JSON.stringify({
      formData,
      templates,
      firstClient,
      currentStep
    }));
  }, [formData, templates, firstClient, currentStep]);

  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 2: // Center Info
        if (!formData.centerName.trim()) {
          setError('Please enter your center name');
          return false;
        }
        if (!formData.centerAddress.trim()) {
          setError('Please enter your center address');
          return false;
        }
        if (!formData.centerPhone.trim()) {
          setError('Please enter your center phone number');
          return false;
        }
        if (!formData.staffName.trim()) {
          setError('Please enter your name');
          return false;
        }
        return true;
        
      case 3: // Gmail
        if (!formData.gmailConnected) {
          setError('Please connect your Gmail account to continue');
          return false;
        }
        return true;
        
      case 5: // First Client
        const errors: Record<string, string> = {};
        if (!firstClient.first_name.trim()) errors.first_name = 'First name is required';
        if (!firstClient.last_name.trim()) errors.last_name = 'Last name is required';
        if (!firstClient.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(firstClient.email)) {
          errors.email = 'Please enter a valid email';
        }
        if (!firstClient.intake_date) errors.intake_date = 'Intake date is required';
        
        if (Object.keys(errors).length > 0) {
          setClientErrors(errors);
          setError('Please fill in all required fields');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      window.scrollTo(0, 0);
    }
  };

  const handleGmailConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Open Gmail OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        `${API_URL}/api/gmail/auth`,
        'gmailOAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth completion
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'GMAIL_CONNECTED') {
          setFormData({ ...formData, gmailConnected: true });
          setSuccessMessage('Gmail connected successfully!');
          setTimeout(() => setSuccessMessage(null), 3000);
          popup?.close();
          window.removeEventListener('message', messageHandler);
        }
        if (event.data.type === 'GMAIL_ERROR') {
          setError('Failed to connect Gmail. Please try again.');
          window.removeEventListener('message', messageHandler);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Timeout after 2 minutes
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        if (!formData.gmailConnected) {
          setIsLoading(false);
        }
      }, 120000);
      
    } catch (err) {
      setError('Failed to open Gmail connection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = (type: string, subject: string, body: string) => {
    setTemplates({
      ...templates,
      [type]: { subject, body }
    });
    setEditingTemplate(null);
    setSuccessMessage('Template saved!');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const getPreviewContent = (type: string) => {
    const template = templates[type as keyof typeof templates];
    const sampleData = {
      client_first_name: 'Maria',
      appointment_date: 'February 15, 2024',
      appointment_time: '2:00 PM',
      center_name: formData.centerName || 'Your Center',
      center_address: formData.centerAddress || '123 Main St',
      center_phone: formData.centerPhone || '(555) 123-4567',
      staff_signature: formData.staffSignature || formData.staffName || 'Staff'
    };
    
    let body = template.body;
    Object.entries(sampleData).forEach(([key, value]) => {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return { subject: template.subject, body };
  };

  const handleSaveFirstClient = async () => {
    if (!validateStep(5)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...firstClient,
          status: 'confirmed'
        })
      });
      
      if (response.ok) {
        setSuccessMessage('First client added successfully!');
        setTimeout(() => {
          setSuccessMessage(null);
          handleNext();
        }, 1500);
      } else {
        throw new Error('Failed to save client');
      }
    } catch (err) {
      setError('Failed to save client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmailAddress)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          template: 'welcome',
          center_info: {
            center_name: formData.centerName,
            center_address: formData.centerAddress,
            center_phone: formData.centerPhone,
            staff_name: formData.staffName,
            staff_signature: formData.staffSignature
          }
        })
      });
      
      if (response.ok) {
        setTestEmailSent(true);
        setSuccessMessage('Test email sent! Check your inbox.');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (err) {
      setError('Failed to send test email. Please check your Gmail connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save all settings
      const settingsResponse = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center_name: formData.centerName,
          center_address: formData.centerAddress,
          center_phone: formData.centerPhone,
          staff_name: formData.staffName,
          staff_signature: formData.staffSignature,
          gmail_connected: formData.gmailConnected,
          templates: templates
        })
      });
      
      if (!settingsResponse.ok) {
        throw new Error('Failed to save settings');
      }
      
      // Mark setup as complete
      await fetch(`${API_URL}/api/setup/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Clear saved progress
      localStorage.removeItem('setup_progress');
      
      // Call onComplete callback
      onComplete();
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
      setIsLoading(false);
    }
  };

  const CurrentIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-light text-[#252422] mb-2">
            Setup Wizard
          </h1>
          <p className="text-[#252422]/60 text-sm sm:text-base">
            Let's get your automation system running
          </p>
        </div>

        {/* Progress Bar - Mobile Optimized */}
        <div className="mb-6">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                    step.id <= currentStep
                      ? 'bg-[#E6511A] text-white'
                      : 'bg-white text-[#252422]/40 border-2 border-[#252422]/10'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                      step.id < currentStep ? 'bg-[#E6511A]' : 'bg-[#252422]/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={`${
                  step.id <= currentStep ? 'text-[#E6511A]' : 'text-[#252422]/40'
                } ${step.id === currentStep ? 'font-medium' : ''}`}
              >
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E6511A]/10 flex items-center justify-center flex-shrink-0">
              <CurrentIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E6511A]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-[#252422]">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-sm text-[#252422]/60">
                {STEPS[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-[#E6511A]/5 rounded-xl p-6 border border-[#E6511A]/10">
                <p className="text-[#252422]/80 leading-relaxed mb-4">
                  Welcome to your client follow-up automation system! This wizard will guide you through:
                </p>
                <ul className="space-y-3">
                  {[
                    'Setting up your center information',
                    'Connecting your Gmail account',
                    'Customizing email templates',
                    'Adding your first client',
                    'Testing the system',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E6511A] flex-shrink-0" />
                      <span className="text-[#252422]/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-[#252422] mb-1">Time required</p>
                  <p className="text-[#252422]/60">About 5-10 minutes</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-[#252422] mb-1">What you need</p>
                  <p className="text-[#252422]/60">Gmail account, center info</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Your progress is automatically saved. You can close this window and return anytime.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Center Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.centerName}
                  onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                  placeholder="e.g., Cleveland LGBTQ Center"
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Center Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.centerAddress}
                  onChange={(e) => setFormData({ ...formData, centerAddress: e.target.value })}
                  placeholder="e.g., 6705 Detroit Avenue, Cleveland, OH 44102"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Center Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.centerPhone}
                  onChange={(e) => setFormData({ ...formData, centerPhone: e.target.value })}
                  placeholder="e.g., (216) 651-5428"
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Your Name (appears in emails) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.staffName}
                  onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                  placeholder="e.g., Sarah"
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Email Signature <span className="text-[#252422]/40">(optional)</span>
                </label>
                <textarea
                  value={formData.staffSignature}
                  onChange={(e) => setFormData({ ...formData, staffSignature: e.target.value })}
                  placeholder={`e.g., Best regards,\nSarah Johnson\nProgram Coordinator\nCleveland LGBTQ Center`}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none resize-none"
                />
                <p className="text-xs text-[#252422]/50 mt-1">
                  This will appear at the end of all automated emails
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Gmail Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <p className="text-[#252422]/80">
                Connect your Gmail account to send automated follow-up emails. 
                The system will send emails on your behalf using your account.
              </p>

              {formData.gmailConnected ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Gmail Connected!</p>
                      <p className="text-sm text-green-600">Your email account is ready to send automated messages.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleGmailConnect}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#252422]/10 hover:border-[#E6511A] text-[#252422] px-6 py-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                    {isLoading ? 'Connecting...' : 'Connect Gmail Account'}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-[#252422]/50 text-center">
                    You'll be redirected to Google to authorize access
                  </p>
                </div>
              )}

              <div className="bg-[#f5f5f5] rounded-xl p-4 space-y-2">
                <p className="text-sm text-[#252422]/70">
                  <strong>Privacy note:</strong> We only send emails you explicitly schedule. 
                  We never access your inbox or read your emails.
                </p>
                <p className="text-sm text-[#252422]/70">
                  <strong>Security:</strong> Your credentials are encrypted and stored securely.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Email Templates */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <p className="text-[#252422]/80">
                We've created default email templates for you. Review and customize them below, 
                or keep the defaults — they work great for most centers.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Welcome & Confirmation', type: 'welcome', desc: 'Sent immediately after intake' },
                  { name: 'Appointment Reminder', type: 'reminder', desc: 'Sent the day before appointment' },
                  { name: 'No-Show Follow-up', type: 'no_show', desc: 'Sent if client misses appointment' },
                  { name: 'Re-engagement', type: 're_engagement', desc: 'Sent 7 days after missed appointment' },
                ].map((template) => (
                  <div key={template.type} className="bg-[#f5f5f5] rounded-xl p-4">
                    {editingTemplate === template.type ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          defaultValue={templates[template.type as keyof typeof templates].subject}
                          className="w-full px-3 py-2 rounded-lg border border-[#252422]/10 text-sm font-medium"
                          placeholder="Subject line"
                          id={`subject-${template.type}`}
                        />
                        <textarea
                          defaultValue={templates[template.type as keyof typeof templates].body}
                          rows={6}
                          className="w-full px-3 py-2 rounded-lg border border-[#252422]/10 text-sm font-mono resize-none"
                          placeholder="Email body"
                          id={`body-${template.type}`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const subject = (document.getElementById(`subject-${template.type}`) as HTMLInputElement).value;
                              const body = (document.getElementById(`body-${template.type}`) as HTMLTextAreaElement).value;
                              handleSaveTemplate(template.type, subject, body);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#E6511A] text-white rounded-lg text-sm"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTemplate(null)}
                            className="px-3 py-1.5 text-[#252422]/60 hover:text-[#252422] text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#252422]">{template.name}</p>
                          <p className="text-sm text-[#252422]/60">{template.desc}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPreviewTemplate(previewTemplate === template.type ? null : template.type)}
                            className="flex items-center gap-1 text-[#E6511A] text-sm hover:underline px-2 py-1"
                          >
                            {previewTemplate === template.type ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {previewTemplate === template.type ? 'Hide' : 'Preview'}
                          </button>
                          <button
                            onClick={() => setEditingTemplate(template.type)}
                            className="text-[#E6511A] text-sm hover:underline px-2 py-1"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {previewTemplate === template.type && editingTemplate !== template.type && (
                      <div className="mt-4 bg-white rounded-lg p-4 border border-[#252422]/10">
                        <p className="text-xs text-[#252422]/40 uppercase tracking-wide mb-2">Preview</p>
                        <p className="font-medium text-sm mb-2">
                          Subject: {getPreviewContent(template.type).subject}
                        </p>
                        <pre className="text-sm text-[#252422]/80 whitespace-pre-wrap font-sans">
                          {getPreviewContent(template.type).body}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.templatesReviewed}
                  onChange={(e) => setFormData({ ...formData, templatesReviewed: e.target.checked })}
                  className="w-5 h-5 rounded border-[#252422]/20 text-[#E6511A] focus:ring-[#E6511A]"
                />
                <span className="text-[#252422]/80">
                  I've reviewed the email templates
                </span>
              </label>
            </div>
          )}

          {/* Step 5: First Client */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-[#252422]/80">
                Add your first client to test the system. You can use a test email address (like your own) for now.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstClient.first_name}
                    onChange={(e) => {
                      setFirstClient({ ...firstClient, first_name: e.target.value });
                      setClientErrors({ ...clientErrors, first_name: '' });
                    }}
                    placeholder="e.g., Maria"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#E6511A]/20 outline-none ${
                      clientErrors.first_name ? 'border-red-300' : 'border-[#252422]/10 focus:border-[#E6511A]'
                    }`}
                  />
                  {clientErrors.first_name && (
                    <p className="text-red-600 text-xs mt-1">{clientErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstClient.last_name}
                    onChange={(e) => {
                      setFirstClient({ ...firstClient, last_name: e.target.value });
                      setClientErrors({ ...clientErrors, last_name: '' });
                    }}
                    placeholder="e.g., Garcia"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#E6511A]/20 outline-none ${
                      clientErrors.last_name ? 'border-red-300' : 'border-[#252422]/10 focus:border-[#E6511A]'
                    }`}
                  />
                  {clientErrors.last_name && (
                    <p className="text-red-600 text-xs mt-1">{clientErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={firstClient.email}
                  onChange={(e) => {
                    setFirstClient({ ...firstClient, email: e.target.value });
                    setClientErrors({ ...clientErrors, email: '' });
                  }}
                  placeholder="e.g., test@example.com"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#E6511A]/20 outline-none ${
                    clientErrors.email ? 'border-red-300' : 'border-[#252422]/10 focus:border-[#E6511A]'
                  }`}
                />
                {clientErrors.email && (
                  <p className="text-red-600 text-xs mt-1">{clientErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Phone <span className="text-[#252422]/40">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={firstClient.phone}
                  onChange={(e) => setFirstClient({ ...firstClient, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-2">
                    Intake Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={firstClient.intake_date}
                    onChange={(e) => {
                      setFirstClient({ ...firstClient, intake_date: e.target.value });
                      setClientErrors({ ...clientErrors, intake_date: '' });
                    }}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#E6511A]/20 outline-none ${
                      clientErrors.intake_date ? 'border-red-300' : 'border-[#252422]/10 focus:border-[#E6511A]'
                    }`}
                  />
                  {clientErrors.intake_date && (
                    <p className="text-red-600 text-xs mt-1">{clientErrors.intake_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252422] mb-2">
                    Appointment Date <span className="text-[#252422]/40">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={firstClient.appointment_date}
                    onChange={(e) => setFirstClient({ ...firstClient, appointment_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#252422] mb-2">
                  Notes <span className="text-[#252422]/40">(optional)</span>
                </label>
                <textarea
                  value={firstClient.notes}
                  onChange={(e) => setFirstClient({ ...firstClient, notes: e.target.value })}
                  placeholder="Any additional notes about the client..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Use your own email address for testing! This way you'll receive the welcome email and can see exactly what clients will receive.
                </p>
              </div>

              <button
                onClick={handleSaveFirstClient}
                disabled={isLoading}
                className="w-full bg-[#E6511A] hover:bg-[#c9440f] text-white px-6 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Add First Client
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 6: Complete */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <p className="text-[#252422]/80">
                You're almost done! Send a test email to make sure everything is working correctly.
              </p>

              {!testEmailSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#252422] mb-2">
                      Send test email to:
                    </label>
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="your-email@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-[#252422]/10 focus:border-[#E6511A] focus:ring-2 focus:ring-[#E6511A]/20 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleTestEmail}
                    disabled={isLoading}
                    className="w-full bg-[#E6511A] hover:bg-[#c9440f] text-white px-6 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Test Email
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Test Email Sent!</p>
                      <p className="text-sm text-green-600">Check {testEmailAddress} for the test message.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-[#252422]/10 pt-6">
                <h3 className="font-medium text-[#252422] mb-3">Setup Summary</h3>
                <ul className="space-y-2 text-sm text-[#252422]/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Center: {formData.centerName}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Gmail: {formData.gmailConnected ? 'Connected' : 'Not connected'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Templates: {formData.templatesReviewed ? 'Customized' : 'Using defaults'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    First client: {firstClient.first_name} {firstClient.last_name}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="w-full bg-[#252422] hover:bg-[#1a1918] text-white px-6 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing Setup...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Setup & Go to Dashboard
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#252422]/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 text-[#252422]/60 hover:text-[#252422] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {currentStep < 5 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#E6511A] hover:bg-[#c9440f] text-white px-4 sm:px-6 py-3 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#252422]/50">
            Need help? {' '}
            <a href="tel:216-200-7861" className="text-[#E6511A] hover:underline">
              Call 216-200-7861
            </a>
            {' '}or{' '}
            <a href="mailto:hello@alignment-ai.io" className="text-[#E6511A] hover:underline">
              email us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
