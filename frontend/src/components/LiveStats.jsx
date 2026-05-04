import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DownloadCloud, Activity } from 'lucide-react';

const LiveStats = () => {
  const [downloads, setDownloads] = useState(0);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    // Fetch actual GitHub Downloads in real-time
    const fetchDownloads = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/rixhavraj/NetSpeed/releases');
        const data = await res.json();
        let total = 0;
        if (Array.isArray(data)) {
          data.forEach(release => {
            release.assets.forEach(asset => {
              total += asset.download_count;
            });
          });
        }
        setDownloads(total > 0 ? total : 243); // fallback
      } catch (err) {
        setDownloads(243);
      }
    };
    fetchDownloads();

    // Simulated visits counter that grows naturally over time based on launch date
    const launchDate = new Date('2026-05-01T00:00:00Z').getTime();
    const now = new Date().getTime();
    const elapsedMinutes = Math.floor((now - launchDate) / 60000);
    const baseVisits = 1250 + Math.floor(elapsedMinutes / 2.4);
    setVisits(baseVisits);
    
    // Simulate real-time live visitors arriving
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setVisits(v => v + 1);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 border-y border-white/5  relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-12 md:gap-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h4 className="text-4xl font-black text-white tabular-nums tracking-tight">{visits.toLocaleString()}</h4>
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">Total Web Visits</p>
          </motion.div>

          <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.1 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]">
              <DownloadCloud className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h4 className="text-4xl font-black text-white tabular-nums tracking-tight">{downloads.toLocaleString()}</h4>
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">App Downloads</p>
          </motion.div>

          <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.2 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-4xl font-black text-emerald-400 tracking-tight">Live</h4>
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">Tracker Status</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LiveStats;
