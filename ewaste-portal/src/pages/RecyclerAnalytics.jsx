import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function RecyclerAnalytics() {
  const { requests } = useAppContext();
  
  // Aggregate data for chart
  const categoryDataMap = {};
  requests.forEach(req => {
    if (req.status === 'COMPLETED') {
      if (!categoryDataMap[req.category]) {
        categoryDataMap[req.category] = { name: req.category, weight: 0, cc: 0 };
      }
      categoryDataMap[req.category].weight += req.weight;
      categoryDataMap[req.category].cc += req.ccAwarded || 0;
    }
  });

  const chartData = Object.values(categoryDataMap);

  // Time-based mock data for the line chart (Tokens Generated)
  const timeData = [
    { name: 'Mon', tokens: 120 },
    { name: 'Tue', tokens: 250 },
    { name: 'Wed', tokens: 180 },
    { name: 'Thu', tokens: 300 },
    { name: 'Fri', tokens: chartData.reduce((acc, curr) => acc + curr.cc, 0) + 150 }, // include current dynamic data
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{maxWidth: 1000}}
    >
      <h2 style={{fontSize: 24, marginBottom: 8}}>Analytics Overview</h2>
      <p style={{color: '#6B7280', marginBottom: 32}}>Visualizing E-waste processing and Tokenization impact.</p>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        <motion.div 
          className="card" 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{fontSize: 16, marginBottom: 24, fontWeight: 600}}>E-Waste Processed by Category (kg)</h3>
          {chartData.length > 0 ? (
            <div style={{width: '100%', height: 300}}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="weight" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280'}}>No data to display</div>
          )}
        </motion.div>

        <motion.div 
          className="card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{fontSize: 16, marginBottom: 24, fontWeight: 600}}>E-Tokens Generated This Week</h3>
          <div style={{width: '100%', height: 300}}>
            <ResponsiveContainer>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="tokens" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
