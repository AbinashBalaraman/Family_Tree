import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { X, UserPlus, Heart, Users } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/initialFamilyData';

export default function AddMemberModal() {
  const { 
    activeModal, 
    setActiveModal, 
    modalTargetMemberId, 
    members, 
    addMember,
    getMember
  } = useFamily();

  const targetMember = getMember(modalTargetMemberId) || members[0];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: targetMember?.lastName || 'JOHNSON',
    gender: 'female',
    birthYear: '1990',
    deathYear: '',
    birthPlace: targetMember?.birthPlace || 'Boston, MA',
    occupation: '',
    avatar: AVATAR_PRESETS.youngWoman,
    bio: '',
    branch: 'descendant'
  });

  const [relType, setRelType] = useState('child'); // 'child', 'parent', 'spouse', 'sibling'

  if (activeModal !== 'add') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) return;

    addMember(formData, {
      targetId: targetMember?.id,
      type: relType
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <h2>Add New Relative</h2>
            {targetMember && (
              <span className="modal-subtitle">
                Connecting to {targetMember.firstName} {targetMember.lastName}
              </span>
            )}
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body add-form">
          {/* ─── Relationship Link Selector ─── */}
          {targetMember && (
            <div className="form-group relation-selector-box">
              <label>Select Relationship to {targetMember.firstName}</label>
              <div className="relation-type-pills">
                {[
                  { id: 'child', label: '👶 Child (Descendant)', branch: 'descendant' },
                  { id: 'spouse', label: '💍 Spouse / Partner', branch: 'spouse' },
                  { id: 'parent', label: '🏛️ Parent (Ancestor)', branch: 'paternal' },
                  { id: 'sibling', label: '🤝 Sibling', branch: 'paternal' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`rel-type-btn ${relType === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setRelType(item.id);
                      setFormData({ ...formData, branch: item.branch });
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row two-cols">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                placeholder="e.g. EMILY" 
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value.toUpperCase() })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
                required 
              />
            </div>
          </div>

          <div className="form-row three-cols">
            <div className="form-group">
              <label>Gender</label>
              <select 
                value={formData.gender}
                onChange={e => {
                  const g = e.target.value;
                  setFormData({ 
                    ...formData, 
                    gender: g,
                    avatar: g === 'male' ? AVATAR_PRESETS.youngMan : AVATAR_PRESETS.youngWoman
                  });
                }}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Birth Year</label>
              <input 
                type="text" 
                value={formData.birthYear}
                onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                placeholder="1995"
              />
            </div>
            <div className="form-group">
              <label>Death Year (Optional)</label>
              <input 
                type="text" 
                value={formData.deathYear}
                onChange={e => setFormData({ ...formData, deathYear: e.target.value })}
                placeholder="Living"
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label>Birthplace / City</label>
              <input 
                type="text" 
                value={formData.birthPlace}
                onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="e.g. Boston, MA"
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input 
                type="text" 
                value={formData.occupation}
                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Botanist"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pick Avatar Photo</label>
            <div className="avatar-presets-bar">
              {Object.entries(AVATAR_PRESETS).map(([key, url]) => (
                <img 
                  key={key} 
                  src={url} 
                  alt={key} 
                  className={`preset-avatar-thumb ${formData.avatar === url ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, avatar: url })}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Heritage Biography</label>
            <textarea 
              rows="2"
              placeholder="Notable life details, milestones, or memories..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} /> Add Member to Tree
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
