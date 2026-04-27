import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { currentUser, logout } = useAuth();
  const isCollector = location.pathname.includes('/collector');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initial = currentUser?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="app-container" style={{ backgroundColor: '#E5E7EB' }}>
      <div className="mobile-layout">
        <div className="top-bar">
          <div className="top-bar-title">{isCollector ? '🚴 Collector App' : '🌿 E-Waste Portal'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: isCollector ? '#7C3AED' : '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>
              {initial}
            </div>
            <button onClick={handleLogout} title="Log out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="content-area">
          <Outlet />
        </div>

        <div className="bottom-nav">
          <Link to={isCollector ? '/collector/dashboard' : '/user/dashboard'} className={`nav-item ${location.pathname.endsWith('dashboard') ? 'active' : ''}`}>
            <Home size={24} />
            <span>Home</span>
          </Link>

          {!isCollector && (
            <Link to="/user/log" className={`nav-item ${location.pathname.includes('log') ? 'active' : ''}`}>
              <List size={24} />
              <span>My Waste</span>
            </Link>
          )}

          {isCollector && (
            <Link to="/collector/earnings" className={`nav-item ${location.pathname.includes('earnings') ? 'active' : ''}`}>
              <List size={24} />
              <span>Earnings</span>
            </Link>
          )}

          {!isCollector && (
            <Link to="/user/wallet" className={`nav-item ${location.pathname.includes('wallet') ? 'active' : ''}`}>
              <Wallet size={24} />
              <span>Wallet</span>
            </Link>
          )}

          <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
