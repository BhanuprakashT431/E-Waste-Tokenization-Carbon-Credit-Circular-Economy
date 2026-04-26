'use client';

import { motion } from 'framer-motion';
import { Leaf, Cpu, BarChart2, TrendingUp } from 'lucide-react';
import WalletCard from './WalletCard';
import RegisterEWasteForm from './RegisterEWasteForm';
import LedgerTable from './LedgerTable';
import { useApp } from '../context/AppContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ConsumerDashboard() {
  const { ewasteLedger } = useApp();

  const inTransit = ewasteLedger.filter(i => i.status === 'In Transit').length;
  const pending = ewasteLedger.filter(i => i.status === 'Pending').length;
  const rewarded = ewasteLedger.filter(i => i.status === 'Extracted/Rewarded').length;

  return (
    <motion.div
      key="consumer"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Role Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl px-5 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.06), rgba(0, 255, 102, 0.02))',
          border: '1px solid rgba(0, 255, 102, 0.15)',
        }}
      >
        <Leaf size={16} style={{ color: '#00FF66' }} />
        <div>
          <span className="text-sm font-semibold" style={{ color: '#00FF66' }}>
            Consumer Dashboard
          </span>
          <span className="text-xs ml-2" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
            — The Origin Node. Register, track, and earn CCT rewards.
          </span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.2)' },
          { label: 'In Transit', value: inTransit, color: '#00BFFF', bg: 'rgba(0, 191, 255, 0.08)', border: 'rgba(0, 191, 255, 0.2)' },
          { label: 'Rewarded', value: rewarded, color: '#00FF66', bg: 'rgba(0, 255, 102, 0.08)', border: 'rgba(0, 255, 102, 0.2)' },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <div className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>
              {s.value}
            </div>
            <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Wallet + Register Form */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <WalletCard />
        </div>
        <div className="lg:col-span-2">
          <RegisterEWasteForm />
        </div>
      </motion.div>

      {/* Ledger Table */}
      <motion.div variants={itemVariants}>
        <LedgerTable />
      </motion.div>
    </motion.div>
  );
}
