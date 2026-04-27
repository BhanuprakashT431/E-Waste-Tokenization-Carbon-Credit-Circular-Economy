import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  {
    id: 'user',
    emoji: '🌿',
    label: 'Consumer',
    desc: 'Log your e-waste, share your location, earn Carbon Credit Tokens for every pickup.',
    gradient: 'linear-gradient(135deg, #065F46, #059669)',
    glow: 'rgba(16,185,129,0.3)',
    tags: ['Log Devices', 'Earn CC Tokens', 'Track Pickups'],
  },
  {
    id: 'collector',
    emoji: '🚴',
    label: 'Collector',
    desc: 'Accept pickup requests, navigate via live map, verify with secure codes, earn per delivery.',
    gradient: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
    glow: 'rgba(139,92,246,0.3)',
    tags: ['Route Navigation', 'Pickup Codes', 'Earn per kg'],
  },
  {
    id: 'recycler',
    emoji: '🏭',
    label: 'Recycler',
    desc: 'Use Integrity AI to verify e-waste, identify reusable parts, and issue CC tokens.',
    gradient: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
    glow: 'rgba(59,130,246,0.3)',
    tags: ['AI Verification', 'Part Analysis', 'Token Issuance'],
  },
  {
    id: 'esg',
    emoji: '🌍',
    label: 'ESG Officer',
    desc: 'Track your organisation\'s environmental impact, CO₂ reduction, and UN SDG compliance.',
    gradient: 'linear-gradient(135deg, #042F2E, #0D9488)',
    glow: 'rgba(20,184,166,0.3)',
    tags: ['ESG Reports', 'UN SDG Alignment', 'Carbon Market'],
  },
];

const FEATURES = [
  { icon: '🔐', title: 'Secure Pickup Flow',  desc: '4-digit codes ensure only authorised collectors can confirm pickups at the doorstep.' },
  { icon: '🤖', title: 'Integrity AI Engine', desc: 'AI scans every item to identify reusable components and calculate accurate carbon offsets.' },
  { icon: '🌿', title: 'Carbon Credit Tokens', desc: 'Every verified item generates CC tokens (1 kg e-waste = 1 CC) ready for ESG reporting.' },
  { icon: '🗺️', title: 'Live Route Tracking',  desc: 'Collectors navigate from their GPS position to the user\'s pickup point in real time.' },
  { icon: '📊', title: 'Analytics Dashboard',  desc: 'Real-time charts and milestones track your environmental impact across all roles.' },
  { icon: '🔄', title: 'Circular Economy',      desc: 'Reusable parts are catalogued and routed to repair markets, closing the waste loop.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

  return (
    <div style={{ background: '#0A0F0D', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: 'white', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: 'blur(20px)', background: 'rgba(10,15,13,0.8)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#10B981,#3B82F6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>♻️</div>
          <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg,#10B981,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>E-Waste Ledger</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {ROLES.map(r => (
            <motion.button key={r.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/auth/${r.id}`)}
              style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {r.emoji} {r.label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%',  width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '8px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600, color: '#10B981', marginBottom: 28 }}>
          <motion.span animate={{ scale: [1,1.4,1] }} transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
          Verified Circular Economy — Live on Blockchain
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
          style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.03em' }}>
          Tokenize E-Waste.<br />
          <span style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Offset Carbon.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.55)', maxWidth: 580, lineHeight: 1.7, marginBottom: 48 }}>
          A multi-stakeholder circular economy platform connecting consumers, collectors, recyclers, and ESG officers — powered by AI verification and carbon credit tokenization.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(16,185,129,0.4)' }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth/user')}
            style={{ background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', padding: '16px 36px', borderRadius: 14, border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            🌿 Get Started Free
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('roles-section').scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '16px 36px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            Explore Roles ↓
          </motion.button>
        </motion.div>

        {/* Live stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 40, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['12,450+','Devices Recycled'],['2.4M+','CC Tokens Issued'],['18.6 Tons','CO₂ Avoided'],['3,200+','Active Users']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(90deg,#10B981,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── ROLE CARDS ── */}
      <section id="roles-section" style={{ padding: '80px 32px' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, marginBottom: 12 }}>
            Choose Your Role
          </motion.h2>
          <motion.p variants={fadeUp} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 52 }}>
            Each stakeholder has a dedicated portal, tailored workflows, and a unique earning model.
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
            {ROLES.map((r, i) => (
              <motion.div
                key={r.id}
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: `0 24px 60px ${r.glow}` }}
                onClick={() => navigate(`/auth/${r.id}`)}
                style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.09)', padding: 28, cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
              >
                {/* gradient swatch */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: r.gradient, borderRadius: '24px 24px 0 0' }} />
                <div style={{ fontSize: 44, marginBottom: 14 }}>{r.emoji}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{r.label}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20 }}>{r.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {r.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                  Register / Login →
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, marginBottom: 48 }}>
            Platform Features
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 16 }}>Ready to make an impact?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            Join the growing network of conscious recyclers and start earning carbon credits today.
          </p>
          <motion.button whileHover={{ scale: 1.06, boxShadow: '0 20px 50px rgba(16,185,129,0.5)' }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth/user')}
            style={{ background: 'linear-gradient(135deg,#10B981,#3B82F6)', color: 'white', padding: '18px 48px', borderRadius: 16, border: 'none', fontSize: 18, fontWeight: 800, cursor: 'pointer' }}>
            🌿 Join as Consumer →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
        E-Waste Tokenization & Carbon Credit Circular Economy · Google Solution Challenge 2024
      </div>
    </div>
  );
}
