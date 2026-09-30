import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EntityItem } from '../types';
import { 
  Users, 
  Server, 
  Globe, 
  Terminal, 
  FileText, 
  Search, 
  ShieldAlert, 
  ExternalLink, 
  Crosshair,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Entities: React.FC = () => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCriticality, setSelectedCriticality] = useState('ALL');
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(null);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const data = await api.fetchApi<EntityItem[]>('/entities');
      setEntities(data);
    } catch (err) {
      console.error('Failed to load entities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'USER': return <Users className="w-4 h-4 text-sky-400" />;
      case 'HOST': return <Server className="w-4 h-4 text-purple-400" />;
      case 'IP': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'PROCESS': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'FILE': return <FileText className="w-4 h-4 text-rose-400" />;
      default: return <Server className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 bg-rose-950/60 border-rose-800';
    if (score >= 60) return 'text-amber-400 bg-amber-950/60 border-amber-800';
    if (score >= 40) return 'text-yellow-400 bg-yellow-950/60 border-yellow-800';
    return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
  };

  const filtered = entities.filter(e => {
    const matchSearch = e.value.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'ALL' || e.entity_type.toUpperCase() === selectedType;
    const matchCrit = selectedCriticality === 'ALL' || e.criticality.toUpperCase() === selectedCriticality;
    return matchSearch && matchType && matchCrit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-400" />
            Entity Inventory & Risk Profiles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Correlated entity database with continuous risk scoring, behavioral baselines, and graph pivots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            Total Entities: <strong className="text-sky-400">{entities.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entity by identity, hostname, IP, hash, or process name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Entity Types</option>
            <option value="USER">Users</option>
            <option value="HOST">Hosts</option>
            <option value="IP">IP Addresses</option>
            <option value="DOMAIN">Domains</option>
            <option value="PROCESS">Processes</option>
            <option value="FILE">Files</option>
          </select>

          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Criticalities</option>
            <option value="CRITICAL">Critical Assets</option>
            <option value="HIGH">High Criticality</option>
            <option value="MEDIUM">Medium Criticality</option>
            <option value="LOW">Low Criticality</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-400" />
              Correlated Assets ({filtered.length})
            </h2>
            <span className="text-xs text-slate-500">Sorted by Risk Score</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs animate-pulse">
                Querying security entity catalog...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No security entities matched current filter criteria.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 sticky top-0 text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Entity Identifier / Value</th>
                    <th className="p-3">Criticality</th>
                    <th className="p-3 text-right">Risk Score</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filtered.map((entity) => {
                    const isSelected = selectedEntity?.id === entity.id;
                    return (
                      <tr 
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity)}
                        className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${isSelected ? 'bg-sky-950/30 border-l-2 border-sky-400' : ''}`}
                      >
                        <td className="p-3 flex items-center gap-2">
                          {getEntityIcon(entity.entity_type)}
                          <span className="text-slate-300 font-sans text-xs">{entity.entity_type}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-200 max-w-[200px] truncate" title={entity.value}>
                          {entity.value}
                        </td>
                        <td className="p-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            entity.criticality === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            entity.criticality === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {entity.criticality}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getRiskColor(entity.risk_score)}`}>
                            {entity.risk_score}/100
                          </span>
                        </td>
                        <td className="p-3 text-right font-sans">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/graph?node=${encodeURIComponent(entity.id)}`);
                            }}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-sky-400 rounded transition-colors"
                            title="Explore in Graph"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Selected Entity Details Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            Entity Risk Dossier
          </h2>

          {selectedEntity ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getEntityIcon(selectedEntity.entity_type)}
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                    {selectedEntity.entity_type} Entity
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-slate-100 break-all">
                  {selectedEntity.value}
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">Calculated Risk Index</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${getRiskColor(selectedEntity.risk_score)}`}>
                    {selectedEntity.risk_score} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedEntity.risk_score >= 80 ? 'bg-rose-500' :
                      selectedEntity.risk_score >= 60 ? 'bg-amber-500' :
                      selectedEntity.risk_score >= 40 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedEntity.risk_score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  Composite factor derived from alert associations, anomaly deviations, and attack graph centrality.
                </p>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">First Seen</div>
                  <div className="text-slate-300 mt-0.5 truncate">{new Date(selectedEntity.first_seen).toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">Last Observed</div>
                  <div className="text-slate-300 mt-0.5 truncate">{new Date(selectedEntity.last_seen).toLocaleString()}</div>
                </div>
              </div>

              {/* Quick Pivots */}
              <div className="pt-2 space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investigative Pivots</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => navigate(`/graph?node=${encodeURIComponent(selectedEntity.id)}`)}
                    className="w-full py-2 px-3 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800 text-sky-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Inspect Neighborhood in Graph Explorer
                  </button>
                  <button
                    onClick={() => navigate(`/hunting`)}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                    Hunt Telemetry for "{selectedEntity.value}"
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Users className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-xs">Select an entity from the list to inspect risk metrics, timeline presence, and graph relationships.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
