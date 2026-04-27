import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CATEGORY_CO2 = { Laptop: 2.1, 'Mobile Phone': 0.8, Monitor: 1.6, CPU: 1.4, Battery: 0.4, Tablet: 0.9, Other: 0.6 };

export default function ESGAnalytics() {
  const { requests } = useAppContext();
  const completed = requests.filter(r => r.status === 'COMPLETED');

  // Per-category aggregation
  const catMap = {};
  completed.forEach(r => {
    if (!catMap[r.category]) catMap[r.category] = { category: r.category, weight: 0, cc: 0, co2: 0, count: 0 };
    catMap[r.category].weight += r.weight;
    catMap[r.category].cc    += r.ccAwarded || 0;
    catMap[r.category].co2   += r.weight * (CATEGORY_CO2[r.category] || 0.6);
    catMap[r.category].count += 1;
  });
  const catData = Object.values(catMap).map(c => ({ ...c, weight: +c.weight.toFixed(2), cc: +c.cc.toFixed(1), co2: +c.co2.toFixed(2) }));

  // Monthly mock + live
  const monthlyData = [
    { month: 'Jan', kg: 0,   cc: 0,    co2: 0    },
    { month: 'Feb', kg: 0.3, cc: 3,    co2: 0.5  },
    { month: 'Mar', kg: 0.8, cc: 8,    co2: 1.2  },
    { month: 'Apr', kg: +completed.reduce((a,r)=>a+r.weight,0).toFixed(1), cc: +completed.reduce((a,r)=>a+(r.ccAwarded||0),0).toFixed(1), co2: +completed.reduce((a,r)=>a+r.weight*(CATEGORY_CO2[r.category]||0.6),0).toFixed(1) },
  ].map((d, i, arr) => ({ ...d, cumCC: arr.slice(0, i+1).reduce((a,c)=>a+c.cc,0) }));

  const totalCO2 = completed.reduce((a, r) => a + r.weight * (CATEGORY_CO2[r.category] || 0.6), 0);
  const totalCC  = completed.reduce((a, r) => a + (r.ccAwarded || 0), 0);
  const totalKg  = completed.reduce((a, r) => a + r.weight, 0);

  const tooltipStyle = { borderRadius: 10, border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1000 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>ESG Analytics</h2>
      <p style={{ color: '#6B7280', marginBottom: 28 }}>
        Deep-dive environmental metrics — CO₂ reduction, carbon token generation, and circular economy impact.
      </p>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '⚖️', label: 'Weight Recycled',   value: totalKg.toFixed(1)+' kg',    color: '#3B82F6' },
          { icon: '💨', label: 'CO₂ Avoided',        value: totalCO2.toFixed(2)+' kg',    color: '#8B5CF6' },
          { icon: '🌿', label: 'CC Tokens',           value: totalCC.toFixed(1),           color: '#10B981' },
          { icon: '🌳', label: 'Tree Equivalent',     value: Math.round(totalKg*0.08)+' trees', color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.08 }}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
            style={{ background: 'white', borderRadius: 16, padding: 18, border: '1px solid #E5E7EB', cursor: 'default' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
        {/* Cumulative CC over time */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>📈 Cumulative Carbon Credits</h3>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>Month-over-month CC token accumulation</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="ccGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="cumCC" name="Cumulative CC" stroke="#10B981" fill="url(#ccGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CO2 avoided per category */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>💨 CO₂ Avoided by Category</h3>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>Kilograms of CO₂ equivalent per device type</p>
          {catData.length > 0 ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={catData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="co2" name="CO₂ Avoided (kg)" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              No completed data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* CC vs Weight correlation */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #E5E7EB' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🔗 Weight vs Carbon Credits by Category</h3>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>Comparative breakdown of e-waste volume and tokens issued per device category</p>
        {catData.length > 0 ? (
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={catData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                <Bar dataKey="weight" name="Weight (kg)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cc"     name="CC Tokens"   fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
            Process items via the Recycler portal to see analytics
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
