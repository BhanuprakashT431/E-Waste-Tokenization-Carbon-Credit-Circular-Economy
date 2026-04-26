import React, { useState } from 'react';

const getDeviceIcon = (name) => {
  const lower = name.toLowerCase();
  if (/iphone|galaxy|pixel|oneplus|redmi/i.test(lower)) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/></svg>
    );
  }
  if (/macbook|laptop|thinkpad|elitebook|xps|yoga/i.test(lower)) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18L4 6h16l2 12H2z"/><path d="M4 6V4h16v2"/></svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
  );
};

export default function RecyclerPortal({ queue, verifiedCount, cctIssued, onVerify }) {
  const [dissolving, setDissolving] = useState(null);

  const handleVerifyClick = (id) => {
    setDissolving(id);
    setTimeout(() => {
      onVerify(id);
      setDissolving(null);
    }, 500);
  };

  return (
    <section className="portal active" aria-label="Recycler Portal">
      <div className="role-badge-row">
        <div className="role-badge recycler-badge">
          <span className="dot green"></span>Recycler View
        </div>
        <p className="role-desc">Verify incoming shipments and execute smart contracts.</p>
      </div>

      <div className="recycler-header">
        <div>
          <h2 className="section-title">Recycling Queue</h2>
          <p className="section-desc">Immediate verification required · <span>{queue.length}</span> shipments pending</p>
        </div>
        <div className="recycler-stats-row">
          <div className="r-stat">
            <span className="r-stat-val">{verifiedCount}</span>
            <span className="r-stat-label">Verified Today</span>
          </div>
          <div className="r-stat-sep"></div>
          <div className="r-stat">
            <span className="r-stat-val green">{Math.floor(cctIssued).toLocaleString('en-US')}</span>
            <span className="r-stat-label">CCT Issued</span>
          </div>
        </div>
      </div>

      <div className="verification-grid">
        {queue.map((item) => (
          <div key={item.id} className={`v-card ${dissolving === item.id ? 'dissolving' : ''}`}>
            <div className="v-card-top">
              <div className="v-device-icon">{getDeviceIcon(item.device)}</div>
              <div className="v-card-id">
                <div className="v-shipment-id">#{item.id}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{item.date}</div>
              </div>
            </div>
            <div className="v-card-device">{item.device}</div>
            <div className="v-card-meta">
              <div className="v-meta-item">
                <span className="v-meta-label">Weight</span>
                <span className="v-meta-value">{item.weight} kg</span>
              </div>
              <div className="v-meta-item">
                <span className="v-meta-label">Origin</span>
                <span className="v-meta-value">{item.origin}</span>
              </div>
              <div className="v-meta-item">
                <span className="v-meta-label">Material Grade</span>
                <span className="v-meta-value">Class A</span>
              </div>
            </div>
            <div className="v-reward">
              <span className="v-reward-label">Carbon Credit Reward</span>
              <span className="v-reward-val">+75 CCT</span>
            </div>
            <button 
              className="btn-verify" 
              onClick={() => handleVerifyClick(item.id)}
              disabled={dissolving === item.id}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              Verify & Confirm Extraction
            </button>
          </div>
        ))}
      </div>

      {queue.length === 0 && (
        <div className="empty-queue" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
          </div>
          <p className="empty-title">Queue Clear</p>
          <p className="empty-sub">All shipments have been verified. Smart contracts executed.</p>
        </div>
      )}
    </section>
  );
}
