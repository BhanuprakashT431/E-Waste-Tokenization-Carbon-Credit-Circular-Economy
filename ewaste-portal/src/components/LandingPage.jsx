import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Coins, Zap, MapPin, Recycle, Building, User } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('consumer');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth & route based on role
    if (role === 'consumer') navigate('/user/dashboard');
    if (role === 'recycler') navigate('/recycler/dashboard');
    if (role === 'collector') navigate('/collector/dashboard');
    if (role === 'esg') navigate('/esg/dashboard');
  };

  return (
    <div className="landing-page" style={{backgroundColor: '#ffffff'}}>
      {/* HERO SECTION */}
      <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>

        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ zIndex: 1, textAlign: 'center', maxWidth: 800, padding: '0 24px' }}
        >
          <motion.div variants={fadeIn} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', padding: '8px 16px', borderRadius: 30, border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: 32, fontSize: 14, fontWeight: 500, color: '#10B981' }}>
            <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10B981' }}></span> Live on Blockchain
          </motion.div>
          
          <motion.h1 variants={fadeIn} style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, color: '#111827', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Tokenize E-Waste.<br/>
            <span style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offset Carbon.</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#4B5563', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 48px auto' }}>
            The transparent, incentivized ledger for the circular economy. Register devices, ensure sustainable recycling, and earn Carbon Credit Tokens (CCT).
          </motion.p>

          <motion.div variants={fadeIn}>
            <button onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })} style={{ background: '#10B981', color: 'white', padding: '16px 32px', borderRadius: 12, fontSize: 18, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              Get Started Now
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section style={{ padding: '80px 24px', background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
        <motion.div 
          style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            { icon: <ShieldCheck size={32} color="#10B981" />, title: "Immutable Tracking", desc: "Every device is securely tracked on-chain from registration to material extraction." },
            { icon: <Coins size={32} color="#3B82F6" />, title: "Carbon Credit Minting", desc: "Verified recycling automatically mints CCTs directly to your decentralized wallet." },
            { icon: <Zap size={32} color="#F59E0B" />, title: "AI Powered Verification", desc: "Advanced AI verifies hardware attributes ensuring 100% transparent recycling." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} style={{ background: 'white', padding: 40, borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{feature.title}</h3>
              <p style={{ color: '#4B5563', lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AUTH / REGISTRATION SECTION */}
      <section id="auth-section" style={{ padding: '100px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff' }}>
        <motion.div 
          style={{ width: '100%', maxWidth: 600, background: 'white', borderRadius: 24, padding: 48, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Join the Network</h2>
            <p style={{ color: '#6B7280' }}>Create an account or login to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Select Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { id: 'consumer', label: 'User', icon: <User size={20} />, color: '#10B981' },
                  { id: 'collector', label: 'Collector', icon: <MapPin size={20} />, color: '#8B5CF6' },
                  { id: 'recycler', label: 'Recycler', icon: <Recycle size={20} />, color: '#3B82F6' },
                  { id: 'esg', label: 'Enterprise', icon: <Building size={20} />, color: '#1F2937' },
                ].map((r) => (
                  <div 
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 12, cursor: 'pointer',
                      border: role === r.id ? `2px solid ${r.color}` : '1px solid #E5E7EB',
                      background: role === r.id ? `${r.color}0D` : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ color: role === r.id ? r.color : '#9CA3AF' }}>{r.icon}</div>
                    <span style={{ fontWeight: 600, color: role === r.id ? '#111827' : '#6B7280' }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 16, outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#10B981'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 16, outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#10B981'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #D1D5DB', fontSize: 16, outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#10B981'} onBlur={(e) => e.target.style.borderColor = '#D1D5DB'} />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: '#111827', color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#374151'} onMouseOut={(e) => e.currentTarget.style.background = '#111827'}>
              Continue to Dashboard
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
