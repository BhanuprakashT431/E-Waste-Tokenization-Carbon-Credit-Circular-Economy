import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecyclerDashboard() {
  const { recyclerProfile, requests, processRequest } = useAppContext();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationState, setVerificationState] = useState('idle'); // idle, analyzing, success
  const [currentReq, setCurrentReq] = useState(null);

  const deliveredRequests = requests.filter(r => r.status === 'DELIVERED');
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');

  const handleVerifyClick = (req) => {
    setCurrentReq(req);
    setIsVerifying(true);
    setVerificationState('analyzing');
    
    // Simulate AI Verification
    setTimeout(() => {
      setVerificationState('success');
    }, 2500);
  };

  const confirmAndProcess = () => {
    if (currentReq) {
      processRequest(currentReq.id);
    }
    setIsVerifying(false);
    setVerificationState('idle');
    setCurrentReq(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{maxWidth: 1000}}>
      <motion.div className="profile-header" style={{marginBottom: 40}} variants={itemVariants} initial="hidden" animate="show">
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?u=ecoprocess" alt="Profile" />
        </div>
        <div className="profile-text">
          <h2 style={{fontSize: 24}}>Hi, {recyclerProfile.name}</h2>
          <p style={{fontSize: 15}}>Let's build a sustainable future!</p>
        </div>
      </motion.div>

      <motion.div className="credit-card" style={{background: '#3B82F6'}} variants={itemVariants} initial="hidden" animate="show">
        <div>
          <h3 style={{color: 'rgba(255,255,255,0.9)', fontSize: 16}}>Total E-waste Processed</h3>
          <div className="balance" style={{fontSize: 40}}>{recyclerProfile.processedTons.toFixed(2)} Tons</div>
        </div>
        <div style={{width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {deliveredRequests.length > 0 && (
          <>
            <motion.h3 variants={itemVariants} style={{fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32}}>Awaiting Processing</motion.h3>
            <motion.div variants={itemVariants} className="card" style={{padding: 0, overflow: 'hidden'}}>
              {deliveredRequests.map(req => (
                <div className="list-item" style={{padding: '20px 24px'}} key={req.id}>
                  <div className="list-item-info">
                    <p style={{fontSize: 12, color: '#6B7280'}}>{req.id}</p>
                    <h4 style={{fontSize: 16}}>{req.category} ({req.weight} kg)</h4>
                  </div>
                  <button 
                    className="btn-primary" 
                    style={{width: 'auto', padding: '8px 16px', fontSize: 13, backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', gap: 6}}
                    onClick={() => handleVerifyClick(req)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                    INTEGRITY AI VERIFY
                  </button>
                </div>
              ))}
            </motion.div>
          </>
        )}

        <motion.div variants={itemVariants} className="list-header" style={{marginTop: 40}}>
          <h3 style={{fontSize: 18}}>Recent Receipts (Completed)</h3>
          <Link to="/recycler/reports">View All</Link>
        </motion.div>

        <motion.div variants={itemVariants} className="card" style={{padding: 0, overflow: 'hidden'}}>
          {completedRequests.length === 0 ? (
            <div style={{padding: '20px 24px', color: '#6B7280'}}>No recent receipts.</div>
          ) : (
            completedRequests.slice(0, 5).map(req => (
              <div className="list-item" style={{padding: '20px 24px'}} key={req.id}>
                <div className="list-item-info">
                  <p style={{fontSize: 12, color: '#6B7280'}}>{req.id}</p>
                  <h4 style={{fontSize: 16}}>{req.category}</h4>
                </div>
                <div style={{color: '#6B7280', fontSize: 14}}>
                  {new Date(req.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* Integrity AI Modal Overlay */}
      <AnimatePresence>
        {isVerifying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'white', padding: 32, borderRadius: 24, width: '90%', maxWidth: 400, 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center'
              }}
            >
              <div style={{width: 64, height: 64, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                {verificationState === 'analyzing' ? (
                  <motion.svg animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></motion.svg>
                ) : (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></motion.svg>
                )}
              </div>
              
              <h3 style={{fontSize: 20, fontWeight: 700, marginBottom: 8}}>
                {verificationState === 'analyzing' ? 'Integrity AI Analyzing...' : 'Verification Complete'}
              </h3>
              
              <p style={{color: '#6B7280', fontSize: 15, marginBottom: 24, lineHeight: 1.5}}>
                {verificationState === 'analyzing' 
                  ? `Scanning components of ${currentReq?.category} to determine material recovery and carbon offsets.` 
                  : `Successfully verified. Expected material recovery and ESG impact calculated.`}
              </p>

              {verificationState === 'success' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{background: '#F0FDF4', border: '1px solid #BBF7D0', padding: 16, borderRadius: 12, marginBottom: 24}}>
                  <span style={{display: 'block', fontSize: 12, color: '#166534', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4}}>Suggested E-Tokens</span>
                  <span style={{fontSize: 24, fontWeight: 700, color: '#15803D'}}>+{(currentReq?.weight * 10).toFixed(1)} CC</span>
                </motion.div>
              )}

              {verificationState === 'success' && (
                <button 
                  className="btn-primary" 
                  style={{width: '100%', padding: '14px', backgroundColor: '#3B82F6', fontSize: 15}}
                  onClick={confirmAndProcess}
                >
                  CONFIRM & ISSUE TOKENS
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
