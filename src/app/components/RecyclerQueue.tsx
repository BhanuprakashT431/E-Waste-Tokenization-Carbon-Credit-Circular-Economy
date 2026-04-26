'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Loader2, CheckCircle2, Zap, BarChart2, Activity } from 'lucide-react';
import { useApp, EWasteItem } from '../context/AppContext';

function SmartContractOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10"
      style={{
        background: 'rgba(5, 15, 10, 0.92)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(0, 255, 102, 0.2)',
              animation: 'spin-slow 3s linear infinite',
            }}
          />
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: '2px solid rgba(0, 191, 255, 0.3)',
              animation: 'spin-slow 2s linear infinite reverse',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck size={20} style={{ color: '#00FF66' }} />
          </div>
        </div>
        <div className="section-tag mb-1">Smart Contract</div>
        <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>
          Validating on blockchain...
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#00FF66' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RecyclerQueueItem({ item }: { item: EWasteItem }) {
  const { verifyAndExtract } = useApp();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    await verifyAndExtract(item.id);
    setLoading(false);
  };

  const deviceIcons: Record<string, string> = {
    Laptop: '💻', Smartphone: '📱', Battery: '🔋',
    Desktop: '🖥️', Tablet: '📟', Server: '🖧',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'rgba(10, 20, 45, 0.6)',
        border: '1px solid rgba(0, 191, 255, 0.12)',
        padding: '16px',
      }}
    >
      <SmartContractOverlay visible={loading} />

      <div className="flex items-start justify-between gap-4">
        {/* Left: device info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-lg"
            style={{ background: 'rgba(0, 191, 255, 0.08)', border: '1px solid rgba(0, 191, 255, 0.15)' }}
          >
            {deviceIcons[item.deviceType] || '⚡'}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm mb-0.5" style={{ color: '#e2e8f0' }}>
              {item.device}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                {item.deviceType}
              </span>
              <span className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                {item.weight} kg
              </span>
              <span className="text-xs font-medium" style={{ color: '#00BFFF' }}>
                ~{item.co2Offset} CO₂
              </span>
            </div>
            <div className="hash-text text-xs mt-1 truncate" style={{ maxWidth: '240px' }}>
              {item.hash.slice(0, 26)}...
            </div>
          </div>
        </div>

        {/* Right: reward + action */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>Reward</div>
            <div
              className="text-lg font-bold"
              style={{ color: '#00FF66', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              +50 CCT
            </div>
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: loading ? 'rgba(0, 255, 102, 0.05)' : 'linear-gradient(135deg, rgba(0, 255, 102, 0.15), rgba(0, 255, 102, 0.05))',
              border: `1px solid ${loading ? 'rgba(0, 255, 102, 0.15)' : 'rgba(0, 255, 102, 0.4)'}`,
              color: loading ? 'rgba(0, 255, 102, 0.5)' : '#00FF66',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '160px',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 102, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.7)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = loading ? 'rgba(0, 255, 102, 0.15)' : 'rgba(0, 255, 102, 0.4)';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Verify & Extract</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecyclerQueue() {
  const { ewasteLedger } = useApp();
  const inTransit = ewasteLedger.filter(i => i.status === 'In Transit');
  const extracted = ewasteLedger.filter(i => i.status === 'Extracted/Rewarded');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: <Truck size={18} style={{ color: '#00BFFF' }} />,
            label: 'In Queue',
            value: inTransit.length,
            color: '#00BFFF',
            bg: 'rgba(0, 191, 255, 0.08)',
            border: 'rgba(0, 191, 255, 0.2)',
          },
          {
            icon: <CheckCircle2 size={18} style={{ color: '#00FF66' }} />,
            label: 'Processed',
            value: extracted.length,
            color: '#00FF66',
            bg: 'rgba(0, 255, 102, 0.08)',
            border: 'rgba(0, 255, 102, 0.2)',
          },
          {
            icon: <Zap size={18} style={{ color: '#a78bfa' }} />,
            label: 'CCT Minted',
            value: extracted.length * 50,
            color: '#a78bfa',
            bg: 'rgba(167, 139, 250, 0.08)',
            border: 'rgba(167, 139, 250, 0.2)',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl p-4 text-center"
            style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div
              className="text-2xl font-bold"
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

      {/* Queue Panel */}
      <div
        className="rounded-2xl"
        style={{
          background: 'rgba(10, 18, 40, 0.6)',
          border: '1px solid rgba(0, 191, 255, 0.12)',
          padding: '24px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(0, 191, 255, 0.1)', border: '1px solid rgba(0, 191, 255, 0.2)' }}
            >
              <Activity size={16} style={{ color: '#00BFFF' }} />
            </div>
            <div>
              <div className="section-tag" style={{ color: '#00BFFF' }}>Incoming Shipment Queue</div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                Devices awaiting verification & metal extraction
              </p>
            </div>
          </div>
          {inTransit.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0, 191, 255, 0.1)',
                border: '1px solid rgba(0, 191, 255, 0.3)',
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00BFFF' }} />
              <span className="text-xs font-bold" style={{ color: '#00BFFF' }}>
                {inTransit.length} Pending
              </span>
            </div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {inTransit.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
              style={{ color: 'rgba(148, 163, 184, 0.3)' }}
            >
              <Truck size={40} className="mx-auto mb-3" style={{ opacity: 0.2 }} />
              <p className="text-sm font-medium">Queue is empty</p>
              <p className="text-xs mt-1">
                No devices in transit. Consumer must dispatch items first.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {inTransit.map(item => (
                <RecyclerQueueItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Processed History */}
      {extracted.length > 0 && (
        <div
          className="rounded-2xl"
          style={{
            background: 'rgba(8, 20, 12, 0.5)',
            border: '1px solid rgba(0, 255, 102, 0.1)',
            padding: '24px',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 size={16} style={{ color: '#00FF66' }} />
            <div className="section-tag">Processed History</div>
          </div>
          <div className="space-y-2">
            {extracted.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ background: 'rgba(0, 255, 102, 0.04)', border: '1px solid rgba(0, 255, 102, 0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: '#00FF66' }} />
                  <span className="text-sm" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                    {item.device}
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: '#00FF66' }}>+50 CCT</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
