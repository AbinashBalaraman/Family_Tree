import React, { useState, useRef, useEffect } from 'react';
import { calculateTreeLayout } from '../utils/treeLayout';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  User, 
  Heart, 
  Plus, 
  Edit3, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function TreeView({ 
  members, 
  selectedMemberId, 
  onSelectMember, 
  onEditMember, 
  onAddRelative 
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Compute layout
  const { nodes, connectors, generations } = calculateTreeLayout(members);

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
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.4), 2.5));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-70px)] overflow-hidden bg-[var(--bg-main)] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      
      {/* Zoom & Pan Controls floating panel */}
      <div className="absolute bottom-6 right-6 z-30 glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-xl">
        <button onClick={() => setZoom(z => Math.min(z * 1.2, 2.5))} className="btn-icon" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold px-2 text-[var(--text-secondary)] min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom(z => Math.max(z * 0.8, 0.4))} className="btn-icon" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[var(--border-color)]" />
        <button onClick={resetView} className="btn-icon" title="Reset View">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Transform Container */}
      <div 
        className="absolute w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <div className="relative">
          
          {/* Generation Background Bands & Labels */}
          {generations.map((gen, idx) => (
            <div 
              key={`gen_band_${gen}`}
              className="absolute left-[-2000px] right-[-2000px] border-b border-dashed border-[var(--border-color)] pointer-events-none"
              style={{ top: `${idx * 300 - 40}px`, height: '280px' }}
            >
              <span className="absolute left-[2020px] top-2 text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                Generation {gen}
              </span>
            </div>
          ))}

          {/* SVG Connectors Layer */}
          <svg className="absolute overflow-visible pointer-events-none left-0 top-0 w-full h-full z-10">
            {connectors.map(c => {
              const isSelected = selectedMemberId && (c.parentId === selectedMemberId || c.childId === selectedMemberId);
              return (
                <g key={c.id}>
                  <path 
                    d={c.path}
                    className={`connector-path ${c.type === 'spouse' ? 'spouse-connector' : ''} ${isSelected ? 'active' : ''}`}
                  />
                  {c.type === 'spouse' && (
                    <foreignObject x={c.midX - 12} y={c.midY - 12} width={24} height={24}>
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
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
              const isFemale = member.gender === 'female';

              return (
                <div
                  key={member.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMember(member.id);
                  }}
                  className={`tree-node-card absolute ${isFemale ? 'female' : 'male'} ${isSelected ? 'selected glow-animation' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.firstName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md ${isFemale ? 'bg-gradient-to-tr from-rose-500 to-pink-400' : 'bg-gradient-to-tr from-blue-600 to-cyan-500'}`}>
                          {member.firstName[0]}
                        </div>
                      )}
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--bg-surface)] ${isFemale ? 'bg-pink-500' : 'bg-blue-500'}`} />
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.maidenName && (
                        <p className="text-[11px] text-[var(--text-muted)] italic truncate">
                          ({member.maidenName})
                        </p>
                      )}
                      <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
                        {member.birthDate ? member.birthDate.substring(0, 4) : '????'} 
                        {' - '} 
                        {member.deathDate ? member.deathDate.substring(0, 4) : (member.birthDate ? 'Present' : '')}
                      </p>
                    </div>

                  </div>

                  {/* Additional info badge */}
                  {(member.occupation || member.birthPlace) && (
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-center gap-2 truncate">
                      {member.occupation && (
                        <span className="flex items-center gap-1 truncate">
                          <Briefcase className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{member.occupation}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="mt-2.5 flex items-center justify-between gap-1 pt-1 opacity-90 hover:opacity-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMember(member);
                      }}
                      className="text-[11px] font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddRelative(member);
                      }}
                      className="text-[11px] font-semibold text-[var(--accent-emerald)] hover:underline flex items-center gap-1"
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
