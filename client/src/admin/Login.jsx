import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, admin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <PageLoader />;
  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password.trim());
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to reach the login service. Check the API configuration and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md bg-[#141414] p-6 sm:p-10 border border-gold/20 shadow-gold">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <Logo size="lg" linkTo={null} />
          <div className="divider-gold w-full mt-5 sm:mt-6 mb-4" />
          <p className="text-gold/60 text-xs tracking-widest uppercase">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-400 p-3 text-xs sm:text-sm mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              placeholder="admin@lumiere.com"
              className="w-full bg-black/40 border border-gray-800 focus:border-gold px-4 py-3 outline-none text-cream transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                placeholder="Admin password"
                className="w-full bg-black/40 border border-gray-800 focus:border-gold px-4 py-3 pr-11 outline-none text-cream transition-colors text-sm"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 btn-gold-shimmer w-full py-3.5 sm:py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;