import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative z-10">
      <div className="glass-panel p-8 md:p-12 brutal-card border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] bg-[#04060f] text-center max-w-lg w-full">
        <h1 className="text-8xl font-black text-[#ec4899] mb-4 drop-shadow-[4px_4px_0_rgba(255,255,255,1)]">404</h1>
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Page Not Found</h2>
        <p className="text-zinc-400 mb-8 font-medium">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="brutal-button inline-flex items-center justify-center gap-3 px-8 py-4 font-black text-lg uppercase bg-[#3b82f6] border-4 border-white shadow-[6px_6px_0px_0px_#ffffff] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
