import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeItem } from '../utils/integrityAI';

// Emoji icon per category
const ICONS = {
  Laptop: '💻', 'Mobile Phone': '📱', Monitor: '🖥️',
  Battery: '🔋', CPU: '🖥️', Tablet: '📟', Printer: '🖨️', Other: '📦',
};

function HoverCard({ children, onClick, style = {} }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', borderColor: '#BFDBFE' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      style={{
        background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
        overflow: 'hidden', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'border-color 0.2s',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function RecyclerReports() {
  const { requests } = useAppContext();
  const [expanded, setExpanded] = useState(null);

  // Hydrate all completed requests — compute AI analysis for legacy items that lack it
  const enrichedRequests = useMemo(() =>
    requests
      .filter(r => r.status === 'COMPLETED')
      .map(req => ({
        ...req,
        aiAnalysis: req.aiAnalysis || analyzeItem(req.category, req.weight),
      })),
  [requests]);

  const totalReusable = enrichedRequests.reduce(
    (acc, req) => acc + (req.aiAnalysis?.reusableComponents?.length || 0), 0
  );
  const totalCC = enrichedRequests.reduce((acc, req) => acc + (req.ccAwarded || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ maxWidth: 1000 }}>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Processing Reports</h2>
      <p style={{ color: '#6B7280', marginBottom: 28 }}>AI-generated analysis of all verified and processed e-waste items. Click any row to expand.</p>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Items Processed',    value: enrichedRequests.length,      icon: '📦', color: '#3B82F6' },
          { label: 'Reusable Parts Found', value: totalReusable,              icon: '♻️', color: '#10B981' },
          { label: 'Total CC Issued',    value: totalCC.toFixed(1) + ' CC',   icon: '🌿', color: '#8B5CF6' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            style={{
              background: 'white', borderRadius: 16, padding: 20,
              border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'default'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Report cards ── */}
      {enrichedRequests.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
          No AI-verified reports yet.
        </div>
      ) : (
        enrichedRequests.map((req, idx) => {
          const ai = req.aiAnalysis;
          const isOpen = expanded === req.id;

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{ marginBottom: 16 }}
            >
              <HoverCard onClick={() => setExpanded(isOpen ? null : req.id)}>

                {/* ── Header row ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                  {/* Left: icon + name */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, background: '#EFF6FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
                    }}>
                      {ICONS[req.category] || '📦'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>
                        {req.category} <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}>· {req.weight} kg</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{req.id}</div>
                      {ai && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                            background: ai.qualityColor + '20', color: ai.qualityColor,
                          }}>{ai.qualityLabel}</span>
                          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                            ♻️ {ai.reusableComponents?.length || 0} reusable parts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: CC + date + chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>+{req.ccAwarded} CC</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: '#9CA3AF', fontSize: 20, lineHeight: 1 }}
                    >▾</motion.div>
                  </div>
                </div>

                {/* ── Expandable AI analysis ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid #F3F4F6', padding: '20px 24px', background: '#FAFBFF' }}>
                        {/* Quality + CC cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                          <div style={{ background: 'white', borderRadius: 12, padding: 14, border: '1px solid #E5E7EB' }}>
                            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Quality Score</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: ai.qualityColor }}>{ai.overallQuality}%</div>
                            <div style={{ background: '#E5E7EB', borderRadius: 99, height: 6, overflow: 'hidden', marginTop: 6 }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${ai.overallQuality}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                style={{ height: '100%', background: ai.qualityColor, borderRadius: 99 }}
                              />
                            </div>
                          </div>
                          <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 14, border: '1px solid #BBF7D0' }}>
                            <div style={{ fontSize: 12, color: '#166534', marginBottom: 6 }}>Carbon Credits Issued</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#15803D' }}>+{req.ccAwarded} CC</div>
                            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                              {ai.reusableComponents?.length || 0} of {ai.totalComponents} parts reusable
                            </div>
                          </div>
                        </div>

                        {/* ── Reusable components table ── */}
                        {ai.reusableComponents?.length > 0 && (
                          <>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginBottom: 10 }}>
                              ♻️ Reusable Components Identified ({ai.reusableComponents.length})
                            </h4>
                            <div style={{ border: '1px solid #BBF7D0', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                                <thead>
                                  <tr style={{ background: '#F0FDF4' }}>
                                    {['Component', 'Type', 'Condition', 'Market Destination'].map(h => (
                                      <th key={h} style={{ padding: '10px 14px', color: '#166534', fontWeight: 600 }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {ai.reusableComponents.map((c, i) => (
                                    <motion.tr
                                      key={i}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.05 }}
                                      style={{ borderTop: '1px solid #DCFCE7' }}
                                    >
                                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{c.name}</td>
                                      <td style={{ padding: '10px 14px', color: '#6B7280' }}>{c.type}</td>
                                      <td style={{ padding: '10px 14px' }}>
                                        <span style={{
                                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                                          background: c.score >= 70 ? '#DCFCE7' : c.score >= 40 ? '#FEF9C3' : '#FEE2E2',
                                          color: c.score >= 70 ? '#15803D' : c.score >= 40 ? '#92400E' : '#DC2626',
                                        }}>{c.condition}</span>
                                      </td>
                                      <td style={{ padding: '10px 14px', color: '#3B82F6', fontSize: 12 }}>{c.market}</td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* ── Recycle / Safe disposal chips ── */}
                        {ai.recycleComponents?.length > 0 && (
                          <>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 10 }}>
                              🔩 Materials Sent for Recycling / Safe Disposal ({ai.recycleComponents.length})
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {ai.recycleComponents.map((c, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.04 }}
                                  whileHover={{ scale: 1.04, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                  style={{
                                    background: '#FFF7ED', border: '1px solid #FED7AA',
                                    borderRadius: 10, padding: '7px 12px', fontSize: 12, cursor: 'default',
                                  }}
                                >
                                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                                  {c.recycleNote && (
                                    <span style={{ color: '#9CA3AF' }}> · {c.recycleNote}</span>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </HoverCard>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}
