import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, Wallet, User } from 'lucide-react';

export default function MobileLayout() {
  const location = useLocation();
  const isCollector = location.pathname.includes('/collector');

  return (
    <div className="app-container" style={{backgroundColor: '#E5E7EB'}}>
      <div className="mobile-layout">
        <div className="top-bar">
          <div className="top-bar-title">{isCollector ? 'Collector App' : 'E-Waste Portal'}</div>
          <div style={{width: 32, height: 32, backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <User size={16} color="#6B7280" />
          </div>
        </div>

        <div className="content-area">
          <Outlet />
        </div>

        <div className="bottom-nav">
          <Link to={isCollector ? "/collector/dashboard" : "/user/dashboard"} className={`nav-item ${location.pathname.endsWith('dashboard') ? 'active' : ''}`}>
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
            <Link to="/collector/dashboard" className="nav-item">
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
          <Link to="/" className="nav-item">
            <User size={24} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
