import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#141414] p-10 border border-gold/20 shadow-gold">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" linkTo={null} />
          <div className="divider-gold w-full mt-6 mb-4" />
          <p className="text-gold/60 text-xs tracking-widest uppercase">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-400 p-3 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Admin Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 focus:border-gold px-4 py-2.5 outline-none text-cream transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold/60 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 focus:border-gold px-4 py-2.5 outline-none text-cream transition-colors text-sm" />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="mt-3 btn-gold-shimmer w-full py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;