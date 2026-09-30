import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardSummary } from '../types';
import {
  ShieldAlert,
  Activity,
  Network,
  Users,
  AlertCircle,
  TrendingUp,
  FolderSearch,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        Connecting to ThreatGraph X Security Core...
      </div>
    );
  }

  const kpis = summary?.kpis || {
    total_events: 0,
    total_alerts: 0,
    open_investigations: 0,
    open_incidents: 0,
    anomalies_detected: 0,
    active_iocs: 0,
    graph_nodes: 0,
    graph_edges: 0
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1427] to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100">SOC Security Graph & Hunting Center</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlating security telemetry into directed multi-stage attack chains with grounded forensic evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/scenarios"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <span>Run Multi-Stage Simulation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Events</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{kpis.total_events.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Normalized Telemetry</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Triggered Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{kpis.total_alerts}</div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-1">26 Detection Rules Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Cases</span>
            <FolderSearch className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{kpis.open_investigations}</div>
          <div className="text-[10px] text-amber-400/80 font-mono mt-1">Grounded Investigation Workbench</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Graph Entities</span>
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{kpis.graph_nodes}</div>
          <div className="text-[10px] text-purple-400/80 font-mono mt-1">{kpis.graph_edges} Directed Relationships</div>
        </div>
      </div>

      {/* High-Risk Entities & MITRE Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-Risk Entities */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">High-Risk Entities & Threat Observables</h2>
            <Link to="/entities" className="text-xs text-cyan-400 hover:underline font-mono">View All →</Link>
          </div>
          <div className="space-y-3">
            {(summary?.high_risk_entities || []).slice(0, 5).map((ent) => (
              <div key={ent.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 mr-2 uppercase">
                    {ent.type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-200">{ent.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-rose-400">{ent.risk_score}/100</div>
                    <div className="text-[9px] text-slate-500 uppercase">{ent.criticality} criticality</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MITRE ATT&CK Tactic Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">MITRE ATT&CK Tactic Progression</h2>
            <Link to="/mitre" className="text-xs text-cyan-400 hover:underline font-mono">Full Matrix →</Link>
          </div>
          <div className="space-y-2.5">
            {(summary?.mitre_distribution || []).map((m) => (
              <div key={m.tactic} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{m.tactic}</span>
                  <span className="font-mono text-cyan-400 font-bold">{m.count} alerts</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, m.count * 20)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
