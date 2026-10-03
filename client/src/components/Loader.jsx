import React from 'react';

const Loader = () => {
  return (
    <div className="w-12 h-12 relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-gold animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cream/30 animate-spin-reverse"></div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <Loader />
      <p className="mt-6 font-serif text-gold tracking-widest uppercase text-sm">Loading</p>
    </div>
  );
};

export default Loader;
