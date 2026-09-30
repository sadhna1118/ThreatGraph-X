import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Network,
  Users,
  AlertTriangle,
  FolderSearch,
  Flame,
  Grid3X3,
  PlaySquare,
  GraduationCap,
  FileText,
  Activity,
  Database,
  ShieldAlert,
  Radio
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'SOC Dashboard', icon: LayoutDashboard },
  { to: '/soar', label: 'SOAR Active Defense', icon: ShieldAlert },
  { to: '/collectors', label: 'Live Log Collectors', icon: Radio },
  { to: '/hunting', label: 'Threat Hunting', icon: Search },
  { to: '/graph', label: 'Graph Explorer', icon: Network },
  { to: '/entities', label: 'Entities & Assets', icon: Users },
  { to: '/alerts', label: 'Detections & Alerts', icon: AlertTriangle },
  { to: '/investigations', label: 'Investigations', icon: FolderSearch },
  { to: '/incidents', label: 'Incidents', icon: Flame },
  { to: '/mitre', label: 'MITRE ATT&CK', icon: Grid3X3 },
  { to: '/scenarios', label: 'Attack Scenarios', icon: PlaySquare },
  { to: '/training', label: 'Training Mode', icon: GraduationCap },
  { to: '/iocs', label: 'Threat Intel (IOCs)', icon: Database },
  { to: '/behavior', label: 'Behavior Baselines', icon: Activity },
  { to: '/reports', label: 'Reports Vault', icon: FileText },
];


export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
          DEFENSIVE OPERATIONS
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 mt-6">
        <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
          <span>Security Model</span>
          <span className="text-emerald-400 text-[10px] font-mono">100% DEFENSIVE</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
          Synthetic lab telemetry for research, detection engineering, and training.
        </p>
      </div>
    </aside>
  );
};
