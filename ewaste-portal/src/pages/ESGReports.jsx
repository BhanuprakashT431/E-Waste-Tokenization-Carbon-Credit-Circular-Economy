import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { analyzeItem } from '../utils/integrityAI';

export default function ESGReports() {
  const { requests } = useAppContext();
  const [expanded, setExpanded] = useState(null);

  const enriched = useMemo(() =>
    requests.filter(r => r.status === 'COMPLETED').map(req => ({
      ...req,
      aiAnalysis: req.aiAnalysis || analyzeItem(req.category, req.weight),
    })), [requests]);

  const totalCC    = enriched.reduce((a, r) => a + (r.ccAwarded || 0), 0);
  const totalKg    = enriched.reduce((a, r) => a + (r.weight || 0), 0);
  const co2Avoided = (totalKg * 1.5).toFixed(2);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1000 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>ESG Compliance Reports</h2>
      <p style={{ color: '#6B7280', marginBottom: 28 }}>
        Auditable, item-level records for ESG disclosures, carbon credit verification, and regulatory compliance.
      </p>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Items Verified', value: enriched.length,          color: '#3B82F6', icon: '📋' },
          { label: 'CC Tokens Issued', value: totalCC.toFixed(1)+' CC', color: '#10B981', icon: '🌿' },
          { label: 'CO₂ Avoided',    value: co2Avoided+' kg',          color: '#8B5CF6', icon: '💨' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.08 }}
            whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
            style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #E5E7EB', cursor: 'default' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Records */}
      {enriched.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          No verified records yet. Complete the e-waste lifecycle to generate ESG reports.
        </div>
      ) : enriched.map((req, idx) => {
        const ai = req.aiAnalysis;
        const isOpen = expanded === req.id;
        return (
          <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.07 }} style={{ marginBottom: 14 }}>
            <motion.div
              whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(0,0,0,0.08)', borderColor: '#BFDBFE' }}
              onClick={() => setExpanded(isOpen ? null : req.id)}
              style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {req.category === 'Laptop' ? '💻' : req.category === 'Battery' ? '🔋' : req.category === 'Monitor' ? '🖥️' : '📦'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{req.category} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 12 }}>· {req.weight} kg</span></div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{req.id} · {new Date(req.createdAt).toLocaleDateString()}</div>
                    {ai && <div style={{ fontSize: 11, color: ai.qualityColor, fontWeight: 600, marginTop: 2 }}>{ai.qualityLabel} · ♻️ {ai.reusableComponents?.length} reusable parts</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>+{req.ccAwarded} CC</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>≈ {(req.weight*1.5).toFixed(1)} kg CO₂ avoided</div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: '#9CA3AF', fontSize: 20 }}>▾</motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && ai && (
                  <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    <div style={{ borderTop: '1px solid #F3F4F6', padding: '20px 24px', background: '#FAFFFE' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                        {[
                          { label: 'Quality Score',      value: ai.overallQuality+'%',                  color: ai.qualityColor },
                          { label: 'Reusable Parts',     value: ai.reusableComponents?.length+' components', color: '#10B981' },
                          { label: 'CO₂ Avoided',        value: (req.weight*1.5).toFixed(1)+' kg',      color: '#8B5CF6' },
                        ].map((c, i) => (
                          <div key={i} style={{ background: 'white', borderRadius: 10, padding: 14, border: '1px solid #E5E7EB', textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: c.color }}>{c.value}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{c.label}</div>
                          </div>
                        ))}
                      </div>
                      {ai.reusableComponents?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {ai.reusableComponents.map((c, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.04 }}
                              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#15803D' }}>
                              ♻️ {c.name}
                              <span style={{ color: '#9CA3AF', fontWeight: 400 }}> · {c.condition}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
