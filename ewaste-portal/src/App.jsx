import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';

import UserDashboard from './pages/UserDashboard';
import LogEwaste from './pages/LogEwaste';
import Wallet from './pages/Wallet';

import CollectorDashboard from './pages/CollectorDashboard';
import RecyclerDashboard from './pages/RecyclerDashboard';
import RecyclerReports from './pages/RecyclerReports';
import RecyclerAnalytics from './pages/RecyclerAnalytics';
import ESGDashboard from './pages/ESGDashboard';

import { AppProvider } from './context/AppContext';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage onSelectRole={(r) => console.log(r)} />} />
          
          {/* User Mobile Flow */}
          <Route path="/user" element={<MobileLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="log" element={<LogEwaste />} />
            <Route path="wallet" element={<Wallet />} />
          </Route>

          {/* Collector Mobile Flow */}
          <Route path="/collector" element={<MobileLayout />}>
            <Route path="dashboard" element={<CollectorDashboard />} />
          </Route>

          {/* Recycler Desktop Flow */}
          <Route path="/recycler" element={<DesktopLayout />}>
            <Route path="dashboard" element={<RecyclerDashboard />} />
            <Route path="reports" element={<RecyclerReports />} />
            <Route path="analytics" element={<RecyclerAnalytics />} />
          </Route>

          {/* ESG Desktop Flow */}
          <Route path="/esg" element={<DesktopLayout />}>
            <Route path="dashboard" element={<ESGDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
