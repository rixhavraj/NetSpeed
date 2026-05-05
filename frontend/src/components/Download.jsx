import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getDownloadUrl } from '../services/api';
import versionsData from '../data/versions.json';

const Download = () => {
  const [versionInfo] = useState(versionsData[0]);

  return (
    <section id="download" className="py-40 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/2 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white text-readable">Ready to upgrade?</h2>
        <p className="text-2xl text-zinc-300 mb-16 font-light text-readable">Download the ultra-lightweight NetSpeed widget for Windows.</p>

        <div className="glass rounded-[2.5rem] p-10 md:p-16 border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Animated gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-80"></div>
          
          <div className="flex flex-col items-center">
            <div className="mb-10">
              <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">Latest Stable Release</span>
              <h3 className="text-4xl font-black text-white mt-3 tracking-tight">Version {versionInfo.version}</h3>
              <p className="text-zinc-500 mt-3">{versionInfo.changes[0]}</p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
            >
              <a 
                href="https://github.com/rixhavraj/NetSpeed/releases/download/v1.0.2/net-speed-v1.0.2.exe" 
                download="net-speed-v1.0.2.exe"
                className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)]"
              >
                <DownloadIcon className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                <span>Download for Windows</span>
              </a>
            </motion.div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400 mb-8 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Windows 10/11</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> {versionInfo.size} Nano-build</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> No Telemetry</span>
            </div>

            <div className="max-w-lg mx-auto p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-500/80 text-left leading-relaxed">
              <p className="font-bold text-yellow-500 mb-1 uppercase tracking-wider text-[10px]">SmartScreen Note</p>
              <p>Because this is a brand new application, Windows SmartScreen may flag the download. After Downloading Click <strong>"See more/Three Dots" &rarr; "Keep"</strong> in your browser, and <strong>"More info" &rarr; "Run anyway"</strong> in Windows to install safely.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;
