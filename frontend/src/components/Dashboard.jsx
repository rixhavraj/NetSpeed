import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Bell, ChevronDown, Home, CheckSquare, 
  ArrowLeftRight, CreditCard, PieChart, Landmark,
  Settings, Zap, Clock, Plus, MoreVertical,
  ArrowUpRight, ArrowDownRight, Send, Download, 
  RefreshCcw, Wallet, FileText, Menu
} from 'lucide-react';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-12 w-full max-w-5xl px-4 md:px-0"
    >
      <div 
        className="rounded-2xl overflow-hidden p-2 md:p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-dashboard)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="bg-[#050505] rounded-xl overflow-hidden flex h-[450px] md:h-[500px] text-[10px] md:text-[11px] select-none pointer-events-none border border-white/5 shadow-2xl">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:flex w-40 border-r border-white/5 bg-white/[0.02] flex-col p-3 gap-6">
            <div className="flex flex-col gap-1">
              <SidebarItem icon={<Home size={12} />} label="Home" active />
              <SidebarItem icon={<CheckSquare size={12} />} label="Tasks" badge="10" />
              <SidebarItem icon={<ArrowLeftRight size={12} />} label="Transactions" />
              <SidebarItem icon={<CreditCard size={12} />} label="Payments" hasChevron />
              <SidebarItem icon={<PieChart size={12} />} label="Cards" />
              <SidebarItem icon={<Zap size={12} />} label="Capital" />
              <SidebarItem icon={<Landmark size={12} />} label="Accounts" hasChevron />
            </div>

            <div className="flex flex-col gap-1">
              <div className="px-2 py-1 text-[9px] md:text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Workflows</div>
              <SidebarItem icon={<Clock size={12} />} label="Trake rutes" />
              <SidebarItem icon={<Send size={12} />} label="Payments" />
              <SidebarItem icon={<Bell size={12} />} label="Notifications" />
              <SidebarItem icon={<Settings size={12} />} label="Settings" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
            {/* Top Bar */}
            <div className="h-10 border-b border-white/5 bg-[#050505] flex items-center justify-between px-3 md:px-4 gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <Menu size={12} className="md:hidden text-muted-foreground" />
                <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-[10px]">N</div>
                <span className="font-semibold text-foreground hidden sm:inline">NetSpeed</span>
                <ChevronDown size={10} className="text-muted-foreground" />
              </div>

              <div className="flex-1 max-w-[120px] sm:max-w-md relative">
                <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <div className="w-full h-6 bg-white/[0.03] rounded border border-white/5 px-7 flex items-center text-muted-foreground justify-between overflow-hidden">
                  <span className="truncate">Search...</span>
                  <span className="hidden sm:inline text-[9px] border border-white/10 px-1 rounded bg-white/5">⌘K</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden sm:flex items-center gap-1 text-primary font-medium">
                  <span>Move Money</span>
                </div>
                <Bell size={12} className="text-muted-foreground" />
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-[10px]">JB</div>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-4">
              <div>
                <h2 className="text-xs md:text-sm font-semibold text-foreground">Welcome, Jane</h2>
              </div>

              {/* Action Buttons - Horizontal Scroll on Mobile */}
              <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
                <ActionButton label="Send" icon={<Send size={10} />} primary />
                <ActionButton label="Request" icon={<Download size={10} />} />
                <ActionButton label="Transfer" icon={<RefreshCcw size={10} />} />
                <ActionButton label="Deposit" icon={<Wallet size={10} />} />
                <ActionButton label="Pay Bill" icon={<FileText size={10} />} />
                <ActionButton label="Create Invoice" icon={<Plus size={10} />} />
              </div>

              {/* Cards Row - Stacked on mobile */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Balance Card */}
                <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-3 md:p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
                      </div>
                      <span className="font-medium">Mercury Balance</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xl md:text-2xl font-semibold tracking-tight">$8,450,190</span>
                    <span className="text-[9px] md:text-xs text-muted-foreground font-normal ml-0.5">.32</span>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px]">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Last 30 Days</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 font-medium">
                      <ArrowUpRight size={10} />
                      <span>+$1.8M</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500 font-medium">
                      <ArrowDownRight size={10} />
                      <span>-$900K</span>
                    </div>
                  </div>

                  <div className="h-16 md:h-20 w-full mt-2">
                    <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M0,80 C50,75 100,90 150,60 C200,30 250,50 300,20 C350,-10 400,10 400,10 L400,100 L0,100 Z" 
                        fill="url(#chartGradient)"
                      />
                      <path 
                        d="M0,80 C50,75 100,90 150,60 C200,30 250,50 300,20 C350,-10 400,10 400,10" 
                        fill="none" 
                        stroke="var(--color-primary)" 
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Accounts Card */}
                <div className="flex-1 bg-white/[0.02] rounded-xl border border-white/5 p-3 md:p-4 flex flex-col shadow-sm">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="font-semibold text-foreground">Accounts</span>
                    <div className="flex items-center gap-2">
                      <Plus size={12} className="text-muted-foreground" />
                      <MoreVertical size={12} className="text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <AccountRow label="Credit" amount="$98,125.50" />
                    <AccountRow label="Treasury" amount="$6,750,200.00" />
                    <AccountRow label="Operations" amount="$1,592,864.82" />
                  </div>
                </div>
              </div>

              {/* Transactions Table - Scrollable on Mobile */}
              <div className="bg-white/[0.02] rounded-xl border border-white/5 p-3 md:p-4 flex flex-col gap-3 shadow-sm overflow-hidden">
                <span className="font-semibold text-foreground">Recent Transactions</span>
                <div className="flex flex-col overflow-x-auto no-scrollbar">
                  <div className="min-w-[300px]">
                    <div className="flex items-center justify-between py-2 border-b border-white/5 text-muted-foreground font-medium uppercase text-[8px] md:text-[9px] tracking-wider">
                      <div className="flex-[2]">Date / Description</div>
                      <div className="flex-1 text-right">Amount</div>
                      <div className="flex-1 text-right">Status</div>
                    </div>
                    <TransactionRow date="May 24" desc="AWS Cloud Services" amount="-$5,200.00" status="Pending" statusColor="amber" />
                    <TransactionRow date="May 23" desc="Client Payment - Acme" amount="+$125,000.00" status="Completed" statusColor="green" />
                    <TransactionRow date="May 22" desc="Payroll - May 2024" amount="-$85,450.00" status="Completed" statusColor="green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active, badge, hasChevron }) => (
  <div className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${active ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-white/5'}`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {badge && <span className="bg-white/10 px-1 rounded text-[8px] font-bold">{badge}</span>}
      {hasChevron && <ChevronDown size={10} />}
    </div>
  </div>
);

const ActionButton = ({ label, icon, primary }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-colors whitespace-nowrap ${primary ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
    {icon}
    <span className="font-medium text-[9px] md:text-[10px]">{label}</span>
  </div>
);

const AccountRow = ({ label, amount }) => (
  <div className="flex items-center justify-between py-2 md:py-3">
    <div className="flex items-center gap-2 text-[10px] md:text-xs">
      <div className="w-2 h-2 rounded-full bg-primary/20" />
      <span className="text-muted-foreground">{label}</span>
    </div>
    <span className="font-medium text-[10px] md:text-xs text-foreground">{amount}</span>
  </div>
);

const TransactionRow = ({ date, desc, amount, status, statusColor }) => (
  <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5 last:border-0 text-[10px] md:text-xs">
    <div className="flex-[2] flex flex-col overflow-hidden">
      <span className="text-muted-foreground text-[8px] md:text-[10px]">{date}</span>
      <span className="font-medium text-foreground truncate">{desc}</span>
    </div>
    <div className="flex-1 text-right font-medium text-foreground">{amount}</div>
    <div className="flex-1 text-right">
      <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium ${
        statusColor === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export default Dashboard;
