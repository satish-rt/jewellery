import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Collection', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-gold/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-8 md:px-16 lg:px-20 flex justify-between items-center h-20">

        {/* Logo */}
        <Logo size="sm" linkTo="/" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] font-light relative group transition-colors duration-200 ${
                  isActive ? 'text-gold' : 'text-gray-300 hover:text-gold'
                }`
              }
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Auth Area */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-l border-gold/20 pl-5">
                <span className="text-gold text-xs">✦</span>
                <span className="text-xs text-gray-400 tracking-widest uppercase truncate max-w-[120px]">
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-widest text-gray-600 hover:text-red-400 transition-colors duration-200">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-gold transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="text-xs uppercase tracking-[0.2em] bg-gold text-charcoal px-5 py-2 hover:bg-gold-200 transition-colors font-medium">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-cream p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0F0F0F] border-t border-gold/15 overflow-hidden">
            <nav className="flex flex-col px-8 py-6 gap-5">
              {navLinks.map(link => (
                <NavLink key={link.name} to={link.path} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-[0.2em] ${isActive ? 'text-gold' : 'text-gray-300'}`
                  }>
                  {link.name}
                </NavLink>
              ))}
              <div className="divider-gold my-1" />
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gold/70 tracking-widest uppercase">{user.name}</span>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-xs uppercase tracking-widest text-red-400">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm uppercase tracking-widest text-gray-400">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="bg-gold text-charcoal py-3 text-center text-sm uppercase tracking-widest font-medium">
                    Create Account
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;