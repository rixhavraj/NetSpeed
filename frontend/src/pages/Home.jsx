import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LiveStats from '../components/LiveStats';
import Features from '../components/Features';
import Preview from '../components/Preview';
import Trust from '../components/Trust';
import Download from '../components/Download';
import FutureUpdates from '../components/FutureUpdates';
import VersionHistory from '../components/VersionHistory';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white relative">
      {/* Global Background Video Animation */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 brightness-100 contrast-110"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" type="video/mp4" />
        </video>
        {/* Subtle radial overlay to merge with the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Original Background Gradient Animations (Floating Glows) */}
      <div className="bg-animation">
        <div className="bg-gradient-1" />
        <div className="bg-gradient-2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <LiveStats />
          <Features />
          <Preview />
          <Trust />
          <Download />
          <FutureUpdates />
          <VersionHistory />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
