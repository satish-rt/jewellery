import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AdminLayout = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '◈' },
    { name: 'Products', path: '/admin/products', icon: '◆' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: '✉' },
    { name: 'Users', path: '/admin/users', icon: '◇' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#141414] border-b md:border-b-0 md:border-r border-gold/15 flex flex-col z-20">
        <div className="p-5 flex justify-between items-center border-b border-gold/15">
          <Logo size="sm" linkTo={null} />
          <button className="md:hidden text-cream" onClick={() => setMobileMenu(!mobileMenu)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className={`${mobileMenu ? 'flex' : 'hidden'} md:flex flex-col gap-1 p-3 flex-grow`}>
          {navItems.map(item => (
            <NavLink key={item.name} to={item.path} onClick={() => setMobileMenu(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 transition-all duration-200 text-xs uppercase tracking-widest
                ${isActive ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-gray-400 hover:bg-gray-900/50 hover:text-cream border-l-2 border-transparent'}
              `}>
              <span className="text-lg leading-none">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className={`${mobileMenu ? 'block' : 'hidden'} md:block p-4 border-t border-gold/15`}>
          <div className="px-4 mb-3">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Logged in as</p>
            <p className="text-xs text-gold/70 truncate">{admin?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/20 transition-colors text-xs uppercase tracking-widest border border-red-900/30 hover:border-red-700/50">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#0F0F0F]">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;