'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Zap, Copy, Check, Wind } from 'lucide-react';
import { useApp } from '../context/AppContext';

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = target;
    if (prev === target) return;

    const start = prev;
    const diff = target - start;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function WalletCard() {
  const { walletBalance, walletAddress, ewasteLedger, totalCO2Offset, totalItemsProcessed } = useApp();
  const displayBalance = useCountUp(walletBalance);
  const [copied, setCopied] = useState(false);

  const extractedCount = ewasteLedger.filter(i => i.status === 'Extracted/Rewarded').length;
  const pendingCount = ewasteLedger.filter(i => i.status === 'Pending').length;

  const shortAddress = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 25, 15, 0.85), rgba(5, 18, 35, 0.9))',
        border: '1px solid rgba(0, 255, 102, 0.25)',
        borderRadius: '20px',
        padding: '28px',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* BG decorations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(0, 255, 102, 0.06), transparent)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 191, 255, 0.04), transparent)',
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Animated ring */}
      <div
        className="absolute animate-glow-ring pointer-events-none"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(0, 255, 102, 0.08)',
          top: '-40px',
          right: '-40px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{
                background: 'rgba(0, 255, 102, 0.1)',
                border: '1px solid rgba(0, 255, 102, 0.25)',
              }}
            >
              <Wallet size={18} style={{ color: '#00FF66' }} />
            </div>
            <div>
              <div className="section-tag">Carbon Credit Wallet</div>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 mt-1 hover:opacity-80 transition-opacity"
              >
                <span className="hash-text">{shortAddress}</span>
                {copied ? (
                  <Check size={12} style={{ color: '#00FF66' }} />
                ) : (
                  <Copy size={12} style={{ color: 'rgba(148, 163, 184, 0.4)' }} />
                )}
              </button>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(0, 255, 102, 0.08)',
              border: '1px solid rgba(0, 255, 102, 0.2)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#00FF66', boxShadow: '0 0 6px rgba(0,255,102,0.8)' }}
            />
            <span className="text-xs font-medium" style={{ color: '#00FF66' }}>LIVE</span>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(148, 163, 184, 0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
            Available Balance
          </div>
          <div className="flex items-end gap-3">
            <motion.span
              key={displayBalance}
              className="neon-text"
              style={{
                fontSize: '3.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              {displayBalance.toLocaleString()}
            </motion.span>
            <div className="mb-2">
              <div className="text-sm font-bold" style={{ color: 'rgba(0, 255, 102, 0.7)' }}>CCT</div>
              <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>Carbon Credit Token</div>
            </div>
          </div>

          {/* USD equivalent */}
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp size={12} style={{ color: '#00BFFF' }} />
            <span className="text-sm" style={{ color: 'rgba(0, 191, 255, 0.7)' }}>
              ≈ ${(displayBalance * 2.34).toFixed(2)} USD
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(0, 255, 102, 0.1)',
                color: '#00FF66',
                border: '1px solid rgba(0, 255, 102, 0.2)',
              }}
            >
              +12.3%
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="cyber-divider" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <Zap size={14} />, label: 'Items Processed', value: totalItemsProcessed, color: '#00FF66' },
            { icon: <Wind size={14} />, label: 'CO₂ Offset', value: `${totalCO2Offset} kg`, color: '#00BFFF', isStr: true },
            { icon: <TrendingUp size={14} />, label: 'Rewarded', value: extractedCount, color: '#a78bfa' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="flex items-center justify-center gap-1 mb-1"
                style={{ color: stat.color, opacity: 0.8 }}
              >
                {stat.icon}
              </div>
              <div
                className="font-bold text-lg"
                style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
