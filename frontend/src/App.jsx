import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

function App() {
  return (
    <Router basename="/NetSpeed">
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

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App;
