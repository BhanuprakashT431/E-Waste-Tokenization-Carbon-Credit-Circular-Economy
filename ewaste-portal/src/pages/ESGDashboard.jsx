import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const PIE_COLORS = {
  Laptop: '#3B82F6', 'Mobile Phone': '#10B981', Battery: '#F59E0B',
  Monitor: '#8B5CF6', CPU: '#EF4444', Tablet: '#06B6D4', Other: '#6B7280',
};

const SDG_GOALS = [
  { id: 12, icon: '♻️', label: 'Responsible Consumption', desc: 'E-waste diverted from landfills promotes circular economy practices.' },
  { id: 13, icon: '🌍', label: 'Climate Action',          desc: 'Every kg recycled avoids CO₂ emissions from raw material mining.' },
  { id: 11, icon: '🏙️', label: 'Sustainable Cities',      desc: 'Clean urban e-waste collection reduces hazardous urban pollution.' },
  { id: 17, icon: '🤝', label: 'Partnerships for Goals',  desc: 'Multi-stakeholder model connects users, collectors, and recyclers.' },
];

function StatCard({ icon, label, value, sub, color = '#3B82F6', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
      style={{
        background: 'white', borderRadius: 16, padding: '20px 24px',
        border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'default'
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>}
    </motion.div>
  );
}

export default function ESGDashboard() {
  const { requests, userProfile } = useAppContext();

  const completed = requests.filter(r => r.status === 'COMPLETED');
  const allActive = requests.filter(r => r.status !== 'COMPLETED');

  // Live metrics from context
  const totalWeightKg  = requests.reduce((a, r) => a + (r.weight || 0), 0);
  const totalWeightTons = (totalWeightKg / 1000).toFixed(3);
  const totalCC         = completed.reduce((a, r) => a + (r.ccAwarded || 0), 0);
  const co2Avoided      = (totalWeightKg * 1.5).toFixed(1); // 1.5 kg CO2 per kg e-waste recycled
  const treesEquivalent = Math.round(totalWeightKg * 0.08);
  const pendingItems    = requests.filter(r => r.status === 'PENDING').length;
  const recycledItems   = completed.length;
  const totalItems      = requests.length;
  const recycleRate     = totalItems > 0 ? Math.round((recycledItems / totalItems) * 100) : 0;

  // Category breakdown for pie chart
  const categoryMap = {};
  requests.forEach(r => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + (r.weight || 0);
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name, value: parseFloat(value.toFixed(2)), color: PIE_COLORS[name] || '#6B7280'
  }));

  // Weekly bar chart (mock progression + live final)
  const weeklyData = [
    { week: 'Wk 1', kg: 0.5, cc: 5 },
    { week: 'Wk 2', kg: 1.2, cc: 12 },
    { week: 'Wk 3', kg: 2.1, cc: 21 },
    { week: 'Wk 4', kg: 3.4, cc: 34 },
    { week: 'Now',  kg: totalWeightKg, cc: totalCC },
  ];

  // Impact milestones
  const milestones = [
    { label: 'Items Logged',        current: totalItems,   target: 10,  unit: 'items',   color: '#3B82F6' },
    { label: 'Successfully Recycled', current: recycledItems, target: 10, unit: 'items',  color: '#10B981' },
    { label: 'CO₂ Avoided',         current: parseFloat(co2Avoided), target: 100, unit: 'kg', color: '#8B5CF6' },
    { label: 'CC Tokens Earned',    current: totalCC,      target: 500, unit: 'CC',       color: '#F59E0B' },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 1100 }}>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #065F46, #059669, #10B981)',
          borderRadius: 20, padding: '28px 32px', marginBottom: 32, color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.8, marginBottom: 6 }}>
            ENVIRONMENTAL · SOCIAL · GOVERNANCE
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: 'white' }}>ESG Impact Dashboard</h2>
          <p style={{ fontSize: 14, opacity: 0.9, maxWidth: 520, lineHeight: 1.6 }}>
            This portal tracks your organisation's real-time environmental footprint from e-waste recycling.
            Every device collected generates verified <strong>Carbon Credit Tokens (CC)</strong> and contributes to
            your <strong>UN SDG compliance</strong> reporting, CO₂ reduction targets, and circular economy goals.
          </p>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 52 }}>🌿</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Live Impact Score</div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{recycleRate}%</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>Recycle Rate</div>
        </div>
      </motion.div>

      {/* ── What is this? ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '16px 24px', marginBottom: 28 }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1E40AF', marginBottom: 4 }}>How This Works</div>
            <div style={{ fontSize: 13, color: '#3B82F6', lineHeight: 1.7 }}>
              <strong>Users</strong> log their e-waste → <strong>Collectors</strong> pick it up using a secure code →
              <strong> Recyclers</strong> verify it with AI and issue <strong>Carbon Credit Tokens (CC)</strong>.
              Each CC represents <strong>1 kg of CO₂ avoided</strong> and can be used for ESG reporting,
              traded on carbon markets, or redeemed as rewards. This dashboard shows your cumulative impact.
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Live KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon="⚖️" label="Total E-waste Collected" value={`${totalWeightKg.toFixed(1)} kg`} sub={`${totalWeightTons} Tons`} color="#3B82F6" delay={0.1} />
        <StatCard icon="🌿" label="Carbon Credits Issued"   value={`${totalCC.toFixed(1)} CC`}       sub="Live from blockchain ledger" color="#10B981" delay={0.15} />
        <StatCard icon="💨" label="CO₂ Emissions Avoided"   value={`${co2Avoided} kg`}               sub="CO₂e equivalent"           color="#8B5CF6" delay={0.2} />
        <StatCard icon="🌳" label="Trees Equivalent Saved"  value={treesEquivalent}                   sub="Annual carbon absorption"  color="#F59E0B" delay={0.25} />
      </div>

      {/* ── Progress Milestones ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 28, border: '1px solid #E5E7EB' }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Impact Milestones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {milestones.map((m, i) => {
            const pct = Math.min((m.current / m.target) * 100, 100);
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.current.toFixed(1)} / {m.target} {m.unit}</span>
                </div>
                <div style={{ background: '#F3F4F6', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                    style={{ height: '100%', borderRadius: 99, background: m.color }}
                  />
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{pct.toFixed(0)}% of target reached</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>

        {/* Weekly accumulation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Carbon Credits Over Time</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Cumulative CC tokens generated per week</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="cc" name="CC Tokens" stroke="#10B981" strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* E-waste by category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>E-Waste by Category</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Weight distribution across device types (kg)</p>
          {pieData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 160, height: 180, flexShrink: 0 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{item.value} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              No data yet — log e-waste to see breakdown
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Status pipeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 28, border: '1px solid #E5E7EB' }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔄 Active Pipeline</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { label: 'Logged',       status: 'PENDING',    count: requests.filter(r => r.status === 'PENDING').length,    color: '#F59E0B', icon: '📋' },
            { label: 'Accepted',     status: 'IN_PROGRESS',count: requests.filter(r => r.status === 'IN_PROGRESS').length, color: '#3B82F6', icon: '🚴' },
            { label: 'Picked Up',    status: 'PICKED_UP',  count: requests.filter(r => r.status === 'PICKED_UP').length,   color: '#8B5CF6', icon: '📦' },
            { label: 'At Facility',  status: 'DELIVERED',  count: requests.filter(r => r.status === 'DELIVERED').length,   color: '#F97316', icon: '🏭' },
            { label: 'Recycled ✓',   status: 'COMPLETED',  count: completed.length,                                         color: '#10B981', icon: '♻️' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 14, background: '#F9FAFB', borderRadius: 12, border: `2px solid ${s.color}20` }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── UN SDG alignment ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E5E7EB' }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🇺🇳 UN Sustainable Development Goals Alignment</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          This platform directly contributes to the following UN SDGs — suitable for ESG reports and sustainability disclosures.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {SDG_GOALS.map((g, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}
              style={{
                background: '#F9FAFB', borderRadius: 12, padding: '14px 16px',
                border: '1px solid #E5E7EB', cursor: 'default', display: 'flex', gap: 12, alignItems: 'flex-start'
              }}
            >
              <div style={{ fontSize: 28, flexShrink: 0 }}>{g.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>SDG {g.id} · {g.label}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
