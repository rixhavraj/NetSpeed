import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, EyeOff, Zap, Shield, Maximize, Clock } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    title: "Real-time Monitoring",
    description: "Instantly track your upload and download speeds with zero latency. Data updates exactly when it happens."
  },
  {
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    title: "0.1% CPU Usage",
    description: "Written natively in C++ to consume negligible system resources. It just works, silently in the background."
  },
  {
    icon: <Maximize className="w-6 h-6 text-indigo-400" />,
    title: "Always-on-top Widget",
    description: "A sleek, unintrusive overlay that sits anywhere on your screen. Keep an eye on your network without losing focus."
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "100% Secure & Local",
    description: "No data is ever sent to our servers. Your network analytics remain entirely securely on your local machine."
  },
  {
    icon: <EyeOff className="w-6 h-6 text-violet-400" />,
    title: "Zero Ads or Tracking",
    description: "Built for power users, not advertisers. We respect your privacy and provide a completely ad-free experience."
  },
  {
    icon: <Clock className="w-6 h-6 text-rose-400" />,
    title: "Native Performance",
    description: "Integrates perfectly with modern Windows 10/11 environments. No heavy Electron or WebView bloatware."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white drop-shadow-sm">Everything you need. <br/><span className="text-zinc-500">Nothing you don't.</span></h2>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto font-light drop-shadow-sm">We cut out the bloat to give you a utility that does one thing absolutely perfectly.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="group relative p-8 rounded-3xl glass hover:bg-white/[0.03] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
