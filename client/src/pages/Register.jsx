import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account | Rajlaxmi Jewellers';
    if (user) navigate('/');
  }, [user]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password.trim();
    const cleanConfirm = form.confirm.trim();
    const cleanName = form.name.trim();
    const cleanPhone = form.phone.trim();

    if (cleanPassword !== cleanConfirm) { setError('Passwords do not match.'); return; }
    if (cleanPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await api.post('/users/register', { name: cleanName, email: cleanEmail, phone: cleanPhone, password: cleanPassword });
      navigate('/login', { state: { message: 'Account created successfully! Please login to continue.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1A1200 0%, #0F0F0F 100%)' }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(184,147,95,0.03) 40px, rgba(184,147,95,0.03) 41px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #B8935F 0%, transparent 70%)' }} />
        <div className="relative text-center px-12">
          <div className="text-gold text-6xl mb-8 opacity-40">◆</div>
          <h2 className="font-serif text-3xl text-cream mb-4 leading-tight">Discover Timeless<br />Jewellery</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Create your account to explore our exclusive collection of handcrafted gold and silver pieces.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {['BIS Hallmarked Gold', 'Custom Jewellery Orders', 'Expert Consultation'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <span className="text-gold text-xs">✦</span>
                <span className="text-gray-400 text-xs uppercase tracking-widest">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">

          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <Logo size="md" linkTo="/" />
            </div>
            <div className="mt-6 sm:mt-8 mb-1">
              <h1 className="font-serif text-2xl sm:text-3xl text-cream">Create Account</h1>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Join Rajlaxmi Jewellers to enquire and connect</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-950/30 border border-red-800/40 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={set('name')} required placeholder="Your full name" className="input-gold" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="your@email.com"
                  className="input-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="input-gold" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Min. 6 chars"
                    className="input-gold pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold text-xs transition-colors p-1"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Confirm *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={set('confirm')}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Re-enter password"
                    className="input-gold pr-12"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="mt-2 btn-gold-shimmer w-full py-3.5 sm:py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]">
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="divider-gold my-6" />

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-200 transition-colors">Login here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;