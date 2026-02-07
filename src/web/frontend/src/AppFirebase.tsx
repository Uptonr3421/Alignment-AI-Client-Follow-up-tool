import { useState, useEffect } from 'react';
import { Layout, Dashboard, ClientList, ClientForm, Settings, Templates, ClientDetail, BuildingThisTool } from './components';
import { SetupWizard } from './components/setup/SetupWizard';
import { Auth } from './components/Auth';
import { useFirebaseAuth } from './hooks/useFirebase';
import { api } from './hooks/useApi';
import { Client, DashboardStats, CenterSettings, EmailTemplate } from './components/types';

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
  const { user, loading: authLoading, isAuthenticated } = useFirebaseAuth();
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clients' | 'templates' | 'settings' | 'building'>('dashboard');
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
    if (isAuthenticated) {
      checkSetupStatus();
    }
  }, [isAuthenticated]);

  const checkSetupStatus = async () => {
    try {
      const response = await api.getSettings();
      const data = response.data;
      
      if (data.centerName && data.gmailConnected) {
        setIsSetupComplete(true);
        setSettings(data);
        loadDashboardData();
      } else {
        setIsSetupComplete(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to check setup status:', error);
      setIsSetupComplete(false);
      setLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [clientsRes, statsRes, templatesRes] = await Promise.all([
        api.getClients(),
        api.getDashboard(),
        api.getTemplates().catch(() => null)
      ]);
      
      setClients(clientsRes.data?.clients || []);
      setStats(statsRes.data);
      
      if (templatesRes?.data?.templates) {
        setTemplates(templatesRes.data.templates);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showError('Failed to load dashboard data');
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
      await api.createClient(clientData);
      
      setShowClientForm(false);
      await loadDashboardData();
      showSuccess('Client added successfully!');
      setCurrentPage('clients');
    } catch (error: any) {
      console.error('Failed to add client:', error);
      showError(error.message || 'Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (clientData: Partial<Client>) => {
    if (!editingClient) return;
    
    try {
      setLoading(true);
      await api.updateClient(editingClient.id, clientData);
      
      setShowClientForm(false);
      setEditingClient(null);
      await loadDashboardData();
      showSuccess('Client updated successfully!');
    } catch (error: any) {
      console.error('Failed to update client:', error);
      showError(error.message || 'Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      setLoading(true);
      await api.deleteClient(id);
      
      await loadDashboardData();
      showSuccess('Client deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete client:', error);
      showError(error.message || 'Failed to delete client');
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
      await api.updateSettings(newSettings);
      setSettings(newSettings);
      showSuccess('Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      showError(error.message || 'Failed to save settings');
    }
  };

  const handleSaveTemplates = async (newTemplates: EmailTemplate[]) => {
    try {
      await api.updateTemplates(newTemplates);
      setTemplates(newTemplates);
      showSuccess('Templates saved successfully!');
    } catch (error: any) {
      console.error('Failed to save templates:', error);
      showError(error.message || 'Failed to save templates');
    }
  };

  const handleConnectGmail = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const API_URL = import.meta.env.VITE_API_URL || 'https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api';
    
    const popup = window.open(
      `${API_URL}/gmail/auth`,
      'gmailOAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === 'GMAIL_CONNECTED') {
        setSettings(prev => prev ? { ...prev, gmailConnected: true } : null);
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
      await api.disconnectGmail();
      setSettings(prev => prev ? { ...prev, gmailConnected: false } : null);
      showSuccess('Gmail disconnected');
    } catch (error: any) {
      showError(error.message || 'Failed to disconnect Gmail');
    }
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

  if (authLoading || isSetupComplete === null) {
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
        centerName={settings?.centerName || 'Your Center'}
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

        {currentPage === 'building' && (
          <BuildingThisTool />
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
