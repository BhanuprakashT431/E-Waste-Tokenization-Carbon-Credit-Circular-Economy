'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// ===================== TYPES =====================
export type DeviceStatus = 'Pending' | 'In Transit' | 'Extracted/Rewarded';
export type UserRole = 'consumer' | 'recycler';

export interface EWasteItem {
  id: string;
  device: string;
  deviceType: 'Laptop' | 'Smartphone' | 'Battery' | 'Desktop' | 'Tablet' | 'Server';
  weight: string;
  status: DeviceStatus;
  dateRegistered: string;
  hash: string;
  co2Offset: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  cct?: number;
}

interface AppState {
  walletBalance: number;
  walletAddress: string;
  ewasteLedger: EWasteItem[];
  activeRole: UserRole;
  toasts: Toast[];
  totalCO2Offset: number;
  totalItemsProcessed: number;
}

interface AppContextType extends AppState {
  switchRole: (role: UserRole) => void;
  registerEWaste: (device: string, deviceType: EWasteItem['deviceType'], weight: string) => EWasteItem;
  sendToRecycler: (id: string) => void;
  verifyAndExtract: (id: string) => Promise<void>;
  removeToast: (id: string) => void;
}

// ===================== HELPERS =====================
function generateHash(): string {
  const chars = '0123456789abcdef';
  return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

function generateCO2(weight: string): string {
  const kg = parseFloat(weight) || 1;
  return (kg * 2.4).toFixed(1) + ' kg';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
  });
}

// ===================== INITIAL STATE =====================
const INITIAL_LEDGER: EWasteItem[] = [
  {
    id: 'init-001',
    device: 'MacBook Pro 2018',
    deviceType: 'Laptop',
    weight: '1.5',
    status: 'In Transit',
    dateRegistered: 'Apr 20, 2025',
    hash: '0x4a3f8c912e1b7d5f0a2c6e9b3d1f8a4c7e2b5d9f',
    co2Offset: '3.6 kg',
  },
  {
    id: 'init-002',
    device: 'iPhone 12',
    deviceType: 'Smartphone',
    weight: '0.2',
    status: 'Pending',
    dateRegistered: 'Apr 22, 2025',
    hash: '0x9d2e6f1a4c8b3e7f0d5a2c9b6e3f1a8d5c2b7e4f',
    co2Offset: '0.5 kg',
  },
];

// ===================== CONTEXT =====================
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    walletBalance: 250,
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    ewasteLedger: INITIAL_LEDGER,
    activeRole: 'consumer',
    toasts: [],
    totalCO2Offset: 8.6,
    totalItemsProcessed: 3,
  });

  const toastTimerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((message: string, type: Toast['type'] = 'success', cct?: number) => {
    const id = Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      toasts: [...prev.toasts, { id, message, type, cct }],
    }));
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        toasts: prev.toasts.filter(t => t.id !== id),
      }));
      toastTimerRef.current.delete(id);
    }, 4500);
    toastTimerRef.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    const timer = toastTimerRef.current.get(id);
    if (timer) clearTimeout(timer);
    toastTimerRef.current.delete(id);
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== id),
    }));
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setState(prev => ({ ...prev, activeRole: role }));
  }, []);

  const registerEWaste = useCallback(
    (device: string, deviceType: EWasteItem['deviceType'], weight: string): EWasteItem => {
      const newItem: EWasteItem = {
        id: Math.random().toString(36).slice(2),
        device,
        deviceType,
        weight,
        status: 'Pending',
        dateRegistered: formatDate(),
        hash: generateHash(),
        co2Offset: generateCO2(weight),
      };
      setState(prev => ({
        ...prev,
        ewasteLedger: [newItem, ...prev.ewasteLedger],
      }));
      addToast(`E-Waste registered: Hash minted on-chain`, 'success');
      return newItem;
    },
    [addToast]
  );

  const sendToRecycler = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      ewasteLedger: prev.ewasteLedger.map(item =>
        item.id === id ? { ...item, status: 'In Transit' } : item
      ),
    }));
    addToast('Shipment dispatched to Certified Recycler', 'info');
  }, [addToast]);

  const verifyAndExtract = useCallback(async (id: string) => {
    // Step 1: Mark as processing (simulated smart contract validation)
    await new Promise(res => setTimeout(res, 2200));

    // Step 2: Update state atomically
    setState(prev => {
      const item = prev.ewasteLedger.find(i => i.id === id);
      if (!item) return prev;
      const co2Num = parseFloat(item.co2Offset) || 0;
      return {
        ...prev,
        walletBalance: prev.walletBalance + 50,
        totalCO2Offset: parseFloat((prev.totalCO2Offset + co2Num).toFixed(1)),
        totalItemsProcessed: prev.totalItemsProcessed + 1,
        ewasteLedger: prev.ewasteLedger.map(i =>
          i.id === id ? { ...i, status: 'Extracted/Rewarded' } : i
        ),
      };
    });

    addToast('Smart Contract Executed: 50 CCT Minted to Consumer Wallet', 'success', 50);
  }, [addToast]);

  return (
    <AppContext.Provider value={{
      ...state,
      switchRole,
      registerEWaste,
      sendToRecycler,
      verifyAndExtract,
      removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
