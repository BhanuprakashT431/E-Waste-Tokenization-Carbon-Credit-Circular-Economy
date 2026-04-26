'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Battery, Monitor, Tablet, Server,
         PlusCircle, Hash, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { useApp, EWasteItem } from '../context/AppContext';

const DEVICE_TYPES: { value: EWasteItem['deviceType']; label: string; icon: React.ReactNode; weight: string }[] = [
  { value: 'Laptop',     label: 'Laptop / Notebook',  icon: <Laptop size={16}/>,    weight: '1.0-3.5 kg' },
  { value: 'Smartphone', label: 'Smartphone',          icon: <Smartphone size={16}/>, weight: '0.1-0.3 kg' },
  { value: 'Battery',    label: 'Battery Pack',        icon: <Battery size={16}/>,   weight: '0.2-2.0 kg' },
  { value: 'Desktop',    label: 'Desktop / Tower',     icon: <Monitor size={16}/>,   weight: '4.0-15 kg' },
  { value: 'Tablet',     label: 'Tablet / iPad',       icon: <Tablet size={16}/>,    weight: '0.3-0.8 kg' },
  { value: 'Server',     label: 'Server Hardware',     icon: <Server size={16}/>,    weight: '5.0-30 kg' },
];

export default function RegisterEWasteForm() {
  const { registerEWaste } = useApp();

  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<EWasteItem['deviceType']>('Laptop');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedDevice = DEVICE_TYPES.find(d => d.value === deviceType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim() || !weight) return;

    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 1400)); // Simulate tx
    registerEWaste(deviceName.trim(), deviceType, weight);
    setIsSubmitting(false);
    setJustSubmitted(true);
    setDeviceName('');
    setWeight('');
    setTimeout(() => setJustSubmitted(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass"
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 flex items-center justify-center rounded-lg"
          style={{ background: 'rgba(0, 255, 102, 0.1)', border: '1px solid rgba(0, 255, 102, 0.2)' }}
        >
          <PlusCircle size={16} style={{ color: '#00FF66' }} />
        </div>
        <div>
          <div className="section-tag">Register E-Waste</div>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
            Mint a cryptographic tracking hash
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Device Name */}
        <div>
          <label className="cyber-label">Device Name / Model</label>
          <input
            type="text"
            value={deviceName}
            onChange={e => setDeviceName(e.target.value)}
            placeholder="e.g. MacBook Pro 2020, iPhone 13..."
            className="cyber-input"
            required
          />
        </div>

        {/* Custom Device Type Dropdown */}
        <div>
          <label className="cyber-label">Device Category</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="cyber-input flex items-center justify-between text-left"
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: '#00FF66' }}>{selectedDevice.icon}</span>
                <span>{selectedDevice.label}</span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  color: 'rgba(0, 255, 102, 0.6)',
                  transform: showDropdown ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute w-full mt-1 z-50 rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(10, 18, 38, 0.98)',
                    border: '1px solid rgba(0, 255, 102, 0.25)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {DEVICE_TYPES.map(dt => (
                    <button
                      key={dt.value}
                      type="button"
                      onClick={() => { setDeviceType(dt.value); setShowDropdown(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                      style={{
                        background: deviceType === dt.value ? 'rgba(0, 255, 102, 0.08)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0, 255, 102, 0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = deviceType === dt.value ? 'rgba(0, 255, 102, 0.08)' : 'transparent')}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: deviceType === dt.value ? '#00FF66' : 'rgba(148, 163, 184, 0.5)' }}>
                          {dt.icon}
                        </span>
                        <span className="text-sm" style={{ color: deviceType === dt.value ? '#e2e8f0' : 'rgba(148, 163, 184, 0.7)' }}>
                          {dt.label}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
                        {dt.weight}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="cyber-label">Estimated Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="100"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g. 1.5"
            className="cyber-input"
            required
          />
        </div>

        {/* Hash preview */}
        {deviceName && weight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-lg p-3"
            style={{
              background: 'rgba(0, 191, 255, 0.05)',
              border: '1px solid rgba(0, 191, 255, 0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Hash size={12} style={{ color: '#00BFFF' }} />
              <span className="text-xs" style={{ color: 'rgba(0, 191, 255, 0.7)' }}>
                Hash Preview (pending mint)
              </span>
            </div>
            <span className="hash-text text-xs">0x████████████████████████████████████████</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || justSubmitted || !deviceName || !weight}
          className="btn-solid-green w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          style={{ fontSize: '0.875rem', letterSpacing: '0.3px' }}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div key="loading" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Minting Hash on Chain...</span>
              </motion.div>
            ) : justSubmitted ? (
              <motion.div key="done" className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle2 size={16} />
                <span>Hash Minted!</span>
              </motion.div>
            ) : (
              <motion.div key="idle" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Hash size={16} />
                <span>Mint Tracking Hash</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </form>
    </motion.div>
  );
}
