import { useState, useEffect } from 'react';
import { Layout, Dashboard, ClientList, ClientForm, Settings, Templates, ClientDetail } from './components';
import { SetupWizard } from './components/setup/SetupWizard';
import { Client, DashboardStats, CenterSettings, EmailTemplate } from './components/types';

// Environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
      role="alert"
      aria-live="polite"
    >
      <span className={type === 'success' ? 'text-green-600' : 'text-red-600'}>
        {type === 'success' ? '✓' : '✗'}
      </span>
      <p className={type === 'success' ? 'text-green-800' : 'text-red-800'}>{message}</p>
      <button 
        onClick={onClose} 
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#E6511A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#252422]/60">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clients' | 'templates' | 'settings'>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<CenterSettings | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check if setup is complete
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.center_name && data.gmail_connected) {
          setIsSetupComplete(true);
          setSettings(data);
          loadDashboardData();
        } else {
          setIsSetupComplete(false);
        }
      } else {
        setIsSetupComplete(false);
      }
    } catch (error) {
      console.error('Failed to check setup status:', error);
      setIsSetupComplete(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [clientsRes, statsRes, templatesRes] = await Promise.all([
        fetch(`${API_URL}/api/clients`),
        fetch(`${API_URL}/api/dashboard`),
        fetch(`${API_URL}/api/templates`).catch(() => null)
      ]);
      
      if (clientsRes.ok && statsRes.ok) {
        const clientsData = await clientsRes.json();
        const statsData = await statsRes.json();
        
        setClients(clientsData.clients || []);
        setStats(statsData);
        
        if (templatesRes?.ok) {
          const templatesData = await templatesRes.json();
          setTemplates(templatesData.templates || []);
        }
      } else {
        showError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showError('Failed to connect to server');
    }
    setLoading(false);
  };

  const showSuccess = (message: string) => {
    setToast({ message, type: 'success' });
  };

  const showError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  const handleAddClient = async (clientData: Partial<Client>) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      
      if (res.ok) {
        setShowClientForm(false);
        await loadDashboardData();
        showSuccess('Client added successfully!');
        setCurrentPage('clients');
      } else {
        const error = await res.json();
        showError(error.message || 'Failed to add client');
      }
    } catch (error) {
      console.error('Failed to add client:', error);
      showError('Failed to add client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (clientData: Partial<Client>) => {
    if (!editingClient) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      
      if (res.ok) {
        setShowClientForm(false);
        setEditingClient(null);
        await loadDashboardData();
        showSuccess('Client updated successfully!');
      } else {
        const error = await res.json();
        showError(error.message || 'Failed to update client');
      }
    } catch (error) {
      console.error('Failed to update client:', error);
      showError('Failed to update client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await loadDashboardData();
        showSuccess('Client deleted successfully');
      } else {
        showError('Failed to delete client');
      }
    } catch (error) {
      console.error('Failed to delete client:', error);
      showError('Failed to delete client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    showSuccess('Setup completed successfully!');
    loadDashboardData();
  };

  const handleSaveSettings = async (newSettings: CenterSettings) => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (res.ok) {
        setSettings(newSettings);
        showSuccess('Settings saved successfully!');
      } else {
        showError('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showError('Failed to save settings. Please try again.');
    }
  };

  const handleSaveTemplates = async (newTemplates: EmailTemplate[]) => {
    try {
      const res = await fetch(`${API_URL}/api/templates`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: newTemplates })
      });
      
      if (res.ok) {
        setTemplates(newTemplates);
        showSuccess('Templates saved successfully!');
      } else {
        showError('Failed to save templates');
      }
    } catch (error) {
      console.error('Failed to save templates:', error);
      showError('Failed to save templates. Please try again.');
    }
  };

  const handleConnectGmail = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${API_URL}/api/gmail/auth`,
      'gmailOAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === 'GMAIL_CONNECTED') {
        setSettings(prev => prev ? { ...prev, gmail_connected: true } : null);
        showSuccess('Gmail connected successfully!');
        popup?.close();
        window.removeEventListener('message', messageHandler);
      }
      if (event.data.type === 'GMAIL_ERROR') {
        showError('Failed to connect Gmail. Please try again.');
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
  };

  const handleDisconnectGmail = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail? Automated emails will stop working.')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/gmail/disconnect`, { method: 'POST' });
      if (res.ok) {
        setSettings(prev => prev ? { ...prev, gmail_connected: false } : null);
        showSuccess('Gmail disconnected');
      }
    } catch (error) {
      showError('Failed to disconnect Gmail');
    }
  };

  if (isSetupComplete === null) {
    return <LoadingSpinner />;
  }

  if (!isSetupComplete) {
    return (
      <>
        <SetupWizard onComplete={handleSetupComplete} />
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <Layout
        centerName={settings?.center_name || 'Your Center'}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      >
        {currentPage === 'dashboard' && (
          <Dashboard
            stats={stats || {
              total_clients: clients.length,
              appointments_this_week: 0,
              pending_follow_ups: 0,
              no_shows_this_month: 0
            }}
            recentClients={clients.slice(0, 5)}
            scheduledEmails={[]}
            onAddClient={() => {
              setEditingClient(null);
              setShowClientForm(true);
            }}
            onViewClient={(clientId) => {
              const client = clients.find(c => c.id === clientId);
              if (client) setViewingClient(client);
            }}
            onViewAllClients={() => setCurrentPage('clients')}
            loading={loading}
          />
        )}

        {currentPage === 'clients' && (
          <ClientList
            clients={clients}
            onAdd={() => {
              setEditingClient(null);
              setShowClientForm(true);
            }}
            onEdit={(client) => {
              setEditingClient(client);
              setShowClientForm(true);
            }}
            onDelete={handleDeleteClient}
            loading={loading}
          />
        )}

        {currentPage === 'templates' && (
          <Templates
            templates={templates}
            onSave={handleSaveTemplates}
            centerInfo={settings || undefined}
            loading={loading}
          />
        )}

        {currentPage === 'settings' && (
          <Settings
            settings={settings || {
              center_name: '',
              center_address: '',
              center_phone: '',
              staff_name: '',
              staff_signature: '',
              gmail_connected: false
            }}
            onSave={handleSaveSettings}
            onConnectGmail={handleConnectGmail}
            onDisconnectGmail={handleDisconnectGmail}
          />
        )}

        {showClientForm && (
          <ClientForm
            client={editingClient}
            onSubmit={editingClient ? handleEditClient : handleAddClient}
            onCancel={() => {
              setShowClientForm(false);
              setEditingClient(null);
            }}
            isEditing={!!editingClient}
          />
        )}

        {viewingClient && (
          <ClientDetail
            client={viewingClient}
            onClose={() => setViewingClient(null)}
            onEdit={(client) => {
              setEditingClient(client);
              setShowClientForm(true);
              setViewingClient(null);
            }}
            onDelete={(id) => {
              handleDeleteClient(id);
              setViewingClient(null);
            }}
          />
        )}
      </Layout>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}

export default App;
