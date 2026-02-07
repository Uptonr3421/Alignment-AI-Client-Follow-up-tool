import { useState } from 'react';
import './App.css';

// Placeholder for desktop app
function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div className="app">
      <header className="header">
        <h1>Cleveland LGBTQ Center</h1>
        <p>Client Follow-Up Automation</p>
      </header>

      <nav className="nav">
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('clients')}>Clients</button>
        <button onClick={() => setView('templates')}>Templates</button>
        <button onClick={() => setView('settings')}>Settings</button>
      </nav>

      <main className="main">
        {view === 'dashboard' && (
          <div className="page">
            <h1>Dashboard</h1>
            <p>Welcome to Cleveland LGBTQ Center Client Follow-Up Automation</p>
            <p>Desktop App - Running locally on your computer</p>
          </div>
        )}
        {view === 'clients' && (
          <div className="page">
            <h1>Clients</h1>
            <p>Manage your clients here</p>
          </div>
        )}
        {view === 'templates' && (
          <div className="page">
            <h1>Email Templates</h1>
            <p>Customize your email templates</p>
          </div>
        )}
        {view === 'settings' && (
          <div className="page">
            <h1>Settings</h1>
            <p>Configure your system settings</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with ❤️ by Alignment AI for Cleveland LGBTQ Center</p>
      </footer>
    </div>
  );
}

export default App;
