import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function RecyclerReports() {
  const { requests } = useAppContext();
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{maxWidth: 1000}}
    >
      <h2 style={{fontSize: 24, marginBottom: 8}}>Processing Reports</h2>
      <p style={{color: '#6B7280', marginBottom: 32}}>Detailed log of all verified and processed e-waste tokens.</p>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB'}}>
              <th style={{padding: '16px 24px', color: '#6B7280', fontWeight: 500, fontSize: 14}}>Request ID</th>
              <th style={{padding: '16px 24px', color: '#6B7280', fontWeight: 500, fontSize: 14}}>Category</th>
              <th style={{padding: '16px 24px', color: '#6B7280', fontWeight: 500, fontSize: 14}}>Weight (kg)</th>
              <th style={{padding: '16px 24px', color: '#6B7280', fontWeight: 500, fontSize: 14}}>Carbon Credits Issued</th>
              <th style={{padding: '16px 24px', color: '#6B7280', fontWeight: 500, fontSize: 14}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {completedRequests.length === 0 ? (
              <tr>
                <td colSpan="5" style={{padding: '32px 24px', textAlign: 'center', color: '#6B7280'}}>No reports available yet.</td>
              </tr>
            ) : (
              completedRequests.map((req, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={req.id} 
                  style={{borderBottom: '1px solid #E5E7EB'}}
                >
                  <td style={{padding: '16px 24px', fontSize: 14}}>{req.id}</td>
                  <td style={{padding: '16px 24px', fontSize: 14, fontWeight: 500}}>{req.category}</td>
                  <td style={{padding: '16px 24px', fontSize: 14}}>{req.weight}</td>
                  <td style={{padding: '16px 24px', fontSize: 14, color: '#10B981', fontWeight: 600}}>+{req.ccAwarded} CC</td>
                  <td style={{padding: '16px 24px', fontSize: 14, color: '#6B7280'}}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
