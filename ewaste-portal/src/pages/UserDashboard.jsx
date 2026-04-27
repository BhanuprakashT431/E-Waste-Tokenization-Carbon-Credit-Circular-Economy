import React from 'react';
import { Leaf, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const statusColor = {
  PENDING: '#F59E0B',
  IN_PROGRESS: '#3B82F6',
  PICKED_UP: '#8B5CF6',
  DELIVERED: '#F97316',
  COMPLETED: '#10B981',
};

const statusLabel = {
  PENDING: 'Pending Pickup',
  IN_PROGRESS: 'Collector On Way',
  PICKED_UP: 'Picked Up',
  DELIVERED: 'At Facility',
  COMPLETED: 'Completed',
};

export default function UserDashboard() {
  const { userProfile, requests } = useAppContext();

  const ewasteLogged = requests.length;
  const inProgress = requests.filter(r => ['PENDING', 'IN_PROGRESS', 'PICKED_UP', 'DELIVERED'].includes(r.status)).length;
  const recycled = requests.filter(r => r.status === 'COMPLETED').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="profile-header">
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?img=68" alt="Profile" />
        </div>
        <div className="profile-text">
          <h2>Hello, {userProfile.name}</h2>
          <p>Let's recycle for a better future!</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="credit-card">
        <div>
          <h3>Total Carbon Credits</h3>
          <div className="balance">{userProfile.carbonCredits.toFixed(1)} CC</div>
        </div>
        <Leaf size={40} color="rgba(255,255,255,0.4)" />
      </motion.div>

      <motion.div variants={itemVariants} className="stats-row">
        <div className="stat-box">
          <div className="stat-val">{ewasteLogged}</div>
          <div className="stat-label">E-waste Logged</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{recycled}</div>
          <div className="stat-label">Recycled</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="list-header">
        <h3>Recent Activity</h3>
        <Link to="#">View All</Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        {requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#6B7280' }}>No activity yet. Log your first e-waste!</div>
        ) : (
          requests.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="card"
              style={{ marginBottom: 12, padding: 16 }}
            >
              {/* Top row: Item name + Status badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{req.category}</h4>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>{req.id}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  backgroundColor: (statusColor[req.status] || '#9CA3AF') + '20',
                  color: statusColor[req.status] || '#9CA3AF',
                }}>
                  {statusLabel[req.status] || req.status}
                </span>
              </div>

              {/* Location row */}
              {req.location && req.location !== 'Location not shared' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <MapPin size={12} color="#6B7280" />
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{req.location}</span>
                </div>
              )}

              {/* Pickup Code — only show if actively waiting */}
              {['PENDING', 'IN_PROGRESS'].includes(req.status) && req.pickupCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F, #1D4ED8)',
                    borderRadius: 12, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginTop: 6
                  }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 8px' }}>
                    <Lock size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 2, letterSpacing: 1 }}>
                      SECURE PICKUP CODE · SHARE ONLY WITH COLLECTOR
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: 8, fontFamily: 'monospace' }}>
                      {req.pickupCode}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Completed row: CC awarded */}
              {req.status === 'COMPLETED' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>+{req.ccAwarded} CC Earned</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
