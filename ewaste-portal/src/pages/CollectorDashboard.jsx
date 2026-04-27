import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Lock, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import CollectorMapView from '../components/CollectorMapView';
import { ProfileAvatar, useAuthProfile } from '../components/ProfileAvatar';

export default function CollectorDashboard() {
  const { collectorProfile, requests, acceptRequest, confirmPickup, deliverRequest } = useAppContext();
  const authProfile = useAuthProfile();

  const [pickupModal, setPickupModal] = useState(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [collectorCoords, setCollectorCoords] = useState(null);
  const [expandedMap, setExpandedMap] = useState(null); // id of request showing map

  const pendingRequests    = requests.filter(r => r.status === 'PENDING');
  const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS');
  const pickedUpRequests   = requests.filter(r => r.status === 'PICKED_UP');

  // Get collector's live GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCollectorCoords([pos.coords.latitude, pos.coords.longitude]),
        () => setCollectorCoords([12.9800, 77.6100]) // fallback near Bengaluru
      );
    } else {
      setCollectorCoords([12.9800, 77.6100]);
    }
  }, []);

  const openPickupModal = (req) => {
    setPickupModal(req);
    setEnteredCode('');
    setCodeError(false);
    setCodeSuccess(false);
  };

  const handleConfirmPickup = () => {
    const success = confirmPickup(pickupModal.id, enteredCode);
    if (success) {
      setCodeSuccess(true);
      setTimeout(() => { setPickupModal(null); setCodeSuccess(false); }, 1500);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const SectionLabel = ({ color, label }) => (
    <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', marginBottom: 4, display: 'block', letterSpacing: 0.5 }}>
      {label}
    </span>
  );

  // Distance estimator (Haversine)
  function estimateDistance(userLocStr, collCoords) {
    if (!collCoords || !userLocStr) return null;
    const match = userLocStr.match(/([\d.]+)°\s*N,?\s*([\d.]+)°\s*E/);
    if (!match) return null;
    const [lat2, lng2] = [parseFloat(match[1]), parseFloat(match[2])];
    const [lat1, lng1] = collCoords;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Profile header */}
      <motion.div variants={itemVariants} className="profile-header">
        <ProfileAvatar size={52} />
        <div className="profile-text">
          <h2>Hi, {authProfile.name} 👋</h2>
          <p>Keep collecting, keep earning!</p>
        </div>
      </motion.div>

      {/* Earnings card */}
      <motion.div variants={itemVariants} className="credit-card" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
        <div>
          <h3>Total Earnings</h3>
          <div className="balance">₹{collectorProfile.earnings.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </motion.div>

      {/* Live location indicator */}
      <motion.div variants={itemVariants} style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
        background: '#EFF6FF', borderRadius: 10, padding: '10px 14px'
      }}>
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: 10, height: 10, borderRadius: '50%', background: collectorCoords ? '#3B82F6' : '#9CA3AF' }}
        />
        <Navigation size={13} color={collectorCoords ? '#3B82F6' : '#9CA3AF'} />
        <span style={{ fontSize: 12, color: collectorCoords ? '#1D4ED8' : '#6B7280', fontWeight: 500 }}>
          {collectorCoords
            ? `Live location active · ${collectorCoords[0].toFixed(4)}° N, ${collectorCoords[1].toFixed(4)}° E`
            : 'Acquiring location...'}
        </span>
      </motion.div>

      {/* Requests header */}
      <motion.div variants={itemVariants} className="list-header">
        <h3>Requests</h3>
        <Link to="#">View All</Link>
      </motion.div>

      {pendingRequests.length === 0 && inProgressRequests.length === 0 && pickedUpRequests.length === 0 && (
        <motion.div variants={itemVariants} className="card" style={{ textAlign: 'center', color: '#6B7280', padding: 32 }}>
          <MapPin size={28} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
          No requests available right now.
        </motion.div>
      )}

      {/* ── PENDING ── */}
      {pendingRequests.map(req => {
        const dist = estimateDistance(req.location, collectorCoords);
        return (
          <motion.div variants={itemVariants} key={req.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <SectionLabel color="#10B981" label="🆕 New Request" />
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>{req.category}
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}> · {req.weight} kg</span>
                </h4>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>{req.id}</p>
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '8px 18px', fontSize: 13, backgroundColor: '#10B981' }}
                onClick={() => acceptRequest(req.id)}>
                ACCEPT
              </button>
            </div>
            {req.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: dist ? 4 : 0 }}>
                <MapPin size={13} color="#6B7280" />
                <span style={{ fontSize: 12, color: '#6B7280' }}>{req.location}</span>
              </div>
            )}
            {dist && (
              <div style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 600, marginLeft: 20 }}>
                📏 {dist} from you
              </div>
            )}
          </motion.div>
        );
      })}

      {/* ── IN_PROGRESS: Show Map ── */}
      {inProgressRequests.map(req => {
        const dist = estimateDistance(req.location, collectorCoords);
        const showMap = expandedMap === req.id;
        return (
          <motion.div variants={itemVariants} key={req.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <SectionLabel color="#3B82F6" label="🚴 Head to Pickup" />
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>{req.category}
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}> · {req.weight} kg</span>
                </h4>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>{req.id}</p>
              </div>
              <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, backgroundColor: '#3B82F6' }}
                onClick={() => openPickupModal(req)}>
                🔐 CODE
              </button>
            </div>

            {req.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <MapPin size={13} color="#3B82F6" />
                <span style={{ fontSize: 12, color: '#3B82F6', fontWeight: 500 }}>{req.location}</span>
              </div>
            )}
            {dist && (
              <div style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 600, marginBottom: 10, marginLeft: 20 }}>
                📏 {dist} from you · ETA ~{dist.includes('m') ? '2 min' : `${Math.round(parseFloat(dist) * 3)} min`}
              </div>
            )}

            {/* Map toggle */}
            <button
              onClick={() => setExpandedMap(showMap ? null : req.id)}
              style={{
                width: '100%', padding: '9px', background: showMap ? '#EFF6FF' : '#F9FAFB',
                border: `1px solid ${showMap ? '#BFDBFE' : '#E5E7EB'}`,
                borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                color: showMap ? '#1D4ED8' : '#6B7280', marginBottom: showMap ? 10 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              🗺️ {showMap ? 'Hide Map' : 'Show Route Map'}
            </button>

            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <CollectorMapView userLocation={req.location} collectorCoords={collectorCoords} />
                  <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 6 }}>
                    🔵 You &nbsp;·&nbsp; 📦 Pickup Point
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* ── PICKED_UP: Deliver ── */}
      {pickedUpRequests.map(req => (
        <motion.div variants={itemVariants} key={req.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <SectionLabel color="#8B5CF6" label="✅ Picked Up · Ready to Deliver" />
              <h4 style={{ fontSize: 15, fontWeight: 700 }}>{req.category}
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}> · {req.weight} kg</span>
              </h4>
              <p style={{ fontSize: 11, color: '#9CA3AF' }}>{req.id}</p>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>
                💰 Est. earning: ₹{Math.round(req.weight * 50)}+
              </div>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13, backgroundColor: '#8B5CF6' }}
              onClick={() => deliverRequest(req.id)}>
              DELIVER
            </button>
          </div>
        </motion.div>
      ))}

      {/* ── PICKUP CODE MODAL ── */}
      <AnimatePresence>
        {pickupModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', padding: 20
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setPickupModal(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              style={{
                background: 'white', padding: 28, borderRadius: 24,
                width: '100%', maxWidth: 360,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', textAlign: 'center'
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: codeSuccess ? '#DCFCE7' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {codeSuccess ? <CheckCircle size={32} color="#10B981" /> : <Lock size={32} color="#3B82F6" />}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                {codeSuccess ? 'Pickup Confirmed!' : 'Enter Pickup Code'}
              </h3>
              <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>
                {codeSuccess
                  ? `${pickupModal.category} has been successfully picked up!`
                  : `Ask the user for their 4-digit secure code for ${pickupModal.category}.`}
              </p>

              {!codeSuccess && (
                <>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
                    {[0, 1, 2, 3].map(i => (
                      <input key={i} readOnly value={enteredCode[i] || ''} style={{
                        width: 56, height: 64, textAlign: 'center', fontSize: 28, fontWeight: 800,
                        border: `2px solid ${codeError ? '#EF4444' : enteredCode[i] ? '#3B82F6' : '#E5E7EB'}`,
                        borderRadius: 12, outline: 'none', fontFamily: 'monospace',
                        background: codeError ? '#FEF2F2' : enteredCode[i] ? '#EFF6FF' : '#F9FAFB',
                        color: codeError ? '#EF4444' : '#111827',
                        transition: 'all 0.2s'
                      }} />
                    ))}
                  </div>

                  {codeError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16, color: '#EF4444', fontSize: 13 }}>
                      <AlertCircle size={14} /> Incorrect code. Please try again.
                    </motion.div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                    {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => (
                      <button key={idx} type="button" disabled={!key}
                        onClick={() => {
                          if (key === '⌫') setEnteredCode(p => p.slice(0, -1));
                          else if (key && enteredCode.length < 4) setEnteredCode(p => p + key);
                          setCodeError(false);
                        }}
                        style={{
                          padding: '14px 0', fontSize: 20, fontWeight: 600, borderRadius: 12,
                          border: '1px solid #E5E7EB',
                          background: key === '⌫' ? '#FEF2F2' : '#F9FAFB',
                          cursor: key ? 'pointer' : 'default',
                          color: key === '⌫' ? '#EF4444' : '#111827',
                          opacity: !key ? 0 : 1,
                          transition: 'background 0.15s'
                        }}
                      >{key}</button>
                    ))}
                  </div>

                  <button className="btn-primary" onClick={handleConfirmPickup}
                    disabled={enteredCode.length < 4}
                    style={{ backgroundColor: '#3B82F6', opacity: enteredCode.length < 4 ? 0.5 : 1 }}>
                    CONFIRM PICKUP
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
