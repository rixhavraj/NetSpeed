import React from 'react';
import { motion } from 'framer-motion';
import { Download, Zap, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center w-full px-4 md:px-6 pt-16 md:pt-24 pb-0 overflow-visible bg-transparent">
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-zinc-300 mb-8 shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="font-medium tracking-wide">v1.0.1 is now available</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-readable"
        >
          Real-time network speed. <br />
          <span className="text-gradient">Zero bloat.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed text-readable"
        >
          A beautifully minimal, always-on-top desktop widget for Windows that tracks your network activity without eating your system resources.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full"
        >
          <a href="#download" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            Download for Windows
          </a>
          <a href="#preview" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium text-lg text-zinc-300 hover:text-white glass hover:bg-white/10 transition-all active:scale-95">
            <Zap className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            Live Preview
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
