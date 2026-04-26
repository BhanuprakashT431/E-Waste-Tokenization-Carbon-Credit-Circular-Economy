'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ExternalLink, ArrowUpRight, Send } from 'lucide-react';
import { useApp, EWasteItem } from '../context/AppContext';

function StatusPill({ status }: { status: EWasteItem['status'] }) {
  if (status === 'Pending') return <span className="pill-pending">Pending</span>;
  if (status === 'In Transit') return <span className="pill-transit">In Transit</span>;
  return <span className="pill-extracted">Extracted ✓</span>;
}

function DeviceTypeIcon({ deviceType }: { deviceType: EWasteItem['deviceType'] }) {
  const icons: Record<EWasteItem['deviceType'], string> = {
    Laptop: '💻', Smartphone: '📱', Battery: '🔋',
    Desktop: '🖥️', Tablet: '📟', Server: '🖧',
  };
  return <span>{icons[deviceType] || '⚡'}</span>;
}

export default function LedgerTable() {
  const { ewasteLedger, sendToRecycler } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass"
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(0, 191, 255, 0.1)', border: '1px solid rgba(0, 191, 255, 0.2)' }}
          >
            <ClipboardList size={16} style={{ color: '#00BFFF' }} />
          </div>
          <div>
            <div className="section-tag" style={{ color: '#00BFFF' }}>E-Waste Ledger</div>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
              {ewasteLedger.length} device{ewasteLedger.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(0, 191, 255, 0.08)',
            border: '1px solid rgba(0, 191, 255, 0.2)',
            color: '#00BFFF',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00BFFF' }} />
          On-Chain
        </div>
      </div>

      {ewasteLedger.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
          <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No devices registered yet</p>
          <p className="text-xs mt-1">Register your first e-waste item above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Cryptographic Hash</th>
                <th>Date</th>
                <th>CO₂ Offset</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {ewasteLedger.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <DeviceTypeIcon deviceType={item.deviceType} />
                        <div>
                          <div className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                            {item.device}
                          </div>
                          <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
                            {item.deviceType} · {item.weight} kg
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="hash-text">{item.hash.slice(0, 18)}...</span>
                        <ExternalLink size={11} style={{ color: 'rgba(0, 191, 255, 0.4)', cursor: 'pointer' }} />
                      </div>
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                        {item.dateRegistered}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium" style={{ color: '#00BFFF' }}>
                        {item.co2Offset}
                      </span>
                    </td>
                    <td>
                      <StatusPill status={item.status} />
                    </td>
                    <td>
                      {item.status === 'Pending' && (
                        <button
                          onClick={() => sendToRecycler(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: 'rgba(0, 191, 255, 0.08)',
                            border: '1px solid rgba(0, 191, 255, 0.25)',
                            color: '#00BFFF',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0, 191, 255, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(0, 191, 255, 0.5)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(0, 191, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(0, 191, 255, 0.25)';
                          }}
                        >
                          <Send size={11} />
                          Dispatch
                        </button>
                      )}
                      {item.status === 'In Transit' && (
                        <span className="flex items-center gap-1 text-xs"
                          style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
                          <ArrowUpRight size={12} />
                          In Transit
                        </span>
                      )}
                      {item.status === 'Extracted/Rewarded' && (
                        <span className="text-xs" style={{ color: 'rgba(0, 255, 102, 0.5)' }}>
                          ✓ Rewarded
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
