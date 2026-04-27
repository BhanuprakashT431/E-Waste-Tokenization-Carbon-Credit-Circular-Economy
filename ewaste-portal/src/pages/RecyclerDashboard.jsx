import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeItem } from '../utils/integrityAI';
import { ProfileAvatar, useAuthProfile } from '../components/ProfileAvatar';

const SCAN_STEPS = [
  'Identifying item category...',
  'Scanning internal components...',
  'Assessing material quality...',
  'Detecting reusable parts...',
  'Calculating carbon offset...',
  'Finalizing AI report...',
];

function QualityBar({ score, color }) {
  return (
    <div style={{ background: '#F3F4F6', borderRadius: 99, height: 8, overflow: 'hidden', marginTop: 4 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: color }}
      />
    </div>
  );
}

export default function RecyclerDashboard() {
  const { recyclerProfile, requests, processRequest } = useAppContext();
  const authProfile = useAuthProfile();

  const [modalState, setModalState] = useState('closed'); // closed | scanning | result
  const [scanStep, setScanStep] = useState(0);
  const [currentReq, setCurrentReq] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState('reusable'); // reusable | recycle

  const deliveredRequests = requests.filter(r => r.status === 'DELIVERED');
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');

  const handleVerifyClick = (req) => {
    setCurrentReq(req);
    setModalState('scanning');
    setScanStep(0);
    setAiResult(null);

    // Step through scan messages
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          const result = analyzeItem(req.category, req.weight);
          setAiResult(result);
          setModalState('result');
          setActiveTab('reusable');
        }, 600);
      }
    }, 480);
  };

  const confirmAndProcess = () => {
    if (currentReq && aiResult) {
      processRequest(currentReq.id, aiResult);
    }
    setModalState('closed');
    setCurrentReq(null);
    setAiResult(null);
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div style={{ maxWidth: 1000 }}>
      <motion.div className="profile-header" style={{ marginBottom: 40 }} variants={itemVariants} initial="hidden" animate="show">
        <ProfileAvatar size={52} />
        <div className="profile-text">
          <h2 style={{ fontSize: 24 }}>Hi, {authProfile.name} 👋</h2>
          <p style={{ fontSize: 15 }}>{authProfile.companyName || 'Let\'s build a sustainable future!'}</p>
        </div>
      </motion.div>

      <motion.div className="credit-card" style={{ background: '#3B82F6' }} variants={itemVariants} initial="hidden" animate="show">
        <div>
          <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>Total E-waste Processed</h3>
          <div className="balance" style={{ fontSize: 40 }}>{recyclerProfile.processedTons.toFixed(2)} Tons</div>
        </div>
        <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {deliveredRequests.length > 0 && (
          <>
            <motion.h3 variants={itemVariants} style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>
              Awaiting AI Verification
            </motion.h3>
            <motion.div variants={itemVariants} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {deliveredRequests.map(req => (
                <div className="list-item" style={{ padding: '20px 24px' }} key={req.id}>
                  <div className="list-item-info">
                    <p style={{ fontSize: 12, color: '#6B7280' }}>{req.id}</p>
                    <h4 style={{ fontSize: 16 }}>{req.category} ({req.weight} kg)</h4>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{req.location}</p>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: 'auto', padding: '8px 16px', fontSize: 13, backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => handleVerifyClick(req)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                    INTEGRITY AI
                  </button>
                </div>
              ))}
            </motion.div>
          </>
        )}

        <motion.div variants={itemVariants} className="list-header" style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 18 }}>Recent Receipts (Completed)</h3>
          <Link to="/recycler/reports">View All</Link>
        </motion.div>

        <motion.div variants={itemVariants} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {completedRequests.length === 0 ? (
            <div style={{ padding: '20px 24px', color: '#6B7280' }}>No recent receipts.</div>
          ) : (
            completedRequests.slice(0, 5).map(req => (
              <div className="list-item" style={{ padding: '20px 24px' }} key={req.id}>
                <div className="list-item-info">
                  <p style={{ fontSize: 12, color: '#6B7280' }}>{req.id}</p>
                  <h4 style={{ fontSize: 16 }}>{req.category}</h4>
                  {req.aiAnalysis && (
                    <div style={{ fontSize: 11, color: req.aiAnalysis.qualityColor, fontWeight: 600, marginTop: 2 }}>
                      AI: {req.aiAnalysis.qualityLabel} · {req.aiAnalysis.reusableComponents?.length || 0} reusable parts
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#10B981', fontSize: 14, fontWeight: 700 }}>+{req.ccAwarded} CC</div>
                  <div style={{ color: '#6B7280', fontSize: 13 }}>
                    {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* ── INTEGRITY AI MODAL ── */}
      <AnimatePresence>
        {modalState !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)', padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'white', borderRadius: 24, width: '100%', maxWidth: 540,
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)',
                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{ background: 'linear-gradient(135deg, #1E3A5F, #1D4ED8)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <motion.div
                  animate={modalState === 'scanning' ? { rotate: 360 } : { rotate: 0 }}
                  transition={modalState === 'scanning' ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}
                  style={{ fontSize: 24 }}
                >🤖</motion.div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Integrity AI Engine</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                    {modalState === 'scanning' ? 'Deep component analysis in progress...' : `Analysis complete for ${currentReq?.category}`}
                  </div>
                </div>
              </div>

              <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                {/* ── SCANNING STATE ── */}
                {modalState === 'scanning' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: 100, height: 100, margin: '20px auto 24px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                          style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: '2px solid #3B82F6', opacity: 0.4
                          }}
                        />
                      ))}
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 36
                      }}>🔬</div>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Scanning {currentReq?.category}</h3>
                    <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>{SCAN_STEPS[scanStep]}</p>

                    <div style={{ textAlign: 'left' }}>
                      {SCAN_STEPS.map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: i < scanStep ? '#10B981' : i === scanStep ? '#3B82F6' : '#E5E7EB',
                            fontSize: 11, color: 'white', fontWeight: 700, transition: 'background 0.3s'
                          }}>
                            {i < scanStep ? '✓' : i + 1}
                          </div>
                          <span style={{ fontSize: 13, color: i <= scanStep ? '#111827' : '#9CA3AF', transition: 'color 0.3s' }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── RESULT STATE ── */}
                {modalState === 'result' && aiResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Quality score */}
                    <div style={{
                      background: '#F9FAFB', border: `2px solid ${aiResult.qualityColor}30`,
                      borderRadius: 16, padding: 16, marginBottom: 20
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Overall Quality Assessment</span>
                        <span style={{
                          fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                          background: aiResult.qualityColor + '20', color: aiResult.qualityColor
                        }}>{aiResult.qualityLabel}</span>
                      </div>
                      <QualityBar score={aiResult.overallQuality} color={aiResult.qualityColor} />
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
                        {aiResult.overallQuality}% material recovery potential · {aiResult.totalComponents} components analyzed
                      </div>
                    </div>

                    {/* E-token suggestion */}
                    <div style={{
                      background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1px solid #BBF7D0',
                      borderRadius: 16, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                          Suggested E-Tokens (Carbon Credits)
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#15803D' }}>+{aiResult.suggestedCC} CC</div>
                      </div>
                      <div style={{ fontSize: 32 }}>🌿</div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      {['reusable', 'recycle'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                          flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          background: activeTab === tab ? '#3B82F6' : '#F3F4F6',
                          color: activeTab === tab ? 'white' : '#6B7280',
                          transition: 'all 0.2s'
                        }}>
                          {tab === 'reusable' ? `♻️ Reusable (${aiResult.reusableComponents.length})` : `🔩 Recycle (${aiResult.recycleComponents.length})`}
                        </button>
                      ))}
                    </div>

                    {/* Component list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(activeTab === 'reusable' ? aiResult.reusableComponents : aiResult.recycleComponents).map((comp, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            background: '#F9FAFB', borderRadius: 10, padding: '10px 14px',
                            border: `1px solid ${activeTab === 'reusable' ? '#BBF7D0' : '#FED7AA'}`
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{comp.name}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{comp.type}</div>
                            </div>
                            <div style={{
                              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                              background: comp.score >= 70 ? '#DCFCE7' : comp.score >= 40 ? '#FEF9C3' : '#FEE2E2',
                              color: comp.score >= 70 ? '#15803D' : comp.score >= 40 ? '#92400E' : '#DC2626'
                            }}>{comp.condition}</div>
                          </div>
                          {comp.market && (
                            <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 4 }}>📦 {comp.market}</div>
                          )}
                          {comp.recycleNote && (
                            <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 4 }}>⚙️ {comp.recycleNote}</div>
                          )}
                        </motion.div>
                      ))}

                      {activeTab === 'reusable' && aiResult.reusableComponents.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#9CA3AF', padding: 20, fontSize: 13 }}>
                          No reusable components detected for this item.
                        </div>
                      )}
                    </div>

                    <button
                      className="btn-primary"
                      onClick={confirmAndProcess}
                      style={{ marginTop: 24, backgroundColor: '#3B82F6', fontSize: 15, padding: 14 }}
                    >
                      ✅ CONFIRM & ISSUE {aiResult.suggestedCC} CC TOKENS
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
