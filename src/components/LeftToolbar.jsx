import React from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  Search, 
  Plus, 
  Minus, 
  Maximize2, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function LeftToolbar() {
  const { 
    setTransform, 
    focusMemberId, 
    selectMember, 
    setActiveModal,
    activeBranchFilter,
    setActiveBranchFilter
  } = useFamily();

  const handleZoomIn = () => {
    setTransform(prev => ({ ...prev, k: Math.min(prev.k * 1.25, 2.5) }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({ ...prev, k: Math.max(prev.k / 1.25, 0.35) }));
  };

  const handleRecenter = () => {
    setTransform({ x: 0, y: 0, k: 0.92 });
    if (focusMemberId) {
      selectMember(focusMemberId);
    }
  };

  const cycleBranchFilter = () => {
    const filters = ['all', 'paternal', 'maternal', 'spouse', 'descendant'];
    const currentIndex = filters.indexOf(activeBranchFilter);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    setActiveBranchFilter(nextFilter);
  };

  return (
    <aside className="left-floating-toolbar" aria-label="Canvas Navigation Controls">
      <button 
        className="toolbar-btn" 
        onClick={handleRecenter} 
        title="Focus on Root Center Member"
        aria-label="Center Focus"
      >
        <Search size={18} />
      </button>

      <button 
        className="toolbar-btn" 
        onClick={handleZoomIn} 
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <Plus size={18} />
      </button>

      <button 
        className="toolbar-btn" 
        onClick={handleZoomOut} 
        title="Zoom Out (−)"
        aria-label="Zoom Out"
      >
        <Minus size={18} />
      </button>

      <button 
        className="toolbar-btn" 
        onClick={handleRecenter} 
        title="Fit Entire Family Tree to Screen"
        aria-label="Fit Screen"
      >
        <Maximize2 size={18} />
      </button>

      <button 
        className={`toolbar-btn ${activeBranchFilter !== 'all' ? 'active-filter' : ''}`}
        onClick={cycleBranchFilter}
        title={`Cycle Lineage Branch (${activeBranchFilter.toUpperCase()})`}
        aria-label="Branch Layers"
      >
        <Layers size={18} />
      </button>

      <div className="toolbar-divider" />

      <button 
        className="toolbar-btn highlight"
        onClick={() => setActiveModal('ai')}
        title="Dynasty AI Assistant"
        aria-label="AI Assistant"
      >
        <Sparkles size={18} />
      </button>
    </aside>
  );
}
