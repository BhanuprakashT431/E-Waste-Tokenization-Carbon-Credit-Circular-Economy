import React, { useEffect } from 'react';

export default function Toast({ show, title, sub, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div id="toast" className={`toast ${show ? 'show' : ''}`} role="alert" aria-live="polite">
      <div className="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <div className="toast-body">
        <p className="toast-title">{title}</p>
        <p className="toast-sub">{sub}</p>
      </div>
    </div>
  );
}
