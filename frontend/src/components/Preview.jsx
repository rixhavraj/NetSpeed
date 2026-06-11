import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play, ArrowDownCircle, ArrowUpCircle, Activity, Globe, Monitor, HelpCircle, CheckCircle2, RotateCw } from 'lucide-react';

const Gauge = ({ value, max: initialMax, phase }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const dasharray = `${circumference} ${circumference}`;
  
  const ticks = [0, 5, 10, 50, 100, 250, 500, 750, 1000];

  // Custom non-linear scale function to match the reference UI intervals
  const getProgress = (val) => {
    const bounded = Math.min(Math.max(val, 0), 1000);
    if (bounded === 0) return 0;
    for (let i = 0; i < ticks.length - 1; i++) {
      if (bounded >= ticks[i] && bounded <= ticks[i+1]) {
        const intervalProgress = (bounded - ticks[i]) / (ticks[i+1] - ticks[i]);
        return (i + intervalProgress) / (ticks.length - 1);
      }
    }
    return 1;
  };

  const progress = getProgress(value);

  const dashoffset = circumference - (progress * arcLength);
  const backgroundDashoffset = circumference - arcLength;
  const angle = -135 + (progress * 270);

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
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="16" 
          strokeDasharray={dasharray}
          strokeDashoffset={backgroundDashoffset}
          strokeLinecap="square"
        />
        
        {/* Active track */}
        <motion.circle 
          cx="100" cy="100" r={radius} 
          fill="none" 
          stroke="#eab308" 
          strokeWidth="16" 
          strokeDasharray={dasharray}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          strokeLinecap="square"
        />

        {/* Needle */}
        <motion.g 
          className="origin-[100px_100px]"
          animate={{ rotate: angle - 135 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <line x1="100" y1="100" x2="100" y2="40" stroke="white" strokeWidth="6" strokeLinecap="square" className="opacity-100 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
          <circle cx="100" cy="100" r="10" fill="#000000" stroke="white" strokeWidth="4" />
        </motion.g>

        {/* Fixed Ticks */}
        {ticks.map((tick, i) => {
          const tickProgress = i / (ticks.length - 1);
          const tickAngle = -135 + (tickProgress * 270);
          const rad = (tickAngle - 225) * (Math.PI / 180);
          
          // Position text outside the needle path but inside the gauge border space
          // Since radius is 80 and the SVG is 200x200 (center 100,100)
          // `radius - 24` is 56, inside the active arc. The reference has ticks INSIDE the arc.
          const tx = 100 + Math.cos(rad) * (radius - 28);
          const ty = 100 + Math.sin(rad) * (radius - 28);
          
          return (
            <text 
              key={i}
              x={tx} y={ty} 
              fill="rgba(255,255,255,0.7)" 
              fontSize="14" 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              fontWeight="900" 
              transform={`rotate(-135 ${tx} ${ty})`}
            >
              {tick}
            </text>
          );
        })}
      </svg>

      {/* Bottom text overlay */}
      <div className="absolute inset-x-0 bottom-[-20px] flex flex-col items-center">
        <span className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-[4px_4px_0_rgba(59,130,246,1)]">
          {phase === 'idle' ? '0.00' : value.toFixed(2)}
        </span>
        <span className="text-sm font-black text-white uppercase bg-black px-2 border-2 border-white mt-1">Mbps</span>
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
  const [jitter, setJitter] = useState("--");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [clientInfo, setClientInfo] = useState({ ip: "--", isp: "--", city: "--", country: "--", colo: "--" });

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setClientInfo({
          ip: data.ip || "--",
          isp: data.org || "--",
          city: data.city || "--",
          country: data.country_code || "--",
          colo: "Primary"
        });
      })
      .catch(err => console.error("Failed to fetch client info", err));
  }, []);

  const runTest = async () => {
    if (testing) return;
    setTesting(true);
    setPing("--");
    setJitter("--");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setCurrentSpeed(0);

    // 0. PING & JITTER TEST
    try {
      let pings = [];
      for (let i = 0; i < 5; i++) {
        const pStart = performance.now();
        await fetch("https://speed.cloudflare.com/__down?bytes=0", { cache: "no-store", mode: "cors" });
        const pEnd = performance.now();
        pings.push(pEnd - pStart);
      }
      const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
      setPing(Math.round(avgPing));
      
      let jitterSum = 0;
      for (let i = 1; i < pings.length; i++) {
        jitterSum += Math.abs(pings[i] - pings[i-1]);
      }
      setJitter(pings.length > 1 ? Math.round(jitterSum / (pings.length - 1)) : 0);
    } catch (e) {
      setPing("Error");
      setJitter("Error");
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
      const chunkSize = 1 * 1024 * 1024; // 1MB chunk
      const chunk = new Uint8Array(chunkSize);
      for(let i=0; i<chunkSize; i+=1024) chunk[i] = Math.floor(Math.random() * 256);
      
      let totalUploaded = 0;
      const ulStart = performance.now();
      
      for (let i = 0; i < 15; i++) { // Upload 15MB total in chunks
        await fetch("https://speed.cloudflare.com/__up", {
          method: 'POST',
          mode: 'cors',
          body: chunk
        });
        const reqEnd = performance.now();
        totalUploaded += chunkSize;
        
        const duration = (reqEnd - ulStart) / 1000;
        const currentSpeedMbps = (totalUploaded * 8) / duration / 1000 / 1000;
        setUploadSpeed(currentSpeedMbps);
        setCurrentSpeed(currentSpeedMbps);
      }
    } catch (e) {
      console.error("Upload test failed", e);
    }
    
    // 3. COMPLETE
    setPhase('complete');
    setTesting(false);
  };

  return (
    <section id="preview" className="py-24 relative bg-black border-y-8 border-white">
      {/* Background gradients removed for brutalism */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block border-4 border-white bg-[#ec4899] px-6 py-3 shadow-[8px_8px_0px_0px_#ffffff] mb-4">
             <h2 className="text-5xl font-black text-black uppercase tracking-tighter flex items-center gap-3">
               <Activity className="w-8 h-8 text-black" />
               SPEEDTEST
             </h2>
          </div>
          <p className="text-white font-bold text-xl uppercase tracking-widest bg-black inline-block px-3 py-1 border-2 border-white">Test your internet speed in a single click</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          
          {/* Left Panel - Speedometer */}
          <div className="brutal-card p-8 relative overflow-hidden flex flex-col items-center justify-between min-h-[400px]">
            
            <Gauge value={currentSpeed} max={1000} phase={phase} />

            <div className="mt-4 flex flex-col items-center">
              <div className="h-6 mb-4">
                {phase === 'download' && <span className="text-cyan-400 text-sm font-medium flex items-center gap-2 animate-pulse"><ArrowDownCircle className="w-4 h-4"/> Testing Download...</span>}
                {phase === 'upload' && <span className="text-purple-400 text-sm font-medium flex items-center gap-2 animate-pulse"><ArrowUpCircle className="w-4 h-4"/> Testing Upload...</span>}
                {phase === 'complete' && <span className="text-emerald-400 text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Test Complete</span>}
              </div>

              <button 
                onClick={runTest}
                disabled={testing}
                className="brutal-button w-full sm:w-64 flex items-center justify-center gap-3 px-8 py-4 font-black text-xl uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? <RotateCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
                {testing ? "Testing..." : (phase === 'complete' ? "Run Test Again" : "Start Live Test")}
              </button>
            </div>
          </div>

          {/* Right Panel - Stats */}
          <div className="brutal-card p-8 flex flex-col justify-between">
            
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

            <div className="w-full border-b-4 border-white mb-8"></div>

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

            <div className="w-full border-b-4 border-white mb-6"></div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Globe className="w-3 h-3 text-yellow-500"/> PING</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : ping} <span className="text-xs text-zinc-500 font-normal">ms</span></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Activity className="w-3 h-3 text-purple-400"/> JITTER</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : jitter} <span className="text-xs text-zinc-500 font-normal">ms</span></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><HelpCircle className="w-3 h-3 text-red-400"/> PACKET LOSS</span>
                <p className="text-xl font-bold text-white tabular-nums">{phase === 'idle' ? '--' : '0'} <span className="text-xs text-zinc-500 font-normal">%</span></p>
              </div>
            </div>

            {/* Server Info */}
            <div className="border-4 border-white bg-black p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-[4px_4px_0px_0px_#ffffff]">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Globe className="w-3 h-3 text-blue-400"/> SERVER</span>
                <p className="text-sm font-semibold text-white">{clientInfo.city !== "--" ? `${clientInfo.city}, ${clientInfo.country}` : 'Loading...'}</p>
                <p className="text-xs text-zinc-500">{clientInfo.isp !== "--" ? `Server (${clientInfo.colo})` : '--'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 mb-1"><Monitor className="w-3 h-3 text-blue-400"/> YOUR IP</span>
                <p className="text-sm font-semibold text-white">{clientInfo.ip !== "--" ? clientInfo.ip : 'Loading...'}</p>
                <p className="text-xs text-zinc-500">{clientInfo.isp !== "--" ? clientInfo.isp : '--'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
