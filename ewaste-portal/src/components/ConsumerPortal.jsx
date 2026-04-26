import React, { useState } from 'react';

// Icons mapping based on original app.js logic
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

export default function ConsumerPortal({ balance, assets, lastUpdated, onRegister, pulse, flash }) {
  const [device, setDevice] = useState('');
  const [serial, setSerial] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!device.trim()) newErrors.device = true;
    if (!serial.trim()) newErrors.serial = true;
    const w = parseFloat(weight);
    if (!weight || isNaN(w) || w <= 0) newErrors.weight = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onRegister({ device, serial, weight: parseFloat(w.toFixed(2)) });
    
    setDevice('');
    setSerial('');
    setWeight('');
    
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1800);
  };

  const totalRegistered = assets.length;
  const pendingCredit = assets.filter(a => a.status === 'pending').length * 75;
  const totalKg = assets.reduce((s, a) => s + a.weight, 0);
  const co2Offset = (totalKg * 1.4).toFixed(1);

  const statusLabel = (s) => ({ pending: 'Pending', 'in-transit': 'In-Transit', credited: 'Credited' }[s] || s);

  return (
    <section className="portal active" aria-label="Consumer Portal">
      <div className="role-badge-row">
        <div className="role-badge consumer-badge">
          <span className="dot"></span>Consumer View
        </div>
        <p className="role-desc">Manage your devices, track carbon credit earnings.</p>
      </div>

      <div className="balance-card">
        <div className="balance-label">Carbon Credit Tokens</div>
        <div className="balance-amount-wrap">
          <div className={`balance-pulse-ring ${pulse ? 'pulse' : ''}`} aria-hidden="true"></div>
          <span className="balance-currency">CCT</span>
          <span className={`balance-amount ${flash ? 'flash' : ''}`}>{Math.floor(balance).toLocaleString('en-US')}</span>
        </div>
        <div className="balance-meta">
          <div className="balance-meta-item">
            <span className="meta-dot green"></span>
            <span>Wallet Active</span>
          </div>
          <div className="balance-meta-sep">·</div>
          <div className="balance-meta-item">
            <span>Blockchain Verified</span>
          </div>
          <div className="balance-meta-sep">·</div>
          <div className="balance-meta-item">
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="consumer-grid">
        <div className="card form-card">
          <div className="card-header">
            <h2 className="card-title">Register New Hardware</h2>
            <p className="card-desc">Submit your e-waste device to begin the carbon credit lifecycle.</p>
          </div>
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="device-name">Device Name</label>
              <input 
                id="device-name" 
                type="text" 
                className={`form-input ${errors.device ? 'error' : ''}`} 
                placeholder="e.g. MacBook Pro 2019" 
                autoComplete="off" 
                value={device}
                onChange={e => { setDevice(e.target.value); setErrors({...errors, device: false}) }}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="serial-number">Serial Number</label>
              <input 
                id="serial-number" 
                type="text" 
                className={`form-input ${errors.serial ? 'error' : ''}`} 
                placeholder="e.g. C02XG0JHJGH5" 
                autoComplete="off" 
                value={serial}
                onChange={e => { setSerial(e.target.value); setErrors({...errors, serial: false}) }}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="weight">Estimated Weight (kg)</label>
              <input 
                id="weight" 
                type="number" 
                className={`form-input ${errors.weight ? 'error' : ''}`} 
                placeholder="e.g. 2.4" 
                min="0.1" 
                step="0.1" 
                value={weight}
                onChange={e => { setWeight(e.target.value); setErrors({...errors, weight: false}) }}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                '✦ Submitted!'
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  Submit to Ledger
                </>
              )}
            </button>
          </form>
        </div>

        <div className="stats-column">
          <div className="stat-card">
            <div className="stat-label">Total Registered</div>
            <div className="stat-value">{totalRegistered}</div>
            <div className="stat-sub">Devices on-chain</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Credit</div>
            <div className="stat-value green">{pendingCredit}</div>
            <div className="stat-sub">CCT awaiting confirm</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">CO₂ Offset</div>
            <div className="stat-value">{co2Offset}</div>
            <div className="stat-sub">kg estimated</div>
          </div>
        </div>
      </div>

      <div className="card asset-chain-card">
        <div className="card-header inline">
          <div>
            <h2 className="card-title">Active Asset Chain</h2>
            <p className="card-desc">Your registered devices on the immutable ledger.</p>
          </div>
          <div className="chain-legend">
            <span className="badge pending">Pending</span>
            <span className="badge in-transit">In-Transit</span>
            <span className="badge credited">Credited</span>
          </div>
        </div>
        <div className="asset-list">
          {assets.length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>No assets registered yet.</p>
          ) : (
            assets.map(a => (
              <div key={a.id} className="asset-row">
                <div className="asset-icon">{getDeviceIcon(a.device)}</div>
                <div className="asset-info">
                  <div className="asset-name">{a.device}</div>
                  <div className="asset-serial">{a.serial}</div>
                </div>
                <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                  <div className="asset-weight">{a.weight} kg</div>
                  <div className="asset-time">{a.time}</div>
                </div>
                <div className="asset-badge-col">
                  <span className={`badge ${a.status}`}>{statusLabel(a.status)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
