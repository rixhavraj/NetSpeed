import React from 'react';
import Hero from '../components/Hero';
import LiveStats from '../components/LiveStats';
import Features from '../components/Features';
import Preview from '../components/Preview';
import Trust from '../components/Trust';
import Download from '../components/Download';
import FAQ from '../components/FAQ';
import FutureUpdates from '../components/FutureUpdates';
import VersionHistory from '../components/VersionHistory';

const Home = () => {
  return (
    <main>
      <Hero />
      <LiveStats />
      <Features />
      <Preview />
      <Trust />
      <Download />
      <FAQ />
      <FutureUpdates />
      <VersionHistory />
    </main>
  );
};

export default Home;
