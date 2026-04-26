import React, { useState, useRef } from 'react';
import Header from './components/Header';
import ConsumerPortal from './components/ConsumerPortal';
import RecyclerPortal from './components/RecyclerPortal';
import TokenShower from './components/TokenShower';
import Toast from './components/Toast';

const INITIAL_ASSETS = [
  { id: 'ast-001', device: 'Dell XPS 15 (2021)', serial: 'DL9X1-VN382', weight: 1.86, status: 'credited',    time: '2h ago' },
  { id: 'ast-002', device: 'iPhone 12 Pro',       serial: 'F2LN2-XR910', weight: 0.19, status: 'in-transit', time: '5h ago' },
  { id: 'ast-003', device: 'Lenovo ThinkPad X1',  serial: 'LT4X1-KM551', weight: 1.34, status: 'pending',    time: '1d ago' },
];

const INITIAL_QUEUE = [
  { id: 'ship-4471', device: 'HP EliteBook 840',     weight: 1.52, origin: 'Mumbai, IN',    date: 'Apr 26' },
  { id: 'ship-4472', device: 'Samsung Galaxy S22',   weight: 0.17, origin: 'Bangalore, IN', date: 'Apr 26' },
  { id: 'ship-4473', device: 'Apple MacBook Air M1', weight: 1.29, origin: 'Pune, IN',      date: 'Apr 25' },
];

function uuid() {
  return 'ast-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function App() {
  const [balance, setBalance] = useState(1250);
  const [view, setView] = useState('consumer');
  const [verifiedCount, setVerifiedCount] = useState(7);
  const [cctIssued, setCctIssued] = useState(525);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [recyclerQueue, setRecyclerQueue] = useState(INITIAL_QUEUE);
  
  const [lastUpdated, setLastUpdated] = useState('Last updated just now');
  
  // Animation states
  const [pulse, setPulse] = useState(false);
  const [flash, setFlash] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, title: '', sub: '' });
  
  const showerRef = useRef(null);

  const showToast = (title, sub) => {
    setToast({ show: true, title, sub });
  };

  const handleRegister = (assetData) => {
    const newAsset = {
      id: uuid(),
      device: assetData.device,
      serial: assetData.serial,
      weight: assetData.weight,
      status: 'pending',
      time: 'Just now',
    };

    setAssets([newAsset, ...assets]);
    setRecyclerQueue([
      ...recyclerQueue,
      {
        id: 'ship-' + Math.floor(4500 + Math.random() * 500),
        device: newAsset.device,
        weight: newAsset.weight,
        origin: 'Registered Locally',
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()),
      }
    ]);
    
    showToast('Asset Registered', `"${newAsset.device}" added to the ledger.`);
  };

  const handleVerify = (id) => {
    setRecyclerQueue(q => q.filter(item => item.id !== id));
    setVerifiedCount(c => c + 1);
    setCctIssued(c => c + 75);
    
    // Balance animation logic
    animateBalance(balance, balance + 75);
    
    setLastUpdated('Just now');
    if (showerRef.current) {
      showerRef.current.triggerShower();
    }
    showToast('Verification Complete', 'Smart Contract Executed · +75 CCT Minted');
  };

  const animateBalance = (start, end) => {
    const duration = 700;
    const startTime = performance.now();

    const step = (ts) => {
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      
      setBalance(current);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setBalance(end);
        setFlash(true);
        setTimeout(() => setFlash(false), 650);
      }
    };
    
    requestAnimationFrame(step);
    
    setPulse(false);
    setTimeout(() => setPulse(true), 10);
  };

  return (
    <>
      <Toast 
        show={toast.show} 
        title={toast.title} 
        sub={toast.sub} 
        onClose={() => setToast(prev => ({...prev, show: false}))} 
      />
      <TokenShower ref={showerRef} />
      
      <Header balance={balance} view={view} setView={setView} />
      
      <main>
        {view === 'consumer' ? (
          <ConsumerPortal 
            balance={balance}
            assets={assets}
            lastUpdated={lastUpdated}
            onRegister={handleRegister}
            pulse={pulse}
            flash={flash}
          />
        ) : (
          <RecyclerPortal 
            queue={recyclerQueue}
            verifiedCount={verifiedCount}
            cctIssued={cctIssued}
            onVerify={handleVerify}
          />
        )}
      </main>
      
      <footer className="site-footer">
        <div className="footer-inner">
          <span>E-Waste Ledger &mdash; Circular Economy Protocol</span>
          <span className="footer-sep">·</span>
          <span>All transactions are immutably logged on-chain</span>
          <span className="footer-sep">·</span>
          <span style={{color: '#10B981'}}>●</span>
          <span>Live Network</span>
        </div>
      </footer>
    </>
  );
}

export default App;
