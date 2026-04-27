import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Laptops', value: 40, color: '#3B82F6' },
  { name: 'Mobiles', value: 25, color: '#10B981' },
  { name: 'Batteries', value: 20, color: '#F59E0B' },
  { name: 'Others', value: 15, color: '#6B7280' },
];

export default function ESGDashboard() {
  return (
    <div style={{maxWidth: 1000}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40}}>
        <h2 style={{fontSize: 24, fontWeight: 700}}>ESG Dashboard</h2>
        <select className="input-field" style={{width: 150}}>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="stats-row">
        <div className="stat-box" style={{textAlign: 'left', padding: 24}}>
          <div className="stat-label" style={{fontSize: 14, marginBottom: 8}}>Total E-waste Collected</div>
          <div className="stat-val" style={{fontSize: 32}}>12.45 <span style={{fontSize: 16, color: '#6B7280', fontWeight: 500}}>Tons</span></div>
        </div>
        <div className="stat-box" style={{textAlign: 'left', padding: 24}}>
          <div className="stat-label" style={{fontSize: 14, marginBottom: 8}}>Total Carbon Credits Generated</div>
          <div className="stat-val" style={{fontSize: 32, color: '#10B981'}}>2,450 <span style={{fontSize: 16, color: '#6B7280', fontWeight: 500}}>CC</span></div>
        </div>
      </div>

      <div className="card" style={{padding: 32, marginBottom: 24}}>
        <div className="stat-label" style={{fontSize: 14, marginBottom: 8}}>CO₂ Impact</div>
        <div className="stat-val" style={{fontSize: 32, color: '#10B981'}}>18.6 <span style={{fontSize: 16, color: '#6B7280', fontWeight: 500}}>Tons</span></div>
        <div style={{fontSize: 14, color: '#6B7280'}}>CO₂e Avoided</div>
      </div>

      <div className="card" style={{padding: 32}}>
        <h3 style={{fontSize: 18, marginBottom: 24}}>E-waste by Category</h3>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: 300, height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{flex: 1, paddingLeft: 40}}>
            {data.map((item, index) => (
              <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
                <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, marginRight: 12}}></div>
                <div style={{flex: 1, fontSize: 16}}>{item.name}</div>
                <div style={{fontWeight: 700, fontSize: 16}}>{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
