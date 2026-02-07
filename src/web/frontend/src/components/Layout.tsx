import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X,
  Heart,
  HelpCircle,
  Phone,
  Mail,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  centerName?: string;
  currentPage?: 'dashboard' | 'clients' | 'templates' | 'settings';
  onNavigate?: (page: 'dashboard' | 'clients' | 'templates' | 'settings') => void;
}

type NavItem = {
  label: string;
  icon: React.ReactNode;
  id: 'dashboard' | 'clients' | 'templates' | 'settings';
};

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { label: 'Clients', icon: <Users size={20} />, id: 'clients' },
  { label: 'Templates', icon: <FileText size={20} />, id: 'templates' },
  { label: 'Settings', icon: <Settings size={20} />, id: 'settings' },
];

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  centerName = 'Hope Community Center',
  currentPage = 'dashboard',
  onNavigate
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavClick = (id: 'dashboard' | 'clients' | 'templates' | 'settings') => {
    onNavigate?.(id);
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E6511A] focus:text-white focus:rounded-xl"
      >
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
        aria-label="Main navigation"
      >
        {/* Logo/Center Name */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E6511A] rounded-xl flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="font-light text-lg text-[#252422] leading-tight truncate">
                {centerName}
              </h1>
              <p className="text-xs text-gray-500">Client Follow-Up</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" aria-label="Sidebar navigation">
          <ul className="space-y-1" role="menubar">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} role="none">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-colors duration-200 text-left
                      ${isActive 
                        ? 'bg-[#E6511A]/10 text-[#E6511A]' 
                        : 'text-[#252422] hover:bg-gray-100'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={isActive ? 'text-[#E6511A]' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    <span className="font-light">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#252422] hover:bg-gray-100 transition-colors text-left"
            aria-expanded={showHelp}
            aria-controls="help-panel"
          >
            <HelpCircle size={20} className="text-gray-500" />
            <span className="font-light">Help & Support</span>
          </button>
          
          {showHelp && (
            <div 
              id="help-panel"
              className="mt-3 px-4 py-3 bg-gray-50 rounded-xl text-sm"
            >
              <p className="text-gray-600 mb-3">
                Need help with the system?
              </p>
              <div className="space-y-2">
                <a 
                  href="tel:216-200-7861" 
                  className="flex items-center gap-2 text-[#E6511A] hover:underline"
                >
                  <Phone size={14} />
                  216-200-7861
                </a>
                <a 
                  href="mailto:hello@alignment-ai.io" 
                  className="flex items-center gap-2 text-[#E6511A] hover:underline"
                >
                  <Mail size={14} />
                  hello@alignment-ai.io
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Nonprofit Client Automation
          </p>
          <p className="text-xs text-gray-300 text-center mt-1">
            v1.0.0
          </p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
                aria-controls="sidebar-navigation"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="font-light text-xl text-[#252422] hidden sm:block">
                {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block truncate max-w-[200px]">
                {centerName}
              </span>
              <div className="w-8 h-8 bg-[#E6511A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#E6511A] text-sm font-medium">
                  {centerName.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
