import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onSelectRole }) {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="hero-badge">
            <span className="dot green"></span> Live on Blockchain
          </motion.div>
          <motion.h1 variants={fadeIn} className="hero-title">
            Tokenize E-Waste.<br/> 
            <span className="text-gradient">Offset Carbon.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="hero-desc">
            The immutable ledger for the circular economy. Register your electronics, ensure sustainable recycling, and earn Carbon Credit Tokens (CCT).
          </motion.p>
          <motion.div variants={fadeIn} className="hero-scroll-indicator">
            <span>Scroll to Discover</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </motion.div>
        </motion.div>
      </section>

      {/* INFO SECTION */}
      <section className="info-section">
        <motion.div 
          className="info-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="info-card">
            <div className="info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>Immutable Tracking</h3>
            <p>Every registered device is securely tracked on-chain, from the moment of registration to material extraction.</p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="info-card">
            <div className="info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8l-4 4-4-4"></path><path d="M12 16v-4"></path></svg>
            </div>
            <h3>Carbon Credit Minting</h3>
            <p>Upon verified recycling, smart contracts automatically mint and distribute Carbon Credit Tokens directly to your wallet.</p>
          </motion.div>

          <motion.div variants={fadeIn} className="info-card">
            <div className="info-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Enterprise Verification</h3>
            <p>Certified recyclers rigorously verify hardware attributes, ensuring full transparency in the circular supply chain.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* LOGIN / ROLE SELECTION */}
      <section className="role-selection-section">
        <motion.div 
          className="role-selection-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeIn} className="section-title text-center">Enter the Protocol</motion.h2>
          <motion.p variants={fadeIn} className="section-desc text-center" style={{marginBottom: '40px'}}>
            Select your network role to interact with the ledger.
          </motion.p>
          
          <div className="role-cards-wrapper">
            <motion.div 
              variants={fadeIn} 
              className="role-action-card"
              onClick={() => onSelectRole('consumer')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="role-action-icon consumer-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h3 className="role-action-title">Consumer</h3>
              <p className="role-action-desc">Register your personal electronics, track the asset lifecycle, and earn CCT rewards.</p>
              <div className="role-action-btn">Login as Consumer</div>
            </motion.div>

            <motion.div 
              variants={fadeIn} 
              className="role-action-card"
              onClick={() => onSelectRole('recycler')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="role-action-icon recycler-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="role-action-title">Recycler</h3>
              <p className="role-action-desc">Verify incoming e-waste shipments, extract materials, and trigger smart contracts.</p>
              <div className="role-action-btn recycler">Login as Recycler</div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
