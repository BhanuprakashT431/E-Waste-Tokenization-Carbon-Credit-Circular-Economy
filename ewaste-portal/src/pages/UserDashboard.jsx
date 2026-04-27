import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function UserDashboard() {
  const { userProfile, requests } = useAppContext();

  // User stats
  const ewasteLogged = requests.length;
  const inProgress = requests.filter(r => r.status === 'IN_PROGRESS' || r.status === 'PENDING' || r.status === 'DELIVERED').length;
  const recycled = requests.filter(r => r.status === 'COMPLETED').length;

  return (
    <div>
      <div className="profile-header">
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?u=riya" alt="Profile" />
        </div>
        <div className="profile-text">
          <h2>Hello, {userProfile.name}</h2>
          <p>Let's recycle for a better future!</p>
        </div>
      </div>

      <div className="credit-card">
        <div>
          <h3>Total Carbon Credits</h3>
          <div className="balance">{userProfile.carbonCredits.toFixed(1)} CC</div>
        </div>
        <Leaf size={40} color="rgba(255,255,255,0.4)" />
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-val">{ewasteLogged}</div>
          <div className="stat-label">E-waste Logged</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{recycled}</div>
          <div className="stat-label">Recycled</div>
        </div>
      </div>

      <div className="list-header">
        <h3>Recent Activity</h3>
        <Link to="#">View All</Link>
      </div>

      <div className="card">
        {requests.length === 0 ? (
          <div style={{padding: 20, textAlign: 'center', color: '#6B7280'}}>No activity yet.</div>
        ) : (
          requests.map(req => (
            <div className="list-item" key={req.id}>
              <div className="list-item-info">
                <h4>{req.category}</h4>
                <p>{req.id}</p>
              </div>
              <div style={{textAlign: 'right'}}>
                {req.status === 'COMPLETED' ? (
                  <>
                    <span style={{fontSize: 12, color: '#10B981', display: 'block', marginBottom: 2}}>Completed</span>
                    <span className="list-item-value">+{req.ccAwarded} CC</span>
                  </>
                ) : (
                  <>
                    <span style={{fontSize: 12, color: '#F59E0B', display: 'block', marginBottom: 2}}>
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className="list-item-value" style={{color: '#9CA3AF'}}>--</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
