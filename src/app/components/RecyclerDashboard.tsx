'use client';

import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Recycle, Leaf } from 'lucide-react';
import RecyclerQueue from './RecyclerQueue';
import WalletCard from './WalletCard';

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

export default function RecyclerDashboard() {
  return (
    <motion.div
      key="recycler"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30 }}
      className="space-y-6"
    >
      {/* Role Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl px-5 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.06), rgba(0, 191, 255, 0.02))',
          border: '1px solid rgba(0, 191, 255, 0.15)',
        }}
      >
        <Cpu size={16} style={{ color: '#00BFFF' }} />
        <div>
          <span className="text-sm font-semibold" style={{ color: '#00BFFF' }}>
            Certified Recycler Dashboard
          </span>
          <span className="text-xs ml-2" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
            — The Final Node. Verify, extract, and mint consumer rewards.
          </span>
        </div>
      </motion.div>

      {/* Info cards row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            icon: <ShieldCheck size={20} style={{ color: '#00FF66' }} />,
            title: 'Smart Contract',
            desc: 'ERC-20 CCT auto-minting on verified extraction',
            color: '#00FF66',
            border: 'rgba(0, 255, 102, 0.2)',
            bg: 'rgba(0, 255, 102, 0.05)',
          },
          {
            icon: <Recycle size={20} style={{ color: '#00BFFF' }} />,
            title: 'Metal Recovery',
            desc: 'Au, Cu, Ag extracted via certified protocols',
            color: '#00BFFF',
            border: 'rgba(0, 191, 255, 0.2)',
            bg: 'rgba(0, 191, 255, 0.05)',
          },
          {
            icon: <Leaf size={20} style={{ color: '#a78bfa' }} />,
            title: 'Carbon Credits',
            desc: '50 CCT minted per verified device recycled',
            color: '#a78bfa',
            border: 'rgba(167, 139, 250, 0.2)',
            bg: 'rgba(167, 139, 250, 0.05)',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex items-start gap-3 transition-all duration-300"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'none';
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${card.border.replace('0.2', '0.1')}` }}
            >
              {card.icon}
            </div>
            <div>
              <div className="font-semibold text-sm mb-0.5" style={{ color: card.color }}>
                {card.title}
              </div>
              <div className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)', lineHeight: 1.5 }}>
                {card.desc}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main grid: Queue + Wallet */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecyclerQueue />
        </div>
        <div className="lg:col-span-1">
          <WalletCard />
        </div>
      </motion.div>
    </motion.div>
  );
}
