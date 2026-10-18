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
    { name: 'Gold', path: '/shop?category=gold' },
    { name: 'Silver', path: '/shop?category=silver' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-gold/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
        : 'bg-[#0F0F0F]/80 backdrop-blur-sm sm:bg-transparent border-b border-gold/10 sm:border-transparent'
    }`}>
      {/* Top subtle badge strip for mobile & desktop */}
      <div className="bg-[#120F02] border-b border-gold/10 py-1 px-4 text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold/80 font-light truncate">
          ✦ 100% BIS Hallmarked 22K Gold & 925 Sterling Silver • Mumbai Atelier
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-20 flex justify-between items-center h-16 sm:h-20">

        {/* Logo */}
        <Logo size="sm" linkTo="/" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.2em] font-light relative group transition-colors duration-200 ${
                  isActive ? 'text-gold font-medium' : 'text-gray-300 hover:text-gold'
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
                <span className="text-xs text-gold/90 tracking-widest uppercase truncate max-w-[120px]">
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors duration-200">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs uppercase tracking-[0.2em] text-gray-300 hover:text-gold transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="text-xs uppercase tracking-[0.2em] bg-gold text-charcoal px-5 py-2 hover:bg-gold-200 transition-colors font-medium">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:+919821593191"
            className="text-gold p-2 border border-gold/30 rounded-sm bg-gold/5 flex items-center justify-center text-xs"
            aria-label="Call Store"
            title="Call Store"
          >
            <span>📞</span>
          </a>
          <button
            className="text-cream p-2 border border-gold/20 rounded-sm bg-[#141414]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0F0F0F]/98 border-t border-gold/20 shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <nav className="flex flex-col px-6 py-5 gap-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.25em] py-2 border-b border-gray-900 transition-colors flex items-center justify-between ${
                      isActive ? 'text-gold font-semibold' : 'text-gray-300'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <span className="text-gold/40 text-xs">›</span>
                </NavLink>
              ))}

              <div className="divider-gold my-1" />

              {user ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-xs">✦</span>
                    <span className="text-xs text-gold tracking-widest uppercase">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-xs uppercase tracking-widest text-red-400 py-1 px-3 border border-red-500/30 bg-red-950/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center py-2.5 border border-gold/40 text-xs uppercase tracking-widest text-gold bg-gold/5"
                  >
                    Login to Account
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-gold text-charcoal py-3 text-center text-xs uppercase tracking-widest font-semibold shadow-gold"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Direct Store Contact Info */}
              <div className="mt-2 pt-3 border-t border-gray-900 text-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Direct Store Help</p>
                <a href="tel:+919821593191" className="text-gold text-xs font-serif">+91 9821593191</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;