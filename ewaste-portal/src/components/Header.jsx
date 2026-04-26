import React from 'react';

export default function Header({ balance, view, setView }) {
  const isRecycler = view === 'recycler';
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#10B981" fillOpacity="0.12"/>
              <path d="M16 5C10.477 5 6 9.477 6 15s4.477 10 10 10 10-4.477 10-10S21.523 5 16 5z" stroke="#10B981" strokeWidth="1.5" fill="none"/>
              <path d="M16 9 L16 12 M12 11 L14.2 13.2 M20 11 L17.8 13.2 M11 15 L14 15 M18 15 L21 15 M12 19 L14.2 16.8 M20 19 L17.8 16.8 M16 23 L16 20" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="16" cy="15" r="2.5" fill="#10B981"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">E-Waste Ledger</span>
            <span className="brand-sub">Circular Economy Portal</span>
          </div>
        </div>
        <div className="header-right">
          <div className="wallet-chip">
            <span className="wallet-chip-dot"></span>
            <span>{Math.floor(balance).toLocaleString('en-US')} CCT</span>
          </div>
          <button 
            className="view-switcher-btn" 
            aria-pressed={isRecycler}
            onClick={() => setView(isRecycler ? 'consumer' : 'recycler')}
          >
            <span>{isRecycler ? 'View as Consumer' : 'View as Recycler'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8l4 4-4 4M3 12h18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
