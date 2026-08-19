import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { Sparkles, Info, X } from 'lucide-react';

export default function LegendPanel() {
  const { setActiveModal } = useFamily();
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="bottom-floating-panel">
      {showLegend && (
        <div className="lineage-legend-card">
          <div className="legend-card-header">
            <h4>Lineage Color System</h4>
            <button className="legend-close" onClick={() => setShowLegend(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="legend-items-list">
            <div className="legend-row">
              <span className="color-swatch root" />
              <span>Center Focus Node (Sarah Johnson)</span>
            </div>
            <div className="legend-row">
              <span className="color-swatch paternal" />
              <span>Paternal Ancestry (James Johnson Branch)</span>
            </div>
            <div className="legend-row">
              <span className="color-swatch maternal" />
              <span>Maternal Ancestry (Elizabeth Harper Branch)</span>
            </div>
            <div className="legend-row">
              <span className="color-swatch spouse" />
              <span>Spouses & Partners (David Vance Lineage)</span>
            </div>
            <div className="legend-row">
              <span className="color-swatch descendant" />
              <span>Descendants (Gen V, VI, VII Children)</span>
            </div>
          </div>
        </div>
      )}

      <div className="floating-action-pill">
        <button 
          className="float-tool-btn glow" 
          onClick={() => setActiveModal('ai')}
          title="Dynasty AI Assistant"
        >
          <Sparkles size={16} />
        </button>

        <button 
          className={`float-tool-btn ${showLegend ? 'active' : ''}`}
          onClick={() => setShowLegend(!showLegend)}
          title="Lineage Color Legend"
        >
          <Info size={16} />
        </button>
      </div>
    </div>
  );
}
