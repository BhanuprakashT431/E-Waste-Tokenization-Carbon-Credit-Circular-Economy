import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/* ─── Role config ──────────────────────────────────────────────────────────── */
const ROLES = {
  user: {
    label: 'Consumer',
    emoji: '🌿',
    tagline: 'Log e-waste. Earn Carbon Credits.',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
    accent: '#10B981',
    light: '#ECFDF5',
    loginId: 'email',
    loginLabel: 'Registered Email',
    loginPlaceholder: 'you@email.com',
    registerFields: [
      { name: 'name',     label: 'Full Name',          type: 'text',     icon: '👤', placeholder: 'Arjun Sharma' },
      { name: 'email',    label: 'Email Address',       type: 'email',    icon: '📧', placeholder: 'arjun@email.com' },
      { name: 'password', label: 'Password',            type: 'password', icon: '🔐', placeholder: '••••••••' },
      { name: 'phone',    label: 'Phone Number',        type: 'tel',      icon: '📱', placeholder: '+91 98765 43210' },
      { name: 'address',  label: 'Permanent Address',   type: 'text',     icon: '🏠', placeholder: '123, MG Road, Bengaluru' },
    ],
    particles: ['♻️','🌱','🍃','💧','🌍','⚡','🌿'],
  },
  collector: {
    label: 'Collector',
    emoji: '🚴',
    tagline: 'Pick up. Navigate. Earn more.',
    gradient: 'linear-gradient(135deg, #3B0764 0%, #5B21B6 50%, #7C3AED 100%)',
    accent: '#8B5CF6',
    light: '#F5F3FF',
    loginId: 'id',
    loginLabel: 'Collector ID  (e.g. COL-AB12CD)',
    loginPlaceholder: 'COL-XXXXXX',
    registerFields: [
      { name: 'name',        label: 'Full Name',        type: 'text',     icon: '👤', placeholder: 'Ravi Kumar' },
      { name: 'email',       label: 'Email Address',    type: 'email',    icon: '📧', placeholder: 'ravi@email.com' },
      { name: 'password',    label: 'Password',         type: 'password', icon: '🔐', placeholder: '••••••••' },
      { name: 'phone',       label: 'Phone Number',     type: 'tel',      icon: '📱', placeholder: '+91 99887 76655' },
      { name: 'vehicleType', label: 'Vehicle Type',     type: 'select',   icon: '🚗', options: ['Bicycle','Scooter','Auto','Mini Van','Truck'] },
      { name: 'zone',        label: 'Operating Zone / City', type: 'text', icon: '📍', placeholder: 'Indiranagar, Bengaluru' },
    ],
    particles: ['🚴','📦','🗺️','⚡','🔑','📍','💰'],
  },
  recycler: {
    label: 'Recycler',
    emoji: '🏭',
    tagline: 'Verify. Process. Issue Tokens.',
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 50%, #2563EB 100%)',
    accent: '#3B82F6',
    light: '#EFF6FF',
    loginId: 'id',
    loginLabel: 'Recycler ID  (e.g. REC-AB12CD)',
    loginPlaceholder: 'REC-XXXXXX',
    registerFields: [
      { name: 'companyName',   label: 'Company Name',      type: 'text',  icon: '🏢', placeholder: 'GreenTech Recycling Pvt Ltd' },
      { name: 'name',          label: 'Contact Person',    type: 'text',  icon: '👤', placeholder: 'Priya Nair' },
      { name: 'email',         label: 'Official Email',    type: 'email', icon: '📧', placeholder: 'priya@greentech.com' },
      { name: 'password',      label: 'Password',          type: 'password', icon: '🔐', placeholder: '••••••••' },
      { name: 'phone',         label: 'Phone Number',      type: 'tel',   icon: '📱', placeholder: '+91 80 2345 6789' },
      { name: 'licenseNumber', label: 'Recycler License No.', type: 'text', icon: '📜', placeholder: 'KSPCB/REC/2024/001' },
      { name: 'facilityAddress', label: 'Facility Address', type: 'text', icon: '🏭', placeholder: 'Industrial Area, Peenya, Bengaluru' },
    ],
    particles: ['🏭','♻️','🔬','⚗️','🤖','💡','🌿'],
  },
  esg: {
    label: 'ESG Officer',
    emoji: '🌍',
    tagline: 'Track Impact. Report Compliance.',
    gradient: 'linear-gradient(135deg, #042F2E 0%, #0F766E 50%, #0D9488 100%)',
    accent: '#14B8A6',
    light: '#F0FDFA',
    loginId: 'id',
    loginLabel: 'ESG ID  (e.g. ESG-AB12CD)',
    loginPlaceholder: 'ESG-XXXXXX',
    registerFields: [
      { name: 'companyName', label: 'Organisation Name', type: 'text',     icon: '🏛️', placeholder: 'Infosys Ltd / TATA Group' },
      { name: 'name',        label: 'Officer Name',      type: 'text',     icon: '👤', placeholder: 'Sneha Reddy' },
      { name: 'email',       label: 'Official Email',    type: 'email',    icon: '📧', placeholder: 'sneha@infosys.com' },
      { name: 'password',    label: 'Password',          type: 'password', icon: '🔐', placeholder: '••••••••' },
      { name: 'phone',       label: 'Phone Number',      type: 'tel',      icon: '📱', placeholder: '+91 44 6789 0123' },
      { name: 'department',  label: 'Department',        type: 'text',     icon: '🏷️', placeholder: 'Sustainability & ESG Compliance' },
      { name: 'gstNumber',   label: 'GST / CIN Number',  type: 'text',     icon: '📋', placeholder: '27AAAPL1234C1Z5' },
    ],
    particles: ['🌍','📊','🌿','💹','🇺🇳','📈','⚖️'],
  },
};

const DASHBOARD = {
  user:      '/user/dashboard',
  collector: '/collector/dashboard',
  recycler:  '/recycler/dashboard',
  esg:       '/esg/dashboard',
};

/* ─── Floating particle ──────────────────────────────────────────────────── */
function FloatingParticle({ emoji, i }) {
  const x    = Math.random() * 90 + 5;
  const dur  = 12 + Math.random() * 10;
  const del  = Math.random() * 6;
  const size = 20 + Math.random() * 20;
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, bottom: '-5%', fontSize: size, opacity: 0.15, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}
      animate={{ y: [0, -(window.innerHeight + 100)] }}
      transition={{ duration: dur, delay: del, repeat: Infinity, ease: 'linear' }}
    >
      {emoji}
    </motion.div>
  );
}

/* ─── Input field ──────────────────────────────────────────────────────────── */
function Field({ field, value, onChange, accent }) {
  const [focused, setFocused] = useState(false);

  if (field.type === 'select') {
    return (
      <div style={{ position: 'relative' }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>
          {field.icon} &nbsp;{field.label}
        </label>
        <select
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          required
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
            background: focused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
            border: `1.5px solid ${focused ? accent : 'rgba(255,255,255,0.2)'}`,
            color: 'white', outline: 'none', cursor: 'pointer', transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <option value="" style={{ background: '#1a1a2e' }}>Select…</option>
          {field.options.map(o => <option key={o} value={o} style={{ background: '#1a1a2e' }}>{o}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>
        {field.icon} &nbsp;{field.label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type={field.type}
        value={value || ''}
        onChange={e => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        required
        autoComplete="off"
        style={{
          width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14,
          background: focused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
          border: `1.5px solid ${focused ? accent : 'rgba(255,255,255,0.2)'}`,
          color: 'white', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function AuthPage() {
  const { role = 'user' } = useParams();
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const cfg = ROLES[role] || ROLES.user;

  const [mode,    setMode]    = useState('login');   // 'login' | 'register'
  const [form,    setForm]    = useState({});
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [regId,   setRegId]   = useState('');
  const [showPw,  setShowPw]  = useState(false);

  useEffect(() => { setForm({}); setError(''); setSuccess(''); setRegId(''); }, [role, mode]);

  const setField = (name, val) => setForm(f => ({ ...f, [name]: val }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(role, form);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    setRegId(result.id);
    setSuccess(`🎉 Registration successful! Your ${cfg.label} ID is:`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(role, loginId.trim(), loginPw);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    navigate(DASHBOARD[role]);
  };

  const particles = cfg.particles;

  return (
    <div style={{ minHeight: '100vh', background: cfg.gradient, position: 'relative', overflow: 'hidden', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Floating background particles */}
      {[...Array(14)].map((_, i) => (
        <FloatingParticle key={i} emoji={particles[i % particles.length]} i={i} />
      ))}

      {/* Blurred orbs */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Back to home */}
      <Link to="/" style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
        ← Back to Home
      </Link>

      {/* Role switcher pills */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 8 }}>
        {Object.entries(ROLES).map(([r, c]) => (
          <motion.button
            key={r}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/auth/${r}`)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: r === role ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
              color: r === role ? '#111827' : 'rgba(255,255,255,0.8)',
              transition: 'all 0.2s'
            }}
          >
            {c.emoji} {c.label}
          </motion.button>
        ))}
      </div>

      {/* ── Left hero panel (desktop) ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 60px', position: 'relative', zIndex: 1 }}
        className="auth-hero"
      >
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ fontSize: 100, marginBottom: 24, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
        >
          {cfg.emoji}
        </motion.div>
        <motion.h1
          key={role + 'h'}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 42, fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: 12, lineHeight: 1.1 }}
        >
          {cfg.label} Portal
        </motion.h1>
        <motion.p
          key={role + 'p'}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
        >
          {cfg.tagline}
        </motion.p>

        {/* Platform stats decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 340, width: '100%' }}
        >
          {[
            { label: 'Devices Recycled', val: '12,450+' },
            { label: 'CC Tokens Issued', val: '2.4M+' },
            { label: 'CO₂ Avoided',      val: '18.6 Tons' },
            { label: 'Active Users',     val: '3,200+' },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right form panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 40px 60px', position: 'relative', zIndex: 1 }}
      >
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 28,
          backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)', padding: '36px 36px', boxSizing: 'border-box'
        }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 4, marginBottom: 28 }}>
            {['login', 'register'].map(m => (
              <motion.button
                key={m}
                onClick={() => setMode(m)}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  background: mode === m ? 'rgba(255,255,255,0.9)' : 'transparent',
                  color: mode === m ? '#111827' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.25s', textTransform: 'capitalize'
                }}
              >
                {m === 'login' ? '🔓 Login' : '✨ Register'}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Registration success ── */}
            {success && regId ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Welcome aboard!</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 20 }}>{success}</p>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: '18px 24px', marginBottom: 24, border: `2px solid ${cfg.accent}` }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 1 }}>YOUR UNIQUE ID — SAVE THIS!</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: cfg.accent, letterSpacing: 2, fontFamily: 'monospace' }}>{regId}</div>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>
                  {role === 'user' ? 'Use your email + password to login.' : 'Use this ID + your password to login.'}
                </p>
                <button onClick={() => { setMode('login'); setSuccess(''); setRegId(''); }}
                  style={{ background: cfg.accent, color: 'white', padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
                  Proceed to Login →
                </button>
              </motion.div>

            /* ── Login form ── */
            ) : mode === 'login' ? (
              <motion.form key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome back {cfg.emoji}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Sign in to your {cfg.label} account</p>
                </div>

                <Field
                  field={{ name: '_id', label: cfg.loginLabel, type: cfg.loginId === 'email' ? 'email' : 'text', icon: cfg.loginId === 'email' ? '📧' : '🪪', placeholder: cfg.loginPlaceholder }}
                  value={loginId} onChange={(_, v) => setLoginId(v)} accent={cfg.accent}
                />
                <div style={{ position: 'relative' }}>
                  <Field
                    field={{ name: '_pw', label: 'Password', type: showPw ? 'text' : 'password', icon: '🔐', placeholder: '••••••••' }}
                    value={loginPw} onChange={(_, v) => setLoginPw(v)} accent={cfg.accent}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    style={{ position: 'absolute', right: 14, bottom: 13, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#FCA5A5' }}>
                    ⚠️ {error}
                  </motion.div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  style={{ background: cfg.accent, color: 'white', padding: '15px', borderRadius: 14, border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 4, boxShadow: `0 8px 24px ${cfg.accent}50` }}>
                  {loading ? '⏳ Signing in...' : `Sign In as ${cfg.label} →`}
                </motion.button>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
                  No account? &nbsp;
                  <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: cfg.accent, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Register here
                  </button>
                </p>
              </motion.form>

            /* ── Register form ── */
            ) : (
              <motion.form key="register" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                onSubmit={handleRegister}>
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create Account {cfg.emoji}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Join as a {cfg.label} and start your green journey</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '50vh', overflowY: 'auto', paddingRight: 4, marginBottom: 16 }}>
                  {cfg.registerFields.map(field => (
                    <Field key={field.name} field={field} value={form[field.name]} onChange={setField} accent={cfg.accent} />
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#FCA5A5', marginBottom: 14 }}>
                    ⚠️ {error}
                  </motion.div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  style={{ width: '100%', background: cfg.accent, color: 'white', padding: '15px', borderRadius: 14, border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 24px ${cfg.accent}50` }}>
                  {loading ? '⏳ Creating account...' : `Register as ${cfg.label} →`}
                </motion.button>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 14 }}>
                  Already registered? &nbsp;
                  <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: cfg.accent, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Login here
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
