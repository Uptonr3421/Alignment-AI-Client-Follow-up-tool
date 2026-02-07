import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components (to be implemented)
const Dashboard = () => (
  <div className="page">
    <h1>Dashboard</h1>
    <p>Welcome to Cleveland LGBTQ Center Client Follow-Up Automation</p>
  </div>
);

const Clients = () => (
  <div className="page">
    <h1>Clients</h1>
    <p>Manage your clients here</p>
  </div>
);

const Templates = () => (
  <div className="page">
    <h1>Email Templates</h1>
    <p>Customize your email templates</p>
  </div>
);

const Settings = () => (
  <div className="page">
    <h1>Settings</h1>
    <p>Configure your system settings</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Cleveland LGBTQ Center</h1>
          <p>Client Follow-Up Automation</p>
        </header>
        
        <nav className="nav">
          <a href="/">Dashboard</a>
          <a href="/clients">Clients</a>
          <a href="/templates">Templates</a>
          <a href="/settings">Settings</a>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Built with ❤️ by Alignment AI for Cleveland LGBTQ Center</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
