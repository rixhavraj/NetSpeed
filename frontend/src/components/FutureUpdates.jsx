import React from 'react';
import { motion } from 'framer-motion';
import { Radar, AlertTriangle, MonitorPlay, AppWindow, HardDriveDownload, Sparkles } from 'lucide-react';

const FutureUpdates = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent z-10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 mb-6 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Coming Soon in v2.0</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
          >
            Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Hidden Bandwidth</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl font-light"
          >
            Ever wonder why your ping just spiked? In our next major update, Net-Speed will intelligently detect and alert you when background apps hog your bandwidth without your action.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: The "Detection" Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-8 relative shadow-2xl overflow-hidden"
          >
             {/* Radar scan animation effect */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-[300px] h-[300px] border border-purple-500/50 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute w-[200px] h-[200px] border border-pink-500/50 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1s'}}></div>
             </div>

             <div className="relative z-10 flex items-center justify-between bg-black/60 border border-red-500/30 rounded-2xl p-5 mb-8 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                     <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Speed Spike Detected!</h4>
                    <p className="text-sm text-red-300">No active user action</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-black text-xl tabular-nums">145.2 Mbps</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Usage</p>
                </div>
             </div>

             <div className="relative z-10 flex items-center justify-center py-12">
                <Radar className="w-32 h-32 text-purple-400 animate-[spin_4s_linear_infinite]" />
             </div>
             
             <div className="relative z-10 text-center mt-4">
                <p className="text-purple-300 font-semibold tracking-wide animate-pulse">Scanning background processes...</p>
             </div>
          </motion.div>

          {/* Right Side: Examples */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
             <h3 className="text-2xl font-bold text-white mb-8">It Identifies the Culprits:</h3>
             
             <div className="group flex items-center gap-5 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 p-6 rounded-2xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <AppWindow className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Windows Updates</h4>
                  <p className="text-zinc-400 leading-relaxed">Detects silent OS updates downloading aggressively in the background.</p>
                </div>
             </div>

             <div className="group flex items-center gap-5 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 p-6 rounded-2xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <HardDriveDownload className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Game Downloads</h4>
                  <p className="text-zinc-400 leading-relaxed">Identifies Steam, Epic Games, or Xbox app auto-updating your library.</p>
                </div>
             </div>

             <div className="group flex items-center gap-5 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 p-6 rounded-2xl transition-all">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MonitorPlay className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Hidden Browser Tabs</h4>
                  <p className="text-zinc-400 leading-relaxed">Finds hidden auto-playing videos or heavy web apps eating your bandwidth.</p>
                </div>
             </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FutureUpdates;
