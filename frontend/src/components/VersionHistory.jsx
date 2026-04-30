import React from 'react';
import { Download as DownloadIcon, History, Calendar } from 'lucide-react';
import { getDownloadUrl } from '../services/api';

const versions = [
  {
    version: '1.0.1',
    date: 'Apr 30, 2026',
    changes: ['Added Windows startup capabilities', 'Minor bug fixes'],
    downloadUrl: '/net-speed-v1.0.1.exe',
    size: '54KB'
  },
  {
    version: '1.0.0',
    date: 'Apr 29, 2026',
    changes: ['Initial release', 'Real-time monitoring', 'Lightweight performance'],
    downloadUrl: '/net-speed-v1.0.0.exe',
    size: '54KB'
  }
];

const VersionHistory = () => {
  return (
    <section id="versions" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <History className="w-8 h-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Version History</h2>
        </div>

        <div className="space-y-6">
          {versions.map((ver, index) => (
            <div key={ver.version} className="glass rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">v{ver.version}</h3>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider border border-primary/30">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{ver.date}</span>
                    <span className="px-2">&bull;</span>
                    <span>{ver.size}</span>
                  </div>
                  <ul className="space-y-2">
                    {ver.changes.map((change, i) => (
                      <li key={i} className="text-zinc-300 flex items-start gap-2 text-sm md:text-base">
                        <span className="text-primary/70 mt-0.5">&rarr;</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:text-right shrink-0">
                  <a 
                    href={getDownloadUrl(ver.downloadUrl)}
                    download={`NetSpeed-v${ver.version}.exe`}
                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/5 hover:border-white/10 w-full md:w-auto justify-center"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download v{ver.version}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VersionHistory;
