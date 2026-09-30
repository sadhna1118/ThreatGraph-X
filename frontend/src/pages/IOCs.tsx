import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, 
  Search, 
  Filter, 
  ShieldCheck, 
  Globe, 
  FileText, 
  Hash, 
  ExternalLink,
  Tag,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IOCs: React.FC = () => {
  const navigate = useNavigate();
  const [iocs, setIocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Live CTI Lookup state
  const [liveQuery, setLiveQuery] = useState('198.51.100.25');
  const [liveResult, setLiveResult] = useState<any>(null);
  const [queryingLive, setQueryingLive] = useState(false);
  const [syncingFeeds, setSyncingFeeds] = useState(false);

  useEffect(() => {
    loadIOCs();
  }, []);

  const loadIOCs = async () => {
    setLoading(true);
    try {
      const data = await api.getIOCs();
      setIocs(data);
    } catch (err) {
      console.error('Failed to load IOCs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!liveQuery) return;
    setQueryingLive(true);
    try {
      const res = await api.liveIOCLookup(liveQuery.trim());
      setLiveResult(res);
    } catch (err: any) {
      alert(`Live Lookup failed: ${err.message}`);
    } finally {
      setQueryingLive(false);
    }
  };

  const handleSyncFeeds = async () => {
    setSyncingFeeds(true);
    try {
      const res = await api.syncLiveFeeds('ALL');
      alert(`CTI Feed Sync Complete! Synced ${res.iocs_added || res.total_synced_sample} community threat indicators.`);
      await loadIOCs();
    } catch (err: any) {
      alert(`Feed sync failed: ${err.message}`);
    } finally {
      setSyncingFeeds(false);
    }
  };

  const getIocIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ip': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'domain': return <Globe className="w-4 h-4 text-sky-400" />;
      case 'hash': case 'sha256': return <Hash className="w-4 h-4 text-purple-400" />;
      default: return <Tag className="w-4 h-4 text-amber-400" />;
    }
  };

  const filtered = iocs.filter(ioc => {
    const val = (ioc.value || '').toLowerCase();
    const type = (ioc.ioc_type || ioc.type || '').toUpperCase();
    const matchSearch = val.includes(search.toLowerCase()) ||
      (ioc.source && ioc.source.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'ALL' || type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-7 h-7 text-emerald-400" />
            Live Threat Intelligence & IOC Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time reputation feeds (AbuseIPDB, AlienVault OTX, URLhaus, CISA KEV) with automated graph correlation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncFeeds}
            disabled={syncingFeeds}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingFeeds ? 'animate-spin' : ''}`} />
            {syncingFeeds ? 'Syncing Feeds...' : 'Sync Live CTI Feeds'}
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Known IOCs: <strong className="text-emerald-400">{iocs.length}</strong>
          </span>
        </div>
      </div>

      {/* Live Threat Reputation Checker Box */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Real-Time IOC Reputation Checker (AbuseIPDB / AlienVault / URLhaus / CISA)
          </h2>
          <span className="text-xs text-slate-400">Live Global CTI Feed API</span>
        </div>

        <form onSubmit={handleLiveLookup} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => setLiveQuery(e.target.value)}
              placeholder="Enter IP, Domain, or File Hash (e.g. 198.51.100.25, c2-server.test)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={queryingLive}
            className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50"
          >
            {queryingLive ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Check Reputation
          </button>
        </form>

        {/* Live Result Display */}
        {liveResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-cyan-300">{liveResult.query_value}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  liveResult.risk_rating === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  liveResult.risk_rating === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {liveResult.risk_rating} RISK ({liveResult.reputation_score}/100)
                </span>
                <span className="text-xs text-slate-400">Type: {liveResult.detected_type.toUpperCase()}</span>
              </div>
              <div className="text-xs text-slate-300">
                Threat Actor: <b className="text-red-400">{liveResult.threat_actor}</b> • Categories: <span className="text-slate-400">{liveResult.categories.join(', ')}</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 space-y-1">
              <div>Queried: <span className="text-slate-300 font-medium">{liveResult.providers_queried.join(' • ')}</span></div>
              <div>Confidence: <span className="text-emerald-400 font-semibold">{Math.round(liveResult.confidence * 100)}%</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search indicator catalog by value or source..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All IOC Types</option>
            <option value="IP">IP Addresses</option>
            <option value="DOMAIN">Domains</option>
            <option value="HASH">Hashes</option>
          </select>
        </div>
      </div>

      {/* IOC Catalog Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Indicator Value</th>
                <th className="p-3">Classification</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Source Provider</th>
                <th className="p-3 text-right">Pivot / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((ioc) => (
                <tr key={ioc.id || ioc.value} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 flex items-center gap-2">
                    {getIocIcon(ioc.ioc_type || ioc.type || 'ip')}
                    <span className="font-semibold uppercase text-slate-300">{ioc.ioc_type || ioc.type}</span>
                  </td>
                  <td className="p-3 font-mono text-emerald-400 font-medium">
                    {ioc.value}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (ioc.classification || '').toLowerCase() === 'malicious' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      (ioc.classification || '').toLowerCase() === 'suspicious' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {ioc.classification || 'suspicious'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${Math.round((ioc.confidence || 0.8) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{Math.round((ioc.confidence || 0.8) * 100)}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{ioc.source || 'ThreatGraph-Core'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => navigate(`/hunting`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Search className="w-3 h-3" />
                      Hunt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
