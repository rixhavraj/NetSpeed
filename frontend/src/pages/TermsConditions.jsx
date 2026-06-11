import React from 'react';

const TermsConditions = () => {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-white">
      <div className="glass-panel p-8 md:p-12 brutal-card border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] bg-[#04060f]">
        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-[#3b82f6]">Terms and Conditions</h1>
        <p className="text-sm font-bold text-zinc-400 mb-8 uppercase tracking-widest">Effective Date: June 12, 2026</p>

        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
          <p>
            By accessing our website (net-speed-web) and downloading the NetSpeed desktop widget, you agree to comply with and be bound by the following Terms and Conditions.
          </p>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">1. Use of the Software and Website</h2>
            <ul className="list-disc pl-5 space-y-4">
              <li><strong>License:</strong> We grant you a personal, non-exclusive, non-transferable, and revocable license to use the NetSpeed widget on Windows operating systems for personal or internal business use.</li>
              <li><strong>Compatibility:</strong> NetSpeed is a Windows-only application. We do not guarantee compatibility with specific versions of Windows or third-party modifications.</li>
              <li><strong>Prohibited Actions:</strong> You agree not to decompile, reverse-engineer, modify, or redistribute the NetSpeed executable file without our express written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">2. Intellectual Property</h2>
            <p>
              All content on the website, including text, graphics, logos, and the NetSpeed software code, is the exclusive property of NetSpeed and is protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">3. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The website and the NetSpeed application are provided "as is" and "as available" without any warranties of any kind, either express or implied.
            </p>
            <p>
              While we strive to provide an optimized, bug-free experience, we do not guarantee that the widget will run uninterrupted, be entirely error-free, or accurately reflect network speeds under all network configurations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">4. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, NetSpeed and its developers shall not be liable for any damages arising out of the use or inability to use the software, including but not limited to system crashes, network disruptions, or loss of data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">5. Termination</h2>
            <p>
              We reserve the right to terminate your access to our website or revoke your license to use the application at our sole discretion, without notice, if we believe you have breached these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">6. Contact Us</h2>
            <p>
              If you have any questions regarding these Terms or the Privacy Policy, please contact us at: <strong>rishavr741@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsConditions;
