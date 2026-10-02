import React, { useState, useEffect, useRef } from 'react';
import { SubGraph, GraphNode, GraphEdge } from '../../types';
import { ZoomIn, ZoomOut, RefreshCw, Eye, ShieldAlert, Cpu, HardDrive, Globe, User, Terminal } from 'lucide-react';

interface InteractiveGraphProps {
  subgraph: SubGraph;
  onNodeClick?: (node: GraphNode) => void;
  selectedNodeId?: string;
  height?: string;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  subgraph,
  onNodeClick,
  selectedNodeId,
  height = '500px'
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedNodeId && subgraph.nodes.length > 0) {
      const node = subgraph.nodes.find(n => n.id === selectedNodeId);
      if (node) setSelectedNode(node);
    }
  }, [selectedNodeId, subgraph]);

  // Node Colors by Entity Type
  const getNodeColor = (nodeId: string, label: string) => {
    if (nodeId.toLowerCase().includes('hacker') || nodeId.toLowerCase().includes('malicious') || nodeId.toLowerCase().includes('attacker')) {
      return { bg: 'bg-red-500/30', border: 'border-red-500', text: 'text-red-400', icon: ShieldAlert };
    }
    
    switch (label.toLowerCase()) {
      case 'user':
        return { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400', icon: User };
      case 'host':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', icon: Cpu };
      case 'ip':
        return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', icon: Globe };
      case 'process':
        return { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', icon: Terminal };
      case 'file':
        return { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', icon: HardDrive };
      case 'alert':
        return { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400', icon: ShieldAlert };
      default:
        return { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400', icon: Globe };
    }
  };

  // Compute Layout Coordinates in a force-directed circular ring
  const numNodes = subgraph.nodes.length;
  const radius = Math.min(220, Math.max(120, numNodes * 25));
  const centerX = 380;
  const centerY = 240;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  subgraph.nodes.forEach((node, i) => {
    const angle = (i / Math.max(1, numNodes)) * 2 * Math.PI;
    nodePositions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.2, Math.min(5, z * zoomFactor)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full rounded-2xl bg-[#080c16] border border-slate-800 overflow-hidden" style={{ height }}>
      {/* Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => setZoom(z => Math.min(5, z + 0.25))}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.2, z - 0.25))}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset View"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-mono text-slate-400">
        <span>Nodes: <strong className="text-slate-200">{subgraph.nodes.length}</strong></span>
        <span>•</span>
        <span>Edges: <strong className="text-slate-200">{subgraph.edges.length}</strong></span>
      </div>

      {/* SVG Canvas for Directed Graph */}
      <div 
        className="w-full h-full flex items-center justify-center"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 760 480"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="18"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" opacity="0.8" />
            </marker>
          </defs>

          {/* Edges */}
          {subgraph.edges.map((edge, idx) => {
            const src = nodePositions[edge.source];
            const tgt = nodePositions[edge.target];
            if (!src || !tgt) return null;

            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;

            return (
              <g key={edge.id || idx}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={midX}
                  y={midY - 4}
                  fill="#64748b"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {edge.relation_type}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {subgraph.nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            const isSelected = selectedNode?.id === node.id;
            const color = getNodeColor(node.id, node.label);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedNode(node);
                  onNodeClick?.(node);
                }}
                className="cursor-pointer group"
              >
                {/* Node Outer Halo */}
                <circle
                  r={isSelected ? 26 : 20}
                  className={`transition-all ${isSelected ? 'fill-cyan-500/30 stroke-cyan-400 stroke-2' : 'fill-slate-900 stroke-slate-700 stroke-1 group-hover:stroke-cyan-500'}`}
                />
                <circle
                  r={12}
                  className={`${color.bg} ${color.border} stroke-1`}
                />
                <text
                  y={32}
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight={isSelected ? '600' : '400'}
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {node.id.length > 18 ? `${node.id.substring(0, 16)}...` : node.id}
                </text>
                <text
                  y={42}
                  fill="#64748b"
                  fontSize="8"
                  textAnchor="middle"
                  className="select-none uppercase"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-20 w-80 p-4 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              {selectedNode.label} Entity
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">Identifier</span>
              <span className="font-mono text-slate-200 font-semibold break-all">{selectedNode.id}</span>
            </div>
            {Object.entries(selectedNode.properties || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1 border-t border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-mono">{k}</span>
                <span className="text-slate-300 font-mono text-[11px]">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
