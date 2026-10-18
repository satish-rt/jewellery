import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const MobileBottomNav = () => {
  const { user } = useUser();
  const location = useLocation();

  // Don't show on admin or login/register pages
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      path: '/',
      exact: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Shop',
      path: '/shop',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'About',
      path: '/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: user ? (user.name?.split(' ')[0] || 'Profile') : 'Login',
      path: user ? '/contact' : '/login',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101010]/95 backdrop-blur-md border-t border-gold/20 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] transition-all duration-200 rounded-lg ${
                isActive
                  ? 'text-gold scale-105'
                  : 'text-gray-400 hover:text-gold/80'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#B8935F]" />
                )}
              </div>
              <span className={`text-[10px] tracking-wider uppercase mt-1 font-medium ${isActive ? 'text-gold font-semibold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
