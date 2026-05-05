import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ArrowUp, ArrowDown, Settings, 
  Monitor, Wifi, Zap, Layout, Play, Clock
} from 'lucide-react';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-12 w-full max-w-5xl px-4 md:px-0 mx-auto"
    >
      <div 
        className="rounded-3xl overflow-hidden p-1 md:p-2"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="bg-[#050505] rounded-2xl overflow-hidden flex flex-col md:flex-row h-[500px] text-[11px] select-none border border-white/5 shadow-2xl">
          {/* App Sidebar */}
          <div className="hidden md:flex w-52 border-r border-white/5 bg-white/[0.02] flex-col p-4 gap-6">
            <div className="flex items-center gap-2 px-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Activity size={14} className="text-white" />
              </div>
              <span className="font-black text-white text-sm tracking-tight">NetSpeed <span className="text-[10px] text-primary">Pro</span></span>
            </div>

            <div className="flex flex-col gap-1">
              <SidebarItem icon={<Activity size={14} />} label="Live Monitor" active />
              <SidebarItem icon={<Clock size={14} />} label="Usage History" />
              <SidebarItem icon={<Wifi size={14} />} label="Network Adapters" />
              <SidebarItem icon={<Layout size={14} />} label="Widget Styles" />
            </div>

            <div className="mt-auto flex flex-col gap-1">
              <SidebarItem icon={<Settings size={14} />} label="Preferences" />
              <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-[10px] font-bold text-primary mb-1">PRO TIP</p>
                <p className="text-[9px] text-zinc-400 leading-tight">Drag the widget anywhere to pin it on top of your windows.</p>
              </div>
            </div>
          </div>

          {/* Main Monitor View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
            {/* Window Header */}
            <div className="h-12 border-b border-white/5 bg-[#050505] flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <span className="font-bold text-white">Ethernet Adapter 2</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">ACTIVE</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Monitor size={12} />
                  <span>Always on Top</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Speed Card */}
                <div className="flex-1 bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={40} className="text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Current Throughput</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">142.84</span>
                    <span className="text-sm text-zinc-500 font-medium">MB/s</span>
                  </div>

                  <div className="flex gap-4 mt-2">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold">Download</span>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                        <ArrowDown size={10} />
                        <span>128.5 MB/s</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold">Upload</span>
                      <div className="flex items-center gap-1 text-blue-400 font-bold text-xs">
                        <ArrowUp size={10} />
                        <span>14.3 MB/s</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Graph */}
                  <div className="h-16 w-full mt-4 opacity-50">
                    <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                      <path 
                        d="M0,80 C50,75 100,90 150,60 C200,30 250,50 300,20 C350,-10 400,10 400,10" 
                        fill="none" 
                        stroke="var(--color-primary)" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Network Health Card */}
                <div className="w-full lg:w-72 bg-white/[0.02] rounded-2xl border border-white/5 p-6 flex flex-col shadow-sm">
                  <span className="font-bold text-white mb-4">Network Health</span>
                  <div className="space-y-4">
                    <StatRow label="Latency (Ping)" value="12ms" status="Excellent" color="emerald" />
                    <StatRow label="Jitter" value="2ms" status="Stable" color="emerald" />
                    <StatRow label="Packet Loss" value="0.0%" status="Perfect" color="emerald" />
                    <StatRow label="Uptime" value="14d 2h" status="Solid" color="blue" />
                  </div>
                </div>
              </div>

              {/* Connected Apps List */}
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Active Connections</span>
                  <span className="text-[10px] text-zinc-500">6 Apps Monitored</span>
                </div>
                <div className="space-y-3">
                  <AppRow name="Google Chrome" usage="85.2 MB/s" />
                  <AppRow name="Spotify" usage="1.2 MB/s" />
                  <AppRow name="Visual Studio Code" usage="0.4 MB/s" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${active ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="tracking-tight">{label}</span>
  </div>
);

const StatRow = ({ label, value, status, color }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[10px]">
      <span className="text-zinc-500">{label}</span>
      <span className={`text-${color}-400 font-bold`}>{status}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

const AppRow = ({ name, usage }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <span className="text-zinc-300">{name}</span>
    <span className="font-mono text-zinc-500">{usage}</span>
  </div>
);

export default Dashboard;
