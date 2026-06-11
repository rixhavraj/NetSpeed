import React from 'react';

const PrivacyPolicy = () => {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-white">
      <div className="glass-panel p-8 md:p-12 brutal-card border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] bg-[#04060f]">
        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-[#ec4899]">Privacy Policy</h1>
        <p className="text-sm font-bold text-zinc-400 mb-8 uppercase tracking-widest">Effective Date: June 12, 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
          <p>
            Welcome to NetSpeed ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (net-speed-web) and use our Windows desktop widget application (NetSpeed).
          </p>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">1. Information We Collect</h2>
            <h3 className="text-xl font-bold text-white mb-2">A. Through the Website</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Analytics:</strong> We may use basic, anonymized web analytics to track website traffic, download clicks, and conversion rates.</li>
              <li><strong>IP Addresses:</strong> Your IP address may be temporarily logged by our Java Spring Boot backend server for security and rate-limiting purposes during file downloads.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-2">B. Through the NetSpeed Windows Widget</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Network Usage Data:</strong> The NetSpeed widget monitors your real-time upload and download speeds. This data is processed locally on your machine in real-time. It is used solely to display the widget's speed metrics and is never uploaded to our servers, stored, or shared with third parties.</li>
              <li><strong>Version Checking:</strong> The application may occasionally communicate with our Spring Boot backend to check for software updates. This request transmits minimal data (such as your current app version) to ensure you are running the latest build.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">2. How We Use Your Information</h2>
            <p className="mb-2">We use the limited information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Deliver and maintain the NetSpeed application.</li>
              <li>Optimize our website performance and conversion rates.</li>
              <li>Protect our servers from malicious activity or abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">3. Data Security</h2>
            <p className="mb-4">
              We implement robust security measures to protect your data. The NetSpeed Windows application is compiled securely, and all backend communications (such as update checks) are handled via encrypted protocols (HTTPS).
            </p>
            <div className="bg-white/10 border-l-4 border-[#ec4899] p-4 text-sm font-semibold">
              <strong>Note:</strong> Because the NetSpeed widget does not collect or transmit personal data, we do not store any of your private information on our servers.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">4. Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. Any changes will be reflected on this page with an updated "Effective Date."
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
