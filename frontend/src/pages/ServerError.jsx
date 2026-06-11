import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, AlertTriangle } from 'lucide-react';

const ServerError = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative z-10">
      <div className="glass-panel p-8 md:p-12 brutal-card border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] bg-[#04060f] text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-20 h-20 text-[#eab308]" />
        </div>
        <h1 className="text-5xl font-black text-white mb-4 uppercase drop-shadow-[4px_4px_0_rgba(234,179,8,1)]">500 Error</h1>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 text-zinc-300">Internal Server Error</h2>
        <p className="text-zinc-400 mb-8 font-medium">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="brutal-button inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-sm uppercase bg-[#ec4899] border-4 border-white shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff] transition-all"
          >
            <RotateCw className="w-4 h-4" />
            Refresh
          </button>
          <Link 
            to="/" 
            className="brutal-button inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-sm uppercase bg-black border-4 border-white shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff] transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServerError;
