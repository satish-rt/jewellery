import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const successMsg = location.state?.message;

  useEffect(() => {
    document.title = 'Login | Rajlaxmi Jewellers';
    if (user) navigate(from, { replace: true });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to reach the login service. Check the API configuration and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1A1200 0%, #0F0F0F 100%)' }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(184,147,95,0.03) 40px, rgba(184,147,95,0.03) 41px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #B8935F 0%, transparent 70%)' }} />
        <div className="relative text-center px-12">
          <div className="text-gold text-6xl mb-8 opacity-40">◆</div>
          <h2 className="font-serif text-3xl text-cream mb-4 leading-tight">Welcome Back<br />to Rajlaxmi</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Login to explore our complete collection of hallmarked gold and sterling silver jewellery.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {['Exclusive Collection Access', 'Product Enquiries', 'Personal Recommendations'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <span className="text-gold text-xs">✦</span>
                <span className="text-gray-400 text-xs uppercase tracking-widest">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-sm">

          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start">
              <Logo size="md" linkTo="/" />
            </div>
            <div className="mt-6 sm:mt-8 mb-1">
              <h1 className="font-serif text-2xl sm:text-3xl text-cream">Welcome Back</h1>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Login to access member features and enquire</p>
          </div>

          {successMsg && (
            <div className="mb-5 px-4 py-3 bg-gold/10 border border-gold/30 text-gold text-xs sm:text-sm">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-950/30 border border-red-800/40 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gold/60 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                placeholder="your@email.com"
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gold/60 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="Your password"
                  className="input-gold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold text-xs transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="mt-2 btn-gold-shimmer w-full py-3.5 sm:py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]">
              {loading ? 'Logging in...' : 'Login to Account →'}
            </button>
          </form>

          <div className="divider-gold my-6" />

          <p className="text-center text-gray-500 text-sm">
            New to Rajlaxmi Jewellers?{' '}
            <Link to="/register" className="text-gold hover:text-gold-200 transition-colors">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;