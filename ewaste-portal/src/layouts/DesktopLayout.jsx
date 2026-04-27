import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, Settings, User } from 'lucide-react';

export default function DesktopLayout() {
  const location = useLocation();
  const isESG = location.pathname.includes('/esg');

  return (
    <div className="desktop-layout">
      <div className="sidebar">
        <div style={{marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 32, height: 32, backgroundColor: '#10B981', borderRadius: 8}}></div>
          <span style={{fontWeight: 700, fontSize: 18}}>{isESG ? 'ESG Portal' : 'Recycler Pro'}</span>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <Link to={isESG ? "/esg/dashboard" : "/recycler/dashboard"} className={`nav-item ${location.pathname.endsWith('dashboard') ? 'active' : ''}`} style={{flexDirection: 'row', padding: '12px 16px', borderRadius: 8, backgroundColor: location.pathname.endsWith('dashboard') ? '#F3F4F6' : 'transparent'}}>
            <LayoutDashboard size={20} />
            <span style={{fontSize: 14}}>Overview</span>
          </Link>
          <Link to={isESG ? "#" : "/recycler/reports"} className={`nav-item ${location.pathname.endsWith('reports') ? 'active' : ''}`} style={{flexDirection: 'row', padding: '12px 16px', borderRadius: 8, backgroundColor: location.pathname.endsWith('reports') ? '#F3F4F6' : 'transparent', textDecoration: 'none', color: 'inherit'}}>
            <FileText size={20} />
            <span style={{fontSize: 14}}>Reports</span>
          </Link>
          <Link to={isESG ? "#" : "/recycler/analytics"} className={`nav-item ${location.pathname.endsWith('analytics') ? 'active' : ''}`} style={{flexDirection: 'row', padding: '12px 16px', borderRadius: 8, backgroundColor: location.pathname.endsWith('analytics') ? '#F3F4F6' : 'transparent', textDecoration: 'none', color: 'inherit'}}>
            <BarChart2 size={20} />
            <span style={{fontSize: 14}}>Analytics</span>
          </Link>
        </div>

        <div style={{marginTop: 'auto'}}>
          <Link to="/" className="nav-item" style={{flexDirection: 'row', padding: '12px 16px'}}>
            <User size={20} />
            <span style={{fontSize: 14}}>Log Out</span>
          </Link>
        </div>
      </div>

      <div className="desktop-content">
        <Outlet />
      </div>
    </div>
  );
}
