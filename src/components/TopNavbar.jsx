import React, { useState, useRef, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  Globe, 
  Search, 
  Minus, 
  Plus, 
  Maximize2, 
  Filter, 
  BookOpen, 
  Sparkles, 
  UserPlus, 
  Download, 
  Upload, 
  RotateCcw,
  User
} from 'lucide-react';

export default function TopNavbar() {
  const { 
    members,
    searchQuery, 
    setSearchQuery, 
    selectMember, 
    setFocusPerson, 
    transform, 
    setTransform,
    setActiveModal,
    activeBranchFilter,
    setActiveBranchFilter,
    resetToDefaultData,
    exportDataJSON,
    importDataJSON
  } = useFamily();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const fileInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Filtered members for live search dropdown
  const filteredSearchMembers = members.filter(m => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const years = `${m.birthYear || ''} ${m.deathYear || ''}`;
    return fullName.includes(query) || years.includes(query) || (m.occupation && m.occupation.toLowerCase().includes(query));
  }).slice(0, 8);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleZoomIn = () => {
    setTransform(prev => ({ ...prev, k: Math.min(prev.k * 1.2, 2.5) }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({ ...prev, k: Math.max(prev.k / 1.2, 0.35) }));
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, k: 0.92 });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          importDataJSON(event.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="top-navbar">
      {/* ─── Logo ─── */}
      <div className="navbar-logo" onClick={handleResetView} title="Reset to Center View">
        <div className="logo-icon-wrapper">
          <Globe className="logo-icon" size={20} />
        </div>
        <span className="logo-text">FAMILY ATLAS</span>
      </div>

      {/* ─── Search Bar & Quick Controls (Center Pill) ─── */}
      <div className="navbar-center" ref={searchContainerRef}>
        <div className="search-pill">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search Bar"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}

          <div className="pill-divider" />

          {/* Quick Zoom Out */}
          <button 
            className="pill-control-btn" 
            onClick={handleZoomOut} 
            title="Zoom Out (−)"
            aria-label="Zoom Out"
          >
            <Minus size={15} />
          </button>

          {/* Quick Zoom In */}
          <button 
            className="pill-control-btn" 
            onClick={handleZoomIn} 
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <Plus size={15} />
          </button>

          {/* Fit / Center View */}
          <button 
            className="pill-control-btn" 
            onClick={handleResetView} 
            title="Recenter Canvas View"
            aria-label="Recenter"
          >
            <Maximize2 size={14} />
          </button>

          {/* Filter Dropdown Toggle */}
          <div className="filter-dropdown-container">
            <button 
              className={`pill-control-btn ${activeBranchFilter !== 'all' ? 'active-filter' : ''}`}
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              title="Filter Lineage Branches"
              aria-label="Filter"
            >
              <Filter size={14} />
            </button>

            {showFilterMenu && (
              <div className="filter-menu-popover">
                <div className="filter-menu-header">Lineage Filters</div>
                {[
                  { key: 'all', label: 'All Generations' },
                  { key: 'paternal', label: 'Paternal Ancestry (Blue)' },
                  { key: 'maternal', label: 'Maternal Ancestry (Green)' },
                  { key: 'spouse', label: 'Spouses & In-Laws (Pink)' },
                  { key: 'descendant', label: 'Descendant Tree (Gold)' }
                ].map(item => (
                  <button
                    key={item.key}
                    className={`filter-item ${activeBranchFilter === item.key ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveBranchFilter(item.key);
                      setShowFilterMenu(false);
                    }}
                  >
                    <span>{item.label}</span>
                    {activeBranchFilter === item.key && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {showSearchResults && filteredSearchMembers.length > 0 && (
          <div className="search-dropdown-menu">
            {filteredSearchMembers.map(member => (
              <div
                key={member.id}
                className="search-result-row"
                onClick={() => {
                  selectMember(member.id);
                  setFocusPerson(member.id);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
              >
                <img src={member.avatar} alt={member.firstName} className="search-row-avatar" />
                <div className="search-row-info">
                  <div className="search-row-name">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="search-row-meta">
                    {member.birthYear}{member.deathYear ? ` – ${member.deathYear}` : ' – Present'} • Gen {member.generation || 'IV'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Action Buttons (Right) ─── */}
      <div className="navbar-actions">
        {/* Add Relative */}
        <button 
          className="nav-action-btn primary"
          onClick={() => setActiveModal('add')}
          title="Add New Family Member"
        >
          <UserPlus size={15} />
          <span className="btn-label">Add Member</span>
        </button>

        {/* AI Storyteller / Insights */}
        <button 
          className="nav-icon-btn glow-effect"
          onClick={() => setActiveModal('ai')}
          title="AI Dynasty Insights & Biographer"
        >
          <Sparkles size={18} />
        </button>

        {/* Chronicles / Storybook View */}
        <button 
          className="nav-icon-btn"
          onClick={() => setActiveModal('chronicles')}
          title="Family Chronicles & Dynasty Timeline"
        >
          <BookOpen size={18} />
        </button>

        {/* Export / Import Menu */}
        <div className="nav-dropdown-wrapper">
          <button className="nav-icon-btn" onClick={exportDataJSON} title="Export Tree Data (JSON)">
            <Download size={18} />
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleFileChange} 
        />
        <button 
          className="nav-icon-btn" 
          onClick={() => fileInputRef.current?.click()} 
          title="Import Tree Data (JSON)"
        >
          <Upload size={18} />
        </button>

        {/* Factory Reset */}
        <button 
          className="nav-icon-btn" 
          onClick={resetToDefaultData} 
          title="Reset to Original Sample Data"
        >
          <RotateCcw size={16} />
        </button>

        {/* User Profile Avatar matching screenshot */}
        <div className="user-profile-avatar" title="Family Atlas Admin">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="User Avatar" 
          />
        </div>
      </div>
    </header>
  );
}
