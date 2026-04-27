import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function LogEwaste() {
  const navigate = useNavigate();
  const { logEwaste } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Laptop");
  const [weight, setWeight] = useState("2.5");
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | fetching | fetched
  const [locationText, setLocationText] = useState('');

  const handleShareLocation = () => {
    setLocationStatus('fetching');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationText(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
          setLocationStatus('fetched');
        },
        () => {
          // Fallback for demo if user denies permission
          setLocationText("12.9716° N, 77.5946° E · Bengaluru");
          setLocationStatus('fetched');
        },
        { timeout: 5000 }
      );
    } else {
      setLocationText("12.9716° N, 77.5946° E · Bengaluru");
      setLocationStatus('fetched');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locationText) {
      alert('Please share your location so the collector can find you.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      logEwaste(category, weight, locationText);
      setLoading(false);
      navigate('/user/dashboard');
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>What are you disposing?</h2>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Fill in the details and share your pickup location.</p>

      <form onSubmit={handleSubmit}>
        <div className="upload-box">
          <Camera />
          <span style={{ fontWeight: 500, color: '#4B5563' }}>Upload Image (Optional)</span>
        </div>

        <div className="input-group">
          <label className="input-label">Select Category</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Laptop">Laptop</option>
            <option value="Mobile Phone">Mobile Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Battery">Battery</option>
            <option value="Monitor">Monitor</option>
            <option value="CPU">CPU</option>
            <option value="Printer">Printer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Estimated Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            className="input-field"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        {/* Location Section */}
        <div className="input-group">
          <label className="input-label">Pickup Location <span style={{ color: '#EF4444' }}>*</span></label>

          {locationStatus === 'idle' && (
            <button
              type="button"
              onClick={handleShareLocation}
              style={{
                width: '100%', padding: '14px 16px', border: '2px dashed #D1D5DB',
                borderRadius: 12, backgroundColor: '#F9FAFB', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, color: '#4B5563',
                fontWeight: 500, fontSize: 14
              }}
            >
              <MapPin size={18} color="#10B981" />
              Tap to share your location
            </button>
          )}

          {locationStatus === 'fetching' && (
            <div style={{
              width: '100%', padding: '14px 16px', border: '2px dashed #D1D5DB',
              borderRadius: 12, backgroundColor: '#F9FAFB',
              display: 'flex', alignItems: 'center', gap: 10, color: '#6B7280', fontSize: 14
            }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <MapPin size={18} color="#6B7280" />
              </motion.div>
              Fetching GPS coordinates...
            </div>
          )}

          {locationStatus === 'fetched' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                width: '100%', padding: '14px 16px', border: '2px solid #10B981',
                borderRadius: 12, backgroundColor: '#F0FDF4',
                display: 'flex', alignItems: 'center', gap: 10
              }}
            >
              <CheckCircle size={18} color="#10B981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 2 }}>LOCATION CONFIRMED</div>
                <div style={{ fontSize: 13, color: '#065F46', fontWeight: 500 }}>{locationText}</div>
              </div>
              <button
                type="button"
                onClick={() => { setLocationStatus('idle'); setLocationText(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 12 }}
              >
                Change
              </button>
            </motion.div>
          )}
        </div>

        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', marginBottom: 24, marginTop: 8 }}>
          <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>
            📍 Your location is only shared with the assigned collector for pickup coordination. A secure 4-digit code will be generated for you.
          </p>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !locationText}>
          {loading ? 'CREATING REQUEST...' : '🔐 SUBMIT & GET PICKUP CODE'}
        </button>
      </form>
    </motion.div>
  );
}
