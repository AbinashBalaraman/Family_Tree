import React from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  X, 
  Target, 
  Edit3, 
  UserPlus, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Heart, 
  Users, 
  ChevronRight,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function MemberDetailsSidebar() {
  const { 
    selectedMember, 
    selectedMemberId, 
    selectMember, 
    setFocusPerson, 
    focusMemberId,
    getMemberRelations,
    setActiveModal,
    setModalTargetMemberId,
    deleteMember
  } = useFamily();

  if (!selectedMember) return null;

  const relations = getMemberRelations(selectedMember.id);
  const isFocusPerson = focusMemberId === selectedMember.id;

  const handleSetAsRoot = () => {
    setFocusPerson(selectedMember.id);
  };

  const handleEdit = () => {
    setModalTargetMemberId(selectedMember.id);
    setActiveModal('edit');
  };

  const handleViewProfile = () => {
    setModalTargetMemberId(selectedMember.id);
    setActiveModal('profile');
  };

  const handleAddChild = () => {
    setModalTargetMemberId(selectedMember.id);
    setActiveModal('add');
  };

  return (
    <aside className="member-details-sidebar" aria-label="Member Information Panel">
      {/* ─── Header & Close Button ─── */}
      <div className="sidebar-top-bar">
        <span className="sidebar-badge">Gen {selectedMember.generation || 'IV'} Atlas Record</span>
        <button 
          className="sidebar-close-btn" 
          onClick={() => selectMember(null)}
          title="Close details panel"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-scrollable-content">
        {/* ─── Hero Avatar & Title matching screenshot ─── */}
        <div className="sidebar-hero-section">
          <div className="sidebar-avatar-wrapper">
            <div className="sidebar-avatar-glow" />
            <img 
              src={selectedMember.avatar} 
              alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
              className="sidebar-large-avatar"
            />
            {isFocusPerson && (
              <div className="sidebar-root-pill" title="Center Focus of Atlas">
                Focus Root
              </div>
            )}
          </div>

          <h2 className="sidebar-member-name">
            {selectedMember.firstName} {selectedMember.lastName}
          </h2>
          <div className="sidebar-member-dates">
            {selectedMember.birthYear}–{selectedMember.deathYear || ''}
          </div>

          <p className="sidebar-bio-text">
            {selectedMember.bio || `${selectedMember.firstName} is an esteemed member of the lineage, contributing to generational traditions and heritage.`}
          </p>
        </div>

        {/* ─── VITAL STATS Section ─── */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">VITAL STATS</h3>
          <div className="vital-stats-grid">
            <div className="vital-stat-item">
              <span className="stat-label">Birth-Death Years</span>
              <span className="stat-value">
                {selectedMember.birthYear} – {selectedMember.deathYear || 'Present'}
              </span>
            </div>

            {selectedMember.birthPlace && (
              <div className="vital-stat-item">
                <span className="stat-label">Birthplace</span>
                <span className="stat-value">{selectedMember.birthPlace}</span>
              </div>
            )}

            {selectedMember.occupation && (
              <div className="vital-stat-item">
                <span className="stat-label">Occupation</span>
                <span className="stat-value">{selectedMember.occupation}</span>
              </div>
            )}

            <div className="vital-stat-item">
              <span className="stat-label">Family Lineage</span>
              <span className="stat-value branch-tag">
                {selectedMember.branch ? selectedMember.branch.toUpperCase() : 'DIRECT DESCENDANT'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── TIMELINE Section matching screenshot ─── */}
        <div className="sidebar-section">
          <div className="section-header-flex">
            <h3 className="sidebar-section-title">TIMELINE</h3>
            <span className="section-subtitle-tag">Milestones</span>
          </div>

          <div className="sidebar-timeline-list">
            {selectedMember.timeline && selectedMember.timeline.length > 0 ? (
              selectedMember.timeline.map((item, idx) => (
                <div key={idx} className="timeline-entry">
                  <div className={`timeline-indicator ${item.type || 'milestone'}`} />
                  <div className="timeline-entry-content">
                    <div className="timeline-entry-header">
                      <span className="timeline-entry-title">{item.title}</span>
                      <span className="timeline-entry-year">{item.year}</span>
                    </div>
                    {item.description && (
                      <p className="timeline-entry-desc">{item.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="timeline-entry">
                  <div className="timeline-indicator birth" />
                  <div className="timeline-entry-content">
                    <div className="timeline-entry-header">
                      <span className="timeline-entry-title">Parent-Child</span>
                      <span className="timeline-entry-year">{selectedMember.birthYear}</span>
                    </div>
                    <p className="timeline-entry-desc">Born into the family lineage.</p>
                  </div>
                </div>
                <div className="timeline-entry">
                  <div className="timeline-indicator marriage" />
                  <div className="timeline-entry-content">
                    <div className="timeline-entry-header">
                      <span className="timeline-entry-title">Marriage / Partner</span>
                      <span className="timeline-entry-year">Family Union</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* View Full Profile Blue Button matching screenshot */}
          <button 
            className="sidebar-primary-action-btn"
            onClick={handleViewProfile}
          >
            VIEW PROFILE
          </button>
        </div>

        {/* ─── RELATIONSHIPS Section matching screenshot ─── */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">RELATIONSHIPS</h3>

          <div className="relationship-legend-pills">
            <div className="rel-legend-item">
              <span className="rel-dot parent" />
              <span>Parent-Child</span>
            </div>
            <div className="rel-legend-item">
              <span className="rel-dot marriage" />
              <span>Marriage / Partner</span>
            </div>
          </div>

          <div className="relationships-group-container">
            {/* Parents */}
            {relations.parents.length > 0 && (
              <div className="rel-category">
                <span className="rel-cat-title">PARENTS ({relations.parents.length})</span>
                {relations.parents.map(parent => (
                  <div 
                    key={parent.id} 
                    className="rel-member-card"
                    onClick={() => selectMember(parent.id)}
                  >
                    <img src={parent.avatar} alt={parent.firstName} className="rel-avatar" />
                    <div className="rel-info">
                      <div className="rel-name">{parent.firstName} {parent.lastName}</div>
                      <div className="rel-meta">{parent.birthYear}–{parent.deathYear || ''} • Parent</div>
                    </div>
                    <ChevronRight size={15} className="rel-arrow" />
                  </div>
                ))}
              </div>
            )}

            {/* Spouses */}
            {relations.spouses.length > 0 && (
              <div className="rel-category">
                <span className="rel-cat-title">SPOUSE / PARTNER ({relations.spouses.length})</span>
                {relations.spouses.map(spouse => (
                  <div 
                    key={spouse.id} 
                    className="rel-member-card"
                    onClick={() => selectMember(spouse.id)}
                  >
                    <img src={spouse.avatar} alt={spouse.firstName} className="rel-avatar" />
                    <div className="rel-info">
                      <div className="rel-name">{spouse.firstName} {spouse.lastName}</div>
                      <div className="rel-meta">{spouse.birthYear}–{spouse.deathYear || ''} • Spouse</div>
                    </div>
                    <ChevronRight size={15} className="rel-arrow" />
                  </div>
                ))}
              </div>
            )}

            {/* Siblings */}
            {relations.siblings.length > 0 && (
              <div className="rel-category">
                <span className="rel-cat-title">SIBLINGS ({relations.siblings.length})</span>
                {relations.siblings.map(sib => (
                  <div 
                    key={sib.id} 
                    className="rel-member-card"
                    onClick={() => selectMember(sib.id)}
                  >
                    <img src={sib.avatar} alt={sib.firstName} className="rel-avatar" />
                    <div className="rel-info">
                      <div className="rel-name">{sib.firstName} {sib.lastName}</div>
                      <div className="rel-meta">{sib.birthYear}–{sib.deathYear || ''} • Sibling</div>
                    </div>
                    <ChevronRight size={15} className="rel-arrow" />
                  </div>
                ))}
              </div>
            )}

            {/* Children */}
            {relations.children.length > 0 && (
              <div className="rel-category">
                <span className="rel-cat-title">CHILDREN ({relations.children.length})</span>
                {relations.children.map(child => (
                  <div 
                    key={child.id} 
                    className="rel-member-card"
                    onClick={() => selectMember(child.id)}
                  >
                    <img src={child.avatar} alt={child.firstName} className="rel-avatar" />
                    <div className="rel-info">
                      <div className="rel-name">{child.firstName} {child.lastName}</div>
                      <div className="rel-meta">{child.birthYear}–{child.deathYear || ''} • Child</div>
                    </div>
                    <ChevronRight size={15} className="rel-arrow" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Action Controls ─── */}
        <div className="sidebar-bottom-actions">
          {!isFocusPerson && (
            <button 
              className="sidebar-secondary-btn focus"
              onClick={handleSetAsRoot}
            >
              <Target size={15} />
              <span>Set as Focus Center</span>
            </button>
          )}

          <div className="sidebar-btn-row">
            <button 
              className="sidebar-secondary-btn"
              onClick={handleEdit}
            >
              <Edit3 size={15} />
              <span>Edit Member</span>
            </button>

            <button 
              className="sidebar-secondary-btn"
              onClick={handleAddChild}
            >
              <UserPlus size={15} />
              <span>Add Relative</span>
            </button>
          </div>

          <button 
            className="sidebar-danger-btn"
            onClick={() => {
              if (window.confirm(`Delete ${selectedMember.firstName} ${selectedMember.lastName} from family tree?`)) {
                deleteMember(selectedMember.id);
              }
            }}
          >
            <Trash2 size={14} />
            <span>Delete Member</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
