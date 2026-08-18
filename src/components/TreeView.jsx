import React, { useState, useRef, useMemo, useEffect } from 'react';
import { calculateTreeLayout } from '../utils/treeLayout';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  User, 
  Heart, 
  Plus, 
  Edit3, 
  Sparkles,
  MapPin,
  Briefcase,
  Crown
} from 'lucide-react';

export default function TreeView({ 
  members, 
  selectedMemberId, 
  onSelectMember, 
  onEditMember, 
  onAddRelative 
}) {
  const [zoom, setZoom] = useState(0.9);
  const [pan, setPan] = useState({ x: 0, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Compute Layout
  const { nodes, connectors, generations } = useMemo(() => calculateTreeLayout(members), [members]);

  // Center initial pan on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: 40 });
    }
  }, []);

  // Ancestors and Descendants calculation for lineage highlighting
  const { ancestorIds, descendantIds } = useMemo(() => {
    if (!selectedMemberId) return { ancestorIds: new Set(), descendantIds: new Set() };

    const memberMap = new Map(members.map(m => [m.id, m]));
    const ancestors = new Set();
    const descendants = new Set();

    // Traverse Ancestors Upward
    function getAncestors(id) {
      const m = memberMap.get(id);
      if (!m) return;
      if (m.fatherId) { ancestors.add(m.fatherId); getAncestors(m.fatherId); }
      if (m.motherId) { ancestors.add(m.motherId); getAncestors(m.motherId); }
    }

    // Traverse Descendants Downward
    function getDescendants(id) {
      const m = memberMap.get(id);
      if (!m) return;
      if (m.childrenIds) {
        m.childrenIds.forEach(cId => {
          descendants.add(cId);
          getDescendants(cId);
        });
      }
    }

    getAncestors(selectedMemberId);
    getDescendants(selectedMemberId);

    return { ancestorIds: ancestors, descendantIds: descendants };
  }, [selectedMemberId, members]);

  // Handle Canvas Drag / Pan
  const handleMouseDown = (e) => {
    if (e.target.closest('.tree-node-card') || e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.35), 2.0));
  };

  const resetView = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: 40 });
    } else {
      setPan({ x: 0, y: 40 });
    }
    setZoom(0.9);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-72px)] overflow-hidden bg-[var(--bg-main)] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      
      {/* Floating Canvas Control Panel */}
      <div className="absolute bottom-6 right-6 z-30 glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
        <button onClick={() => setZoom(z => Math.min(z * 1.15, 2.0))} className="btn-icon" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold px-2 text-[var(--text-secondary)] min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom(z => Math.max(z * 0.85, 0.35))} className="btn-icon" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[var(--border-color)]" />
        <button onClick={resetView} className="btn-icon" title="Center View">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Transform Container */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <div className="relative pointer-events-auto">
          
          {/* Generation Background Bands & Headers */}
          {generations.map((gen, idx) => (
            <div 
              key={`gen_band_${gen}`}
              className="absolute left-[-3000px] right-[-3000px] border-b border-dashed border-[var(--border-color)] pointer-events-none"
              style={{ top: `${60 + idx * 270 - 20}px`, height: '260px' }}
            >
              <span className="absolute left-[3040px] top-2 text-[10px] uppercase font-extrabold tracking-widest text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-color)] shadow-sm">
                Generation {gen}
              </span>
            </div>
          ))}

          {/* SVG Connectors Layer */}
          <svg className="absolute overflow-visible pointer-events-none left-0 top-0 w-full h-full z-10">
            {connectors.map(c => {
              const isAncestorFlow = ancestorIds.has(c.childId) && (ancestorIds.has(c.parentId) || c.parentId === selectedMemberId);
              const isDescendantFlow = (descendantIds.has(c.childId) || c.childId === selectedMemberId) && descendantIds.has(c.childId);

              let connectorClass = "connector-path";
              if (isAncestorFlow) connectorClass += " ancestor-flow";
              else if (isDescendantFlow) connectorClass += " descendant-flow";
              else if (c.type === 'spouse') connectorClass += " spouse-connector";

              return (
                <g key={c.id}>
                  <path 
                    d={c.path}
                    className={connectorClass}
                  />
                  {c.type === 'spouse' && (
                    <foreignObject x={c.midX - 12} y={c.midY - 12} width={24} height={24}>
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-md backdrop-blur-md">
                        <Heart className="w-3 h-3 fill-rose-500" />
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <div className="relative z-20">
            {nodes.map(({ x, y, member }) => {
              const isSelected = member.id === selectedMemberId;
              const isAncestor = ancestorIds.has(member.id);
              const isDescendant = descendantIds.has(member.id);
              const isFemale = member.gender === 'female';
              const isRoot = !member.fatherId && !member.motherId && (member.generation === 1 || !member.generation);

              let cardClass = `tree-node-card ${isFemale ? 'female' : 'male'}`;
              if (isRoot) cardClass += " root-ancestor";
              if (isSelected) cardClass += " selected gold-glow";
              else if (isAncestor) cardClass += " highlighted-ancestor";
              else if (isDescendant) cardClass += " highlighted-descendant";

              return (
                <div
                  key={member.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMember(member.id);
                  }}
                  className={cardClass}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`
                  }}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Avatar Thumbnail */}
                    <div className="relative flex-shrink-0">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.firstName}
                          className="node-avatar-img"
                        />
                      ) : (
                        <div className={`node-avatar-fallback ${isFemale ? 'bg-gradient-to-tr from-rose-500 to-pink-400' : 'bg-gradient-to-tr from-blue-600 to-cyan-500'}`}>
                          {member.firstName ? member.firstName[0] : '?'}
                        </div>
                      )}

                      {/* Crown icon for Root Ancestors */}
                      {isRoot && (
                        <div className="absolute -top-2 -left-2 p-1 rounded-full bg-amber-500 text-white shadow-md">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}

                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-surface)] ${isFemale ? 'bg-pink-500' : 'bg-blue-500'}`} />
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                          {member.firstName} {member.lastName}
                        </h3>
                      </div>

                      {member.maidenName && (
                        <p className="text-[11px] text-[var(--text-muted)] italic truncate">
                          ({member.maidenName})
                        </p>
                      )}
                      
                      <p className="text-[11px] text-[var(--text-secondary)] font-semibold mt-0.5">
                        {member.birthDate ? member.birthDate.substring(0, 4) : '????'} 
                        {' - '} 
                        {member.deathDate ? member.deathDate.substring(0, 4) : (member.birthDate ? 'Living' : '')}
                      </p>
                    </div>

                  </div>

                  {/* Occupation / Place Badge */}
                  {(member.occupation || member.birthPlace) && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-center gap-2 truncate">
                      {member.occupation && (
                        <span className="flex items-center gap-1 truncate">
                          <Briefcase className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{member.occupation}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="mt-2.5 flex items-center justify-between gap-1 pt-1 opacity-90 hover:opacity-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMember(member);
                      }}
                      className="text-[11px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddRelative(member);
                      }}
                      className="text-[11px] font-bold text-[var(--accent-emerald)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Kin
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
