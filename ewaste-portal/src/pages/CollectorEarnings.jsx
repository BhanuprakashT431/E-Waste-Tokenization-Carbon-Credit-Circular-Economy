import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Star, DollarSign, Award } from 'lucide-react';

// Quality multipliers per category
const CATEGORY_RATES = {
  'Laptop':       { rate: 80, quality: 'Premium', stars: 5 },
  'Monitor':      { rate: 70, quality: 'High',    stars: 4 },
  'CPU':          { rate: 65, quality: 'High',    stars: 4 },
  'Mobile Phone': { rate: 60, quality: 'Standard', stars: 3 },
  'Tablet':       { rate: 60, quality: 'Standard', stars: 3 },
  'Printer':      { rate: 45, quality: 'Basic',   stars: 2 },
  'Battery':      { rate: 30, quality: 'Basic',   stars: 2 },
  'Other':        { rate: 25, quality: 'Basic',   stars: 1 },
};

const qualityColors = {
  Premium:  '#10B981',
  High:     '#3B82F6',
  Standard: '#F59E0B',
  Basic:    '#9CA3AF',
};

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= count ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </div>
  );
}

export default function CollectorEarnings() {
  const { collectorProfile, requests } = useAppContext();

  const completed = requests.filter(r => ['PICKED_UP', 'DELIVERED', 'COMPLETED'].includes(r.status));
  const totalDeliveries = completed.length;
  const totalWeight = completed.reduce((acc, r) => acc + (r.weight || 0), 0);

  // Compute earnings per delivery
  const earnings = completed.map(req => {
    const info = CATEGORY_RATES[req.category] || CATEGORY_RATES['Other'];
    const quantityEarning = req.weight * info.rate;
    const qualityBonus = info.stars >= 4 ? req.weight * 20 : info.stars >= 3 ? req.weight * 10 : 0;
    const totalEarning = Math.round(quantityEarning + qualityBonus);
    return { ...req, ...info, quantityEarning, qualityBonus, totalEarning };
  });

  const totalEarned = earnings.reduce((acc, e) => acc + e.totalEarning, 0);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Header Earnings Card */}
      <motion.div variants={itemVariants} style={{
        background: 'linear-gradient(135deg, #5B21B6, #7C3AED, #8B5CF6)',
        borderRadius: 20, padding: 24, marginBottom: 20, color: 'white'
      }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Total Earnings</div>
        <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
          ₹{collectorProfile.earnings.toLocaleString('en-IN')}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Deliveries</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalDeliveries}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Total Weight</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalWeight.toFixed(1)} kg</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>Avg / Trip</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₹{totalDeliveries > 0 ? Math.round(totalEarned / totalDeliveries) : 0}</div>
          </div>
        </div>
      </motion.div>

      {/* Rate Card */}
      <motion.div variants={itemVariants} className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Award size={16} color="#8B5CF6" />
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Category Pay Rates</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(CATEGORY_RATES).slice(0, 5).map(([cat, info]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{cat}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                  background: qualityColors[info.quality] + '20', color: qualityColors[info.quality]
                }}>{info.quality}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6' }}>₹{info.rate}/kg</div>
                <StarRating count={info.stars} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Earnings History */}
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Earnings History</h3>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{earnings.length} orders</span>
      </motion.div>

      {earnings.length === 0 ? (
        <motion.div variants={itemVariants} className="card" style={{ textAlign: 'center', color: '#9CA3AF', padding: 32 }}>
          <Package size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
          No completed deliveries yet.
        </motion.div>
      ) : (
        earnings.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="card"
            style={{ marginBottom: 12, padding: 16 }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{item.category}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    background: qualityColors[item.quality] + '20', color: qualityColors[item.quality]
                  }}>{item.quality}</span>
                </div>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>{item.id}</p>
                <StarRating count={item.stars} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#8B5CF6' }}>+₹{item.totalEarning}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                  {item.status === 'COMPLETED' ? '✓ Completed' : '✓ Delivered'}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{item.weight} kg × ₹{item.rate}/kg</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>₹{Math.round(item.quantityEarning)}</span>
              </div>
              {item.qualityBonus > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#10B981' }}>✨ Quality Bonus</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>+₹{Math.round(item.qualityBonus)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
