import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';

import UserDashboard from './pages/UserDashboard';
import LogEwaste from './pages/LogEwaste';
import Wallet from './pages/Wallet';

import CollectorDashboard from './pages/CollectorDashboard';
import CollectorEarnings from './pages/CollectorEarnings';

import RecyclerDashboard from './pages/RecyclerDashboard';
import RecyclerReports from './pages/RecyclerReports';
import RecyclerAnalytics from './pages/RecyclerAnalytics';

import ESGDashboard from './pages/ESGDashboard';
import ESGReports from './pages/ESGReports';
import ESGAnalytics from './pages/ESGAnalytics';

import AuthPage from './pages/AuthPage';

import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Protected route — redirects to auth if not logged in for this role
function Protected({ role, children }) {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== role) {
    return <Navigate to={`/auth/${role}`} replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth pages — one per role */}
            <Route path="/auth/:role" element={<AuthPage />} />

            {/* User */}
            <Route path="/user" element={<Protected role="user"><MobileLayout /></Protected>}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="log"       element={<LogEwaste />} />
              <Route path="wallet"    element={<Wallet />} />
            </Route>

            {/* Collector */}
            <Route path="/collector" element={<Protected role="collector"><MobileLayout /></Protected>}>
              <Route path="dashboard" element={<CollectorDashboard />} />
              <Route path="earnings"  element={<CollectorEarnings />} />
            </Route>

            {/* Recycler */}
            <Route path="/recycler" element={<Protected role="recycler"><DesktopLayout /></Protected>}>
              <Route path="dashboard" element={<RecyclerDashboard />} />
              <Route path="reports"   element={<RecyclerReports />} />
              <Route path="analytics" element={<RecyclerAnalytics />} />
            </Route>

            {/* ESG */}
            <Route path="/esg" element={<Protected role="esg"><DesktopLayout /></Protected>}>
              <Route path="dashboard" element={<ESGDashboard />} />
              <Route path="reports"   element={<ESGReports />} />
              <Route path="analytics" element={<ESGAnalytics />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
