import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFamily } from '../context/FamilyContext';

export default function FamilyCanvas() {
  const {
    layout,
    focusMemberId,
    selectedMemberId,
    selectMember,
    setFocusPerson,
    hoveredMemberId,
    setHoveredMemberId,
    activeBranchFilter,
    transform,
    setTransform
  } = useFamily();

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle Pan
  const handleMouseDown = (e) => {
    // Only drag on canvas background
    if (e.target.closest('.interactive-node-group') || e.target.closest('.node-action-pill')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, dragStart, setTransform]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Smooth Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newK = Math.max(0.3, Math.min(2.8, transform.k * zoomFactor));

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const newX = transform.x - mouseX * (zoomFactor - 1);
    const newY = transform.y - mouseY * (zoomFactor - 1);

    setTransform({ x: newX, y: newY, k: newK });
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Filter visibility helper
  const isNodeVisible = (node) => {
    if (activeBranchFilter === 'all') return true;
    if (node.isRoot) return true;
    if (activeBranchFilter === 'paternal') return node.member.branch === 'paternal';
    if (activeBranchFilter === 'maternal') return node.member.branch === 'maternal';
    if (activeBranchFilter === 'spouse') return node.member.branch === 'spouse';
    if (activeBranchFilter === 'descendant') return node.member.branch === 'descendant';
    return true;
  };

  // Connected node & link highlighting logic
  const isHighlighted = (nodeId) => {
    if (!hoveredMemberId && !selectedMemberId) return false;
    const target = hoveredMemberId || selectedMemberId;
    if (nodeId === target) return true;
    return layout.links.some(l => 
      (l.fromId === target && l.toId === nodeId) || 
      (l.toId === target && l.fromId === nodeId)
    );
  };

  const isLinkHighlighted = (link) => {
    const target = hoveredMemberId || selectedMemberId;
    if (!target) return false;
    return link.fromId === target || link.toId === target;
  };

  return (
    <div 
      className="family-canvas-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <svg className="atlas-svg-viewport">
        <defs>
          {/* Radial Center Glow Filter */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Node Active Halo Filter */}
          <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Dynamic Avatar Clip Path */}
          <clipPath id="avatar-clip">
            <circle cx="0" cy="0" r="22" />
          </clipPath>

          <clipPath id="avatar-clip-root">
            <circle cx="0" cy="0" r="32" />
          </clipPath>
        </defs>

        <g transform={`translate(${containerRef.current ? containerRef.current.clientWidth / 2 + transform.x : 500}, ${containerRef.current ? containerRef.current.clientHeight / 2 + transform.y : 400}) scale(${transform.k})`}>
          
          {/* ─── Concentric Generational Coordinate Grid Rings ─── */}
          <g className="coordinate-grid-rings">
            {/* Center Aura Glow */}
            <circle cx="0" cy="0" r="140" fill="url(#centerGlow)" />

            {layout.rings.map((ring, idx) => (
              <g key={`ring-${idx}`}>
                <circle
                  cx="0"
                  cy="0"
                  r={ring.radius}
                  className="generation-ring-line"
                  strokeDasharray={ring.isCenter ? '0' : '4,6'}
                />

                {/* Top Generation Labels */}
                {ring.topLabel && (
                  <text
                    x="0"
                    y={-ring.radius - 8}
                    className="generation-ring-label"
                    textAnchor="middle"
                  >
                    {ring.topLabel}
                  </text>
                )}

                {/* Bottom Generation Labels */}
                {ring.bottomLabel && (
                  <text
                    x="0"
                    y={ring.radius + 18}
                    className="generation-ring-label"
                    textAnchor="middle"
                  >
                    {ring.bottomLabel}
                  </text>
                )}
              </g>
            ))}

            {/* Radial Guide Rays (Diagonal axes matching reference) */}
            {[-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map((deg, i) => {
              const rad = deg * (Math.PI / 180);
              const x2 = 560 * Math.cos(rad);
              const y2 = 560 * Math.sin(rad);
              return (
                <line
                  key={`ray-${i}`}
                  x1="0"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  className="radial-guide-ray"
                />
              );
            })}

            {/* Roman Numeral Sector Markers */}
            <text x="-540" y="20" className="roman-sector-label" textAnchor="end">Gen I</text>
            <text x="-520" y="280" className="roman-sector-label" textAnchor="end">Gen V</text>
            <text x="-500" y="440" className="roman-sector-label" textAnchor="end">VI</text>
            <text x="0" y="555" className="roman-sector-label" textAnchor="middle">VII</text>
          </g>

          {/* ─── Relationship Bezier Connector Links ─── */}
          <g className="relationship-links">
            {layout.links.map(link => {
              const isTargetActive = isLinkHighlighted(link);
              const isFaded = (hoveredMemberId || selectedMemberId) && !isTargetActive;

              return (
                <g key={link.id}>
                  <path
                    d={link.path}
                    className={`link-bezier-curve ${link.isMarriage ? 'marriage-link' : ''} ${isTargetActive ? 'active-link' : ''}`}
                    stroke={link.strokeColor}
                    strokeWidth={isTargetActive ? 2.8 : link.isMarriage ? 1.8 : 1.5}
                    strokeDasharray={link.isMarriage ? '3,3' : '0'}
                    opacity={isFaded ? 0.22 : 0.85}
                  />

                  {/* Marriage '&' badge indicator between partners */}
                  {link.isMarriage && (
                    <g 
                      transform={`translate(${link.midPoint.x}, ${link.midPoint.y})`} 
                      className="marriage-badge-group"
                    >
                      <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />
                      <text 
                        x="0" 
                        y="3" 
                        textAnchor="middle" 
                        fontSize="10" 
                        fontWeight="bold" 
                        fill="#f43f5e"
                      >
                        &
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ─── Circular Member Nodes ─── */}
          <g className="family-nodes">
            {layout.nodes.map(node => {
              if (!isNodeVisible(node)) return null;

              const isSelected = selectedMemberId === node.member.id;
              const isHovered = hoveredMemberId === node.member.id;
              const isFocusRoot = node.isRoot;
              const isHighlight = isHighlighted(node.member.id);

              const avatarRadius = isFocusRoot ? 30 : 20;

              return (
                <g
                  key={node.member.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`interactive-node-group ${isSelected ? 'selected' : ''} ${isFocusRoot ? 'root-node' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectMember(node.member.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setFocusPerson(node.member.id);
                  }}
                  onMouseEnter={() => setHoveredMemberId(node.member.id)}
                  onMouseLeave={() => setHoveredMemberId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selection / Focus Halo */}
                  {(isSelected || isFocusRoot) && (
                    <circle
                      cx="0"
                      cy="0"
                      r={avatarRadius + 7}
                      className="node-selection-halo"
                      stroke={node.color || '#0284c7'}
                      strokeWidth="2.5"
                      fill="none"
                      filter="url(#glow-filter)"
                    />
                  )}

                  {/* Node Outer Border */}
                  <circle
                    cx="0"
                    cy="0"
                    r={avatarRadius + 2.5}
                    className="node-avatar-border"
                    fill="#ffffff"
                    stroke={node.color || '#94a3b8'}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  {/* Photo Avatar */}
                  <image
                    href={node.member.avatar}
                    x={-avatarRadius}
                    y={-avatarRadius}
                    width={avatarRadius * 2}
                    height={avatarRadius * 2}
                    clipPath={isFocusRoot ? 'url(#avatar-clip-root)' : 'url(#avatar-clip)'}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Role or Kinship Tag (e.g., AUNTS, UNCLE) */}
                  {node.member.branch === 'paternal' && node.member.firstName.includes('AUNTS') && (
                    <text
                      x="0"
                      y={-avatarRadius - 6}
                      className="node-kinship-tag"
                      textAnchor="middle"
                    >
                      AUNTS
                    </text>
                  )}
                  {node.member.firstName.includes('UNCLE') && (
                    <text
                      x="0"
                      y={-avatarRadius - 6}
                      className="node-kinship-tag"
                      textAnchor="middle"
                    >
                      UNCLE
                    </text>
                  )}

                  {/* Member Name Label Underneath (Uppercase like reference) */}
                  <text
                    x="0"
                    y={avatarRadius + 14}
                    className={`node-name-label ${isFocusRoot ? 'root-name' : ''} ${isSelected ? 'selected-name' : ''}`}
                    textAnchor="middle"
                  >
                    {node.member.firstName}
                  </text>

                  {/* Member Birth Year Label */}
                  <text
                    x="0"
                    y={avatarRadius + 25}
                    className="node-year-label"
                    textAnchor="middle"
                  >
                    {node.member.birthYear ? `${node.member.birthYear}–` : ''}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
