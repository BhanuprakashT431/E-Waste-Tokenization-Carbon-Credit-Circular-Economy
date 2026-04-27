import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RecyclerDashboard() {
  const { recyclerProfile, requests, processRequest } = useAppContext();

  const deliveredRequests = requests.filter(r => r.status === 'DELIVERED');
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');

  return (
    <div style={{maxWidth: 1000}}>
      <div className="profile-header" style={{marginBottom: 40}}>
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?u=ecoprocess" alt="Profile" />
        </div>
        <div className="profile-text">
          <h2 style={{fontSize: 24}}>Hi, {recyclerProfile.name}</h2>
          <p style={{fontSize: 15}}>Let's build a sustainable future!</p>
        </div>
      </div>

      <div className="credit-card" style={{background: '#3B82F6'}}>
        <div>
          <h3 style={{color: 'rgba(255,255,255,0.9)', fontSize: 16}}>Total E-waste Processed</h3>
          <div className="balance" style={{fontSize: 40}}>{recyclerProfile.processedTons.toFixed(2)} Tons</div>
        </div>
        <div style={{width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        </div>
      </div>

      {deliveredRequests.length > 0 && (
        <>
          <h3 style={{fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32}}>Awaiting Processing</h3>
          <div className="card" style={{padding: 0, overflow: 'hidden'}}>
            {deliveredRequests.map(req => (
              <div className="list-item" style={{padding: '20px 24px'}} key={req.id}>
                <div className="list-item-info">
                  <p style={{fontSize: 12, color: '#6B7280'}}>{req.id}</p>
                  <h4 style={{fontSize: 16}}>{req.category} ({req.weight} kg)</h4>
                </div>
                <button 
                  className="btn-primary" 
                  style={{width: 'auto', padding: '8px 16px', fontSize: 13, backgroundColor: '#3B82F6'}}
                  onClick={() => processRequest(req.id)}
                >
                  VERIFY & PROCESS
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="list-header" style={{marginTop: 40}}>
        <h3 style={{fontSize: 18}}>Recent Receipts (Completed)</h3>
        <Link to="#">View All</Link>
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        {completedRequests.length === 0 ? (
          <div style={{padding: '20px 24px', color: '#6B7280'}}>No recent receipts.</div>
        ) : (
          completedRequests.slice(0, 5).map(req => (
            <div className="list-item" style={{padding: '20px 24px'}} key={req.id}>
              <div className="list-item-info">
                <p style={{fontSize: 12, color: '#6B7280'}}>{req.id}</p>
                <h4 style={{fontSize: 16}}>{req.category}</h4>
              </div>
              <div style={{color: '#6B7280', fontSize: 14}}>
                {new Date(req.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
