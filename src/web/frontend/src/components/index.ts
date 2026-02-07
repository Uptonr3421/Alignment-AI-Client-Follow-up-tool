// Component exports for the nonprofit client follow-up automation system

export { Layout } from './Layout';
export { Dashboard } from './Dashboard';
export { ClientList } from './ClientList';
export { ClientForm } from './ClientForm';
export { ClientDetail } from './ClientDetail';
export { Settings } from './Settings';
export { Templates } from './Templates';
export { DeleteConfirmModal } from './DeleteConfirmModal';
export { Auth } from './Auth';

// Types
export type { 
  Client, 
  DashboardStats, 
  CenterInfo, 
  ScheduledEmail 
} from './types';

// Mock data for development
export { 
  mockClients, 
  mockDashboardStats, 
  mockCenterInfo, 
  mockScheduledEmails 
} from './mockData';
