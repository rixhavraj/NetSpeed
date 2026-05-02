import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Preview from '../components/Preview';
import Download from '../components/Download';
import FutureUpdates from '../components/FutureUpdates';
import VersionHistory from '../components/VersionHistory';
import Trust from '../components/Trust';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Preview />
        <Trust />
        <Download />
        <FutureUpdates />
        <VersionHistory />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
