'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, GitBranch, Bell, Settings } from 'lucide-react';
import { useApp } from './context/AppContext';
import RoleToggle from './components/RoleToggle';
import ConsumerDashboard from './components/ConsumerDashboard';
import RecyclerDashboard from './components/RecyclerDashboard';
import ToastContainer from './components/ToastContainer';

export default function HomePage() {
  const { activeRole, walletBalance } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: '#070b12', fontFamily: 'Inter, sans-serif' }}>
      {/* Background layers */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-radial-green pointer-events-none" />
      <div className="fixed inset-0 bg-radial-blue pointer-events-none" />

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(7, 11, 18, 0.85)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(0, 255, 102, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.2), rgba(0, 191, 255, 0.1))',
                border: '1px solid rgba(0, 255, 102, 0.3)',
                boxShadow: '0 0 15px rgba(0, 255, 102, 0.15)',
              }}
            >
              <Leaf size={18} style={{ color: '#00FF66' }} />
            </div>
            <div>
              <span
                className="shimmer-text font-bold text-sm"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.3px' }}
              >
                EcoChain
              </span>
              <span className="text-xs ml-1.5" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
                Protocol
              </span>
            </div>
          </div>

          {/* Center: Role Toggle */}
          <div className="hidden md:flex items-center gap-6">
            <RoleToggle />
          </div>

          {/* Right: Wallet + Icons */}
          <div className="flex items-center gap-4">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0, 255, 102, 0.08)',
                border: '1px solid rgba(0, 255, 102, 0.2)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FF66', boxShadow: '0 0 6px #00FF66' }} />
              <span className="text-xs font-bold" style={{ color: '#00FF66', fontFamily: 'Space Grotesk, sans-serif' }}>
                {walletBalance.toLocaleString()} CCT
              </span>
            </div>

            {[<Bell size={16} key="bell" />, <Settings size={16} key="settings" />].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                style={{
                  color: 'rgba(148, 163, 184, 0.5)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#00FF66';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(148, 163, 184, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile role toggle */}
        <div className="md:hidden border-t px-6 py-3 flex justify-center"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <RoleToggle />
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="section-tag">E-Waste Tokenization</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>·</span>
            <span className="section-tag" style={{ color: 'rgba(0, 191, 255, 0.6)' }}>
              Carbon Credit Circular Economy
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#e2e8f0',
              letterSpacing: '-0.5px',
            }}
          >
            {activeRole === 'consumer' ? (
              <>Origin Node <span className="neon-text">Dashboard</span></>
            ) : (
              <>Certified Recycler <span className="neon-text-blue">Terminal</span></>
            )}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
            {activeRole === 'consumer'
              ? 'Register e-waste, mint tracking hashes, earn Carbon Credit Tokens when your device reaches a certified recycler.'
              : 'Verify incoming e-waste shipments, execute smart contracts, mint CCT rewards to consumer wallets.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeRole === 'consumer' ? (
            <ConsumerDashboard key="consumer" />
          ) : (
            <RecyclerDashboard key="recycler" />
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer
        className="relative z-10 border-t mt-16"
        style={{
          borderColor: 'rgba(0, 255, 102, 0.06)',
          background: 'rgba(7, 11, 18, 0.6)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf size={14} style={{ color: '#00FF66' }} />
            <span className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
              EcoChain Protocol · E-Waste Tokenization Platform
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono" style={{ color: 'rgba(0, 255, 102, 0.4)' }}>
              Network: Ethereum Mainnet
            </span>
            <span className="text-xs font-mono" style={{ color: 'rgba(0, 191, 255, 0.4)' }}>
              Block #21,847,392
            </span>
            <a
              href="https://github.com/BhanuprakashT431/E-Waste-Tokenization-Carbon-Credit-Circular-Economy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'rgba(148, 163, 184, 0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00FF66')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148, 163, 184, 0.4)')}
            >
              <GitBranch size={12} />
              <span>Source</span>
            </a>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
