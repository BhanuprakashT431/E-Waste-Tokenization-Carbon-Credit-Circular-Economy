import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CollectorDashboard() {
  const { collectorProfile, requests, acceptRequest, deliverRequest } = useAppContext();

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS');

  return (
    <div>
      <div className="profile-header">
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?u=arjun" alt="Profile" />
        </div>
        <div className="profile-text">
          <h2>Hi, {collectorProfile.name}</h2>
          <p>Keep collecting, keep earning!</p>
        </div>
      </div>

      <div className="credit-card" style={{background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)'}}>
        <div>
          <h3>Total Earnings</h3>
          <div className="balance">₹{collectorProfile.earnings}</div>
        </div>
        <div style={{width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>

      <div className="list-header">
        <h3>Requests</h3>
        <Link to="#">View All</Link>
      </div>

      <div className="card">
        {pendingRequests.length === 0 && inProgressRequests.length === 0 && (
          <div style={{padding: 20, textAlign: 'center', color: '#6B7280'}}>No requests available.</div>
        )}

        {pendingRequests.map(req => (
          <div className="list-item" style={{alignItems: 'flex-start'}} key={req.id}>
            <div className="list-item-info">
              <span style={{fontSize: 10, fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: 4, display: 'block'}}>New Request</span>
              <h4>{req.category}</h4>
              <p>{req.distance}</p>
            </div>
            <button 
              className="btn-primary" 
              style={{width: 'auto', padding: '8px 16px', fontSize: 13, backgroundColor: '#8B5CF6'}}
              onClick={() => acceptRequest(req.id)}
            >
              ACCEPT
            </button>
          </div>
        ))}

        {inProgressRequests.map(req => (
          <div className="list-item" style={{alignItems: 'flex-start'}} key={req.id}>
            <div className="list-item-info">
              <span style={{fontSize: 10, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: 4, display: 'block'}}>In Progress</span>
              <h4>{req.category}</h4>
              <p>{req.distance}</p>
            </div>
            <button 
              className="btn-outline" 
              style={{width: 'auto', padding: '8px 16px', fontSize: 13, borderColor: '#8B5CF6', color: '#8B5CF6'}}
              onClick={() => deliverRequest(req.id)}
            >
              DELIVER
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
