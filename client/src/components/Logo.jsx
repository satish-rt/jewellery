import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', linkTo = '/' }) => {
  const sizes = {
    sm: { container: 'gap-2', crown: 32, text: 'text-lg', sub: 'text-[8px]' },
    md: { container: 'gap-3', crown: 42, text: 'text-xl', sub: 'text-[9px]' },
    lg: { container: 'gap-4', crown: 56, text: 'text-2xl', sub: 'text-[10px]' },
    xl: { container: 'gap-4', crown: 72, text: 'text-3xl', sub: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  const LogoMark = () => (
    <svg width={s.crown} height={s.crown} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <path d="M12 38 L14 24 L22 32 L30 16 L38 32 L46 24 L48 38 Z" fill="url(#goldFill)" stroke="url(#goldGrad)" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="12" y="38" width="36" height="4" rx="1" fill="url(#goldFill)" />
      <circle cx="30" cy="16" r="2.5" fill="#F5DFA0" />
      <circle cx="14" cy="24" r="2" fill="#D4AF7A" />
      <circle cx="46" cy="24" r="2" fill="#D4AF7A" />
      <text x="21" y="36" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" fill="#1A1A1A" letterSpacing="-0.5">RJ</text>
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5DFA0" />
          <stop offset="50%" stopColor="#B8935F" />
          <stop offset="100%" stopColor="#8B6B3D" />
        </linearGradient>
        <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5DFA0" />
          <stop offset="100%" stopColor="#B8935F" />
        </linearGradient>
      </defs>
    </svg>
  );

  const content = (
    <div className={`flex items-center ${s.container}`}>
      <LogoMark />
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-semibold text-gold tracking-wider uppercase ${s.text}`}>Rajlaxmi</span>
        <span className={`tracking-[0.25em] text-gold/70 uppercase font-light ${s.sub}`}>Jewellers</span>
      </div>
    </div>
  );

  if (!linkTo) return content;
  return <Link to={linkTo}>{content}</Link>;
};

export default Logo;