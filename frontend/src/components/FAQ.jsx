import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: "General Questions",
    items: [
      {
        question: "What is NetSpeed?",
        answer: "NetSpeed is a lightweight, premium desktop widget for Windows that tracks and displays your real-time internet upload and download speeds. It sits cleanly on your desktop so you can monitor your network performance at a glance."
      },
      {
        question: "Is NetSpeed really free to download?",
        answer: "Yes! The core NetSpeed widget is completely free to download and use from our official website."
      }
    ]
  },
  {
    category: "Security & Privacy",
    items: [
      {
        question: "Does NetSpeed track or log my browsing history?",
        answer: "Absolutely not. NetSpeed only measures the total bandwidth data passing through your network interface to calculate your current speed. Your data is processed entirely locally on your machine in real-time. We never log, store, or transmit your internet activity or personal information."
      },
      {
        question: "Why does my antivirus/Windows SmartScreen flag the download?",
        answer: "Because NetSpeed is a newly released independent software, Windows SmartScreen or certain antivirus programs might flag it as 'Unknown' or 'Unrecognized.' This is completely normal for new executable (.exe) files. You can safely click 'More Info' and select 'Run Anyway' to install the widget."
      }
    ]
  },
  {
    category: "Technical & Compatibility",
    items: [
      {
        question: "Can I use NetSpeed on a Mac or Linux?",
        answer: "No. NetSpeed is designed and optimized exclusively for Windows operating systems (Windows 10 and 11). There are currently no versions available for macOS or Linux."
      },
      {
        question: "How much system resource (RAM/CPU) does the widget use?",
        answer: "We built NetSpeed with efficiency in mind. The widget itself is highly optimized for Windows, consuming negligible CPU and less than 2MB of RAM. You won't even notice it's running."
      },
      {
        question: "How does the app check for updates?",
        answer: "Our widget securely communicates with our backend server periodically just to check if a newer version is available. If an update is found, you will be notified so you always have the most stable and secure build."
      }
    ]
  },
  {
    category: "Troubleshooting",
    items: [
      {
        question: "The widget isn't showing my correct speed. How do I fix it?",
        answer: "If you have multiple network adapters active (for example, if you are connected to both Wi-Fi and an Ethernet cable, or using a VPN), NetSpeed might be tracking the wrong adapter. Go into the widget settings by right-clicking it, and ensure your primary active network card is selected."
      }
    ]
  },
  {
    category: "Internet Basics",
    items: [
      {
        question: "what is my internet speed",
        answer: "Your internet speed determines how quickly data transfers between the web and your device. You can find out your exact real-time speed by using the NetSpeed widget or running the live speed test on this page!"
      },
      {
        question: "when was the internet invented",
        answer: "The internet began development in the 1960s with ARPANET, but the World Wide Web as we know it was invented by Tim Berners-Lee in 1989 and made publicly available in 1991."
      },
      {
        question: "how fast is my internet",
        answer: "To see how fast your internet is right now, simply click the 'Start Live Test' button above or download our Windows widget for continuous, real-time monitoring directly from your desktop."
      },
      {
        question: "how to fix slow internet",
        answer: "Slow internet can be caused by router issues, background downloads, or ISP throttling. To fix it, try restarting your router, closing bandwidth-heavy apps, using an Ethernet cable instead of Wi-Fi, or contacting your Internet Service Provider."
      },
      {
        question: "whats my internet speed",
        answer: "You can instantly check your current download and upload speeds using the live Speed Test tool right here on our website, or by installing the NetSpeed desktop widget."
      },
      {
        question: "who invented the internet",
        answer: "The internet's foundations were developed by various computer scientists, notably Vint Cerf and Bob Kahn who developed the TCP/IP protocols. Tim Berners-Lee later invented the World Wide Web."
      },
      {
        question: "what is a good internet speed",
        answer: "A 'good' speed depends on your needs. For basic browsing, 10-25 Mbps is fine. For 4K streaming or competitive gaming, 100+ Mbps is recommended. For multiple heavy users in one home, consider 500 Mbps to 1 Gbps."
      },
      {
        question: "why is my internet so slow",
        answer: "Your internet may be slow due to network congestion, being too far from your Wi-Fi router, outdated hardware, or background applications consuming your bandwidth. Use NetSpeed to monitor if background apps are draining your speed."
      },
      {
        question: "what internet is available at my address",
        answer: "Availability depends on your local ISPs (Internet Service Providers) and infrastructure. You will need to check with providers like Xfinity, AT&T, Verizon, or local fiber companies by entering your zip code on their respective websites."
      }
    ]
  },
  {
    category: "Downloads & Windows Compatibility",
    items: [
      {
        question: "How do I perform a net speed meter download for Windows?",
        answer: "You can initiate a net speed meter download for pc directly from our website. Whether you need a net speed meter download for windows 10 or a net speed meter download for windows 11, our single installer handles it perfectly. For desktop users, this pc net speed meter download ensures you get the fastest monitoring tool available."
      },
      {
        question: "Does this include a net speed meter taskbar integration?",
        answer: "Our windows net speed meter is designed as an always-on-top, beautiful desktop widget. While many users search for a net speed meter in taskbar, we found that a dedicated desktop net speed meter monitor provides a much cleaner and customizable experience without cluttering your system tray."
      },
      {
        question: "Can I get a net speed meter apk or net speed meter for windows 7?",
        answer: "Our software is specifically built as a modern net speed meter app for pc, focusing on Windows 10 and 11. Because of this, we do not officially support net speed meter for windows 7, nor do we provide a net speed meter apk for mobile devices."
      },
      {
        question: "Is this an internet speed extension or a standalone app?",
        answer: "NetSpeed is a dedicated, standalone net speed meter for pc windows, not just a browser internet speed extension. When you initiate a net speed meter download for pc from our site, you get a full lightweight application that monitors your entire system's bandwidth, not just your web browser."
      },
      {
        question: "Where can I find the official internet speed meter download?",
        answer: "You can start your internet speed meter download for pc right from our homepage. Whether you are looking for an internet speed meter download windows 10, an internet speed meter download for windows 11, or just a general pc internet speed meter download, our single executable handles it all. Please note we do not offer an internet speed meter download apk or an internet speed meter download for windows 7 since our focus is entirely on modern Windows environments."
      }
    ]
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between gap-4 text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-bold text-zinc-100 ">
          {question}
        </span>
        <div className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-zinc-400 group-hover:text-primary'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(`${0}-${0}`); // Open first item by default

  const toggleItem = (categoryIndex, itemIndex) => {
    const id = `${categoryIndex}-${itemIndex}`;
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Questions</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
            Everything you need to know about NetSpeed, security, and compatibility.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-xl font-black text-white mb-4 tracking-wide uppercase flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {category.category}
              </h3>
              
              <div className="relative">
                {category.items.map((item, itemIdx) => (
                  <FAQItem
                    key={itemIdx}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === `${catIdx}-${itemIdx}`}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
