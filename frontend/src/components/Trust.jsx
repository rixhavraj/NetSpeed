import React from 'react';
import { Lock, Heart, FileCode2 } from 'lucide-react';

const Trust = () => {
  return (
    <section className="py-24 border-t border-border/50 bg-[#020202]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-card flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No Data Collection</h3>
            <p className="text-zinc-400">We don't collect, store, or sell your network data. Everything stays on your local machine, forever.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-card flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Built for the Community</h3>
            <p className="text-zinc-400">Created out of frustration with bloated alternatives. Completely free, no ads, no premium tiers.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-card flex items-center justify-center mb-6">
              <FileCode2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Transparent Architecture</h3>
            <p className="text-zinc-400">Our code execution is transparent. Written in optimized C++ utilizing native Windows APIs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
