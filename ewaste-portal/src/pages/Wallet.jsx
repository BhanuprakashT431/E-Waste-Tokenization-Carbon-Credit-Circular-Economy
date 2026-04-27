import React from 'react';
import { Leaf, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wallet() {
  return (
    <div>
      <div className="credit-card" style={{marginTop: 16}}>
        <div>
          <h3>Total Balance</h3>
          <div className="balance">120.5 CC</div>
        </div>
        <Leaf size={40} color="rgba(255,255,255,0.4)" />
      </div>

      <div style={{display: 'flex', gap: 16, marginBottom: 32}}>
        <button className="btn-outline">
          <ArrowUpRight size={18} />
          Send
        </button>
        <button className="btn-outline" style={{borderColor: '#E5E7EB', color: '#111827'}}>
          <ArrowDownLeft size={18} />
          Receive
        </button>
      </div>

      <div className="list-header">
        <h3>Transaction History</h3>
        <Link to="#">View All</Link>
      </div>

      <div className="card">
        <div className="list-item">
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowDownLeft size={20} color="#10B981" />
            </div>
            <div className="list-item-info">
              <h4>From Reward</h4>
              <p>12 May 2024</p>
            </div>
          </div>
          <span className="list-item-value">+25.6 CC</span>
        </div>
        
        <div className="list-item">
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowDownLeft size={20} color="#10B981" />
            </div>
            <div className="list-item-info">
              <h4>From Reward</h4>
              <p>08 May 2024</p>
            </div>
          </div>
          <span className="list-item-value">+10.2 CC</span>
        </div>

        <div className="list-item">
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowUpRight size={20} color="#EF4444" />
            </div>
            <div className="list-item-info">
              <h4>Used in Marketplace</h4>
              <p>05 May 2024</p>
            </div>
          </div>
          <span className="list-item-value" style={{color: '#EF4444'}}>-15.0 CC</span>
        </div>

        <div className="list-item">
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ArrowDownLeft size={20} color="#10B981" />
            </div>
            <div className="list-item-info">
              <h4>From Reward</h4>
              <p>01 May 2024</p>
            </div>
          </div>
          <span className="list-item-value">+8.7 CC</span>
        </div>
      </div>
    </div>
  );
}
