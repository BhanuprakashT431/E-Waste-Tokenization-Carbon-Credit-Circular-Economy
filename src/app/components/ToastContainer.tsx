'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="toast mb-3"
            style={{ pointerEvents: 'all' }}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 size={18} style={{ color: '#00FF66' }} />
                ) : (
                  <Info size={18} style={{ color: '#00BFFF' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {toast.cct && (
                  <div
                    className="text-xs font-mono mb-1"
                    style={{ color: 'rgba(0, 255, 102, 0.6)', letterSpacing: '1px' }}
                  >
                    ⬡ SMART CONTRACT EXECUTED
                  </div>
                )}
                <p className="text-sm font-medium" style={{ color: '#e2e8f0', lineHeight: 1.4 }}>
                  {toast.message}
                </p>
                {toast.cct && (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xl font-bold"
                      style={{ color: '#00FF66', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      +{toast.cct}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(0, 255, 102, 0.7)' }}>
                      CCT Minted
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: 'rgba(148, 163, 184, 0.6)' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 rounded-full origin-left"
              style={{
                width: '100%',
                background: toast.type === 'success'
                  ? 'linear-gradient(90deg, #00FF66, #00cc52)'
                  : 'linear-gradient(90deg, #00BFFF, #0099cc)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
