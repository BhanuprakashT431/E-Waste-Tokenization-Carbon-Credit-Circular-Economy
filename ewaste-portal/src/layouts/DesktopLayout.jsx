import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const recyclerLinks = [
  { to: '/recycler/dashboard', label: 'Overview',  icon: LayoutDashboard, key: 'dashboard' },
  { to: '/recycler/reports',   label: 'Reports',   icon: FileText,         key: 'reports'   },
  { to: '/recycler/analytics', label: 'Analytics', icon: BarChart2,        key: 'analytics' },
];

const esgLinks = [
  { to: '/esg/dashboard', label: 'Overview',  icon: LayoutDashboard, key: 'dashboard' },
  { to: '/esg/reports',   label: 'Reports',   icon: FileText,         key: 'reports'   },
  { to: '/esg/analytics', label: 'Analytics', icon: BarChart2,        key: 'analytics' },
];

export default function DesktopLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isESG = location.pathname.includes('/esg');
  const links = isESG ? esgLinks : recyclerLinks;
  const brandColor = isESG ? '#0D9488' : '#10B981';

  const handleLogout = () => { logout(); navigate('/'); };
  const initial = currentUser?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="desktop-layout">
      <div className="sidebar">
        {/* Brand */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: brandColor, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {isESG ? '🌍' : '♻️'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{isESG ? 'ESG Portal' : 'Recycler Pro'}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{currentUser?.name || ''}</div>
          </div>
        </div>

        {/* User chip */}
        {currentUser && (
          <div style={{ background: '#F3F4F6', borderRadius: 12, padding: '10px 14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
              {initial}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{currentUser.userId}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {links.map(({ to, label, icon: Icon, key }) => {
            const isActive = location.pathname.includes(key);
            return (
              <Link key={key} to={to} className="nav-item" style={{
                flexDirection: 'row', padding: '11px 14px', borderRadius: 10, textDecoration: 'none',
                color: isActive ? brandColor : '#6B7280',
                backgroundColor: isActive ? (isESG ? '#F0FDFA' : '#F0FDF4') : 'transparent',
                fontWeight: isActive ? 600 : 400, transition: 'all 0.2s',
              }}>
                <Icon size={18} />
                <span style={{ fontSize: 14 }}>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          <button onClick={handleLogout} className="nav-item" style={{
            width: '100%', flexDirection: 'row', padding: '11px 14px', borderRadius: 10,
            background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <LogOut size={18} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Log Out</span>
          </button>
        </div>
      </div>

      <div className="desktop-content">
        <Outlet />
      </div>
    </div>
  );
}
