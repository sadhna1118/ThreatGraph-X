import React from 'react';
import { Shield, Bell, Terminal, Search, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 bg-[#090d16] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-slate-100 uppercase">ThreatGraph</span>
              <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">X</span>
            </div>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Security Graph Intelligence</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono">SIEM / SOAR ACTIVE</span>
        </div>

        <Link
          to="/alerts"
          className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Active Security Alerts"
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </Link>

        <Link
          to="/hunting"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-mono text-slate-200 transition-colors"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hunt DSL</span>
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            SA
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-slate-200">SOC Administrator</div>
            <div className="text-[10px] font-mono text-slate-400">admin@threatgraph.local</div>
          </div>
        </div>
      </div>
    </header>
  );
};
