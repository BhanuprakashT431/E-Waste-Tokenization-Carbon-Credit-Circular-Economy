'use client';

import { motion } from 'framer-motion';
import { Cpu, Leaf } from 'lucide-react';
import { UserRole, useApp } from '../context/AppContext';

export default function RoleToggle() {
  const { activeRole, switchRole } = useApp();

  return (
    <div className="flex items-center gap-4">
      <span
        className="text-xs font-semibold tracking-widest uppercase transition-all duration-300"
        style={{
          color: activeRole === 'consumer'
            ? '#00FF66'
            : 'rgba(148, 163, 184, 0.4)',
          fontFamily: 'JetBrains Mono, monospace',
          textShadow: activeRole === 'consumer'
            ? '0 0 10px rgba(0, 255, 102, 0.5)'
            : 'none',
        }}
      >
        Consumer
      </span>

      {/* Toggle Track */}
      <button
        onClick={() => switchRole(activeRole === 'consumer' ? 'recycler' : 'consumer')}
        className="relative flex items-center"
        style={{
          width: '64px',
          height: '32px',
          background: 'rgba(10, 18, 38, 0.9)',
          border: '1px solid rgba(0, 255, 102, 0.25)',
          borderRadius: '50px',
          cursor: 'pointer',
          padding: '3px',
          outline: 'none',
        }}
        aria-label="Toggle role"
      >
        {/* Thumb */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: activeRole === 'consumer'
              ? 'linear-gradient(135deg, #00FF66, #00cc52)'
              : 'linear-gradient(135deg, #00BFFF, #0099cc)',
            boxShadow: activeRole === 'consumer'
              ? '0 0 12px rgba(0, 255, 102, 0.6)'
              : '0 0 12px rgba(0, 191, 255, 0.6)',
            marginLeft: activeRole === 'recycler' ? 'auto' : '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {activeRole === 'consumer' ? (
            <Leaf size={12} color="#000" />
          ) : (
            <Cpu size={12} color="#000" />
          )}
        </motion.div>
      </button>

      <span
        className="text-xs font-semibold tracking-widest uppercase transition-all duration-300"
        style={{
          color: activeRole === 'recycler'
            ? '#00BFFF'
            : 'rgba(148, 163, 184, 0.4)',
          fontFamily: 'JetBrains Mono, monospace',
          textShadow: activeRole === 'recycler'
            ? '0 0 10px rgba(0, 191, 255, 0.5)'
            : 'none',
        }}
      >
        Recycler
      </span>
    </div>
  );
}
