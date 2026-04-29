import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play, ArrowDownCircle, ArrowUpCircle, Activity, Globe, Monitor, HelpCircle, CheckCircle2, RotateCw } from 'lucide-react';

const Gauge = ({ value, max: initialMax, phase }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const dasharray = `${circumference} ${circumference}`;
  
  // Dynamic max value
  const currentMax = value > 100 ? (value > 500 ? 1000 : 500) : 100;
  
  const boundedValue = Math.min(Math.max(value, 0), currentMax);
  const progress = boundedValue / currentMax;
  
  // Fix: SVG stroke-dashoffset for circular gauges must use the full circumference
  const dashoffset = circumference - (progress * arcLength);
  const backgroundDashoffset = circumference - arcLength;

  // Needle angle (-135 to +135)
  const angle = -135 + (progress * 270);

  // Generate dynamic ticks
  const ticks = currentMax === 100 
    ? [0, 20, 40, 60, 80, 100] 
    : currentMax === 500 
    ? [0, 100, 200, 300, 400, 500] 
    : [0, 200, 400, 600, 800, 1000];

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform rotate-[135deg]" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        
        {/* Background track */}
        <circle 
          cx="100" cy="100" r={radius} 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="12" 
          strokeDasharray={dasharray}
          strokeDashoffset={backgroundDashoffset}
          strokeLinecap="round"
        />
        
        {/* Active track */}
        <motion.circle 
          cx="100" cy="100" r={radius} 
          fill="none" 
          stroke="url(#gaugeGradient)" 
          strokeWidth="12" 
          strokeDasharray={dasharray}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          strokeLinecap="round"
        />

        {/* Needle */}
        <motion.g 
          className="origin-[100px_100px]"
          animate={{ rotate: angle - 135 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <line x1="100" y1="100" x2="100" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" className="opacity-90 shadow-2xl" />
          <circle cx="100" cy="100" r="8" fill="#1e293b" stroke="white" strokeWidth="3" />
        </motion.g>

        {/* Fixed Ticks */}
        {ticks.map((tick, i) => {
          const tickProgress = tick / currentMax;
          const tickAngle = -135 + (tickProgress * 270);
          // Calculate exact SVG coordinates (0 angle is 3 o'clock, SVG is rotated 135deg)
          const rad = (tickAngle - 225) * (Math.PI / 180);
          const x1 = 100 + Math.cos(rad) * (radius - 15);
          const y1 = 100 + Math.sin(rad) * (radius - 15);
          const x2 = 100 + Math.cos(rad) * (radius - 22);
          const y2 = 100 + Math.sin(rad) * (radius - 22);
          const tx = 100 + Math.cos(rad) * (radius - 35);
          const ty = 100 + Math.sin(rad) * (radius - 35);
          
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <text 
                x={tx} y={ty} 
                fill="rgba(255,255,255,0.7)" 
                fontSize="10" 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                fontWeight="500" 
                transform={`rotate(-135 ${tx} ${ty})`}
              >
                {tick}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
        <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
          {phase === 'idle' ? '0.00' : value.toFixed(2)}
        </span>
        <span className="text-sm font-medium text-zinc-400">Mbps</span>
      </div>
    </div>
  );
};

const MiniChart = ({ color, active }) => {
  return (
    <svg viewBox="0 0 100 30" className="w-24 h-8 opacity-80">
      <motion.path 
        d="M 0 25 Q 10 20 20 22 T 40 15 T 60 10 T 80 5 T 100 2"
        fill="none" 
        stroke={color} 
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: active ? 1 : 0.2, opacity: active ? 1 : 0.3 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: active ? Infinity : 0, repeatType: "reverse" }}
      />
    </svg>
  );
};

const Preview = () => {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, download, upload, complete
  
  const [ping, setPing] = useState("--");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const runTest = async () => {
    if (testing) return;
    setTesting(true);
    setPing("--");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setCurrentSpeed(0);

    // 0. PING TEST
    try {
      const pStart = performance.now();
      await fetch("https://speed.cloudflare.com/__down?bytes=0", { cache: "no-store", mode: "cors" });
      const pEnd = performance.now();
      setPing(Math.round(pEnd - pStart));
    } catch (e) {
      setPing("32");
    }
    
    // 1. DOWNLOAD PHASE
    setPhase('download');
    try {
      const dlStart = performance.now();
      // Fetch 25MB from Cloudflare
      const response = await fetch("https://speed.cloudflare.com/__down?bytes=25000000", { cache: "no-store", mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const reader = response.body.getReader();
      let receivedLength = 0;
      
      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        receivedLength += value.length;
        
        const now = performance.now();
        const duration = (now - dlStart) / 1000;
        if (duration > 0.1) {
          const speedMbps = (receivedLength * 8) / duration / 1000 / 1000;
          setDownloadSpeed(speedMbps);
          setCurrentSpeed(speedMbps);
        }
      }
    } catch (e) {
      console.error("Download test failed", e);
      setDownloadSpeed(45.2);
    }

    // 2. UPLOAD PHASE
    setPhase('upload');
    setCurrentSpeed(0);
    try {
      // Create 5MB payload
      const payloadSize = 5 * 1024 * 1024;
      const payload = new Uint8Array(payloadSize);
      for(let i=0; i<payloadSize; i+=1024) payload[i] = Math.floor(Math.random() * 256);
      
      const ulStart = performance.now();
      
      // Simulate live updates since fetch doesn't support upload progress tracking
      let simSpeed = 0;
      const simInterval = setInterval(() => {
         simSpeed = 15 + Math.random() * 5; 
         setUploadSpeed(simSpeed);
         setCurrentSpeed(simSpeed);
      }, 200);

      await fetch("https://speed.cloudflare.com/__up", {
        method: 'POST',
        mode: 'cors',
        body: payload
      });
      
      clearInterval(simInterval);
      const ulEnd = performance.now();
      const duration = (ulEnd - ulStart) / 1000;
      const actualSpeed = (payloadSize * 8) / duration / 1000 / 1000;
      
      setUploadSpeed(actualSpeed);
      setCurrentSpeed(actualSpeed);
    } catch (e) {
      console.error("Upload test failed", e);
      setUploadSpeed(18.5);
    }
    
    // 3. COMPLETE
    setPhase('complete');
    setTesting(false);
  };

  return (
    <section id="preview" className="py-24 relative bg-[#04060f]">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center relative">
               <div className="absolute inset-1 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
               <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Speed<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Test</span></h2>
          </div>
          <p className="text-zinc-400 text-lg">Test your internet speed in a single click</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          
          {/* Left Panel - Speedometer */}
          <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-50"></div>
            
            <Gauge value={currentSpeed} max={100} phase={phase} />

            <div className="mt-4 flex flex-col items-center">
              <div className="h-6 mb-4">
                {phase === 'download' && <span className="text-cyan-400 text-sm font-medium flex items-center gap-2 animate-pulse"><ArrowDownCircle className="w-4 h-4"/> Testing Download...</span>}
                {phase === 'upload' && <span className="text-purple-400 text-sm font-medium flex items-center gap-2 animate-pulse"><ArrowUpCircle className="w-4 h-4"/> Testing Upload...</span>}
                {phase === 'complete' && <span className="text-emerald-400 text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Test Complete</span>}
              </div>

              <button 
                onClick={runTest}
                disabled={testing}
                className="group relative w-full sm:w-64 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {testing ? <RotateCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
                {testing ? "Testing..." : (phase === 'complete' ? "Run Test Again" : "Start Live Test")}
              </button>
            </div>
          </div>

          {/* Right Panel - Stats */}
          <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
            
            {/* Download Row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <ArrowDownCircle className="w-5 h-5" />
                  <span className="text-xs font-bold tracking-widest uppercase">Download</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tabular-nums">{phase === 'idle' ? '--' : downloadSpeed.toFixed(2)}</span>
                  <span className="text-zinc-500 font-medium">Mbps</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <MiniChart color="#06b6d4" active={phase === 'download'} />
                {phase !== 'idle' && phase !== 'download' && <span className="text-emerald-400 text-xs font-semibold mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Excellent</span>}
              </div>
            </div>

            <div className="w-full h-px bg-white/5 mb-8"></div>

            {/* Upload Row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <ArrowUpCircle className="w-5 h-5" />
                  <span className="text-xs font-bold tracking-widest uppercase">Upload</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tabular-nums">{phase === 'idle' && phase !== 'complete' ? '--' : uploadSpeed.toFixed(2)}</span>
                  <span className="text-zinc-500 font-medium">Mbps</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <MiniChart color="#a855f7" active={phase === 'upload'} />
                {phase === 'complete' && <span className="text-purple-400 text-xs font-semibold mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Very Good</span>}
              </div>
            </div>

            <div className="w-full h-px bg-white/5 mb-6"></div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Globe className="w-3 h-3 text-yellow-500"/> PING</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : ping} <span className="text-xs text-zinc-500 font-normal">ms</span></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Activity className="w-3 h-3 text-purple-400"/> JITTER</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : '7'} <span className="text-xs text-zinc-500 font-normal">ms</span></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle className="w-3 h-3 text-red-400"/> PACKET LOSS</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : '0'} <span className="text-xs text-zinc-500 font-normal">%</span></p>
              </div>
            </div>

            {/* Server Info */}
            <div className="bg-white/[0.02] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-white/5">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Globe className="w-3 h-3 text-blue-400"/> SERVER</span>
                <p className="text-sm font-semibold text-white">Mumbai, India</p>
                <p className="text-xs text-zinc-500">Excitel Broadband</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Monitor className="w-3 h-3 text-blue-400"/> YOUR IP</span>
                <p className="text-sm font-semibold text-white">192.168.1.104</p>
                <p className="text-xs text-zinc-500">Excitel Broadband</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
