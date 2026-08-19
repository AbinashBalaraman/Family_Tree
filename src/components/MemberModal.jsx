import React, { useState, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
import { X, Save, Plus, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/initialFamilyData';

export default function MemberModal() {
  const { 
    activeModal, 
    setActiveModal, 
    modalTargetMemberId, 
    getMember, 
    updateMember 
  } = useFamily();

  const isEditMode = activeModal === 'edit';
  const isProfileMode = activeModal === 'profile';

  const member = getMember(modalTargetMemberId);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'female',
    birthYear: '',
    deathYear: '',
    birthPlace: '',
    occupation: '',
    avatar: '',
    bio: '',
    branch: 'paternal'
  });

  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newTimeline, setNewTimeline] = useState({ year: '', title: '', description: '', type: 'milestone' });

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        gender: member.gender || 'female',
        birthYear: member.birthYear || '',
        deathYear: member.deathYear || '',
        birthPlace: member.birthPlace || '',
        occupation: member.occupation || '',
        avatar: member.avatar || '',
        bio: member.bio || '',
        branch: member.branch || 'paternal'
      });
      setTimelineEvents(member.timeline ? [...member.timeline] : []);
    }
  }, [member]);

  if (!activeModal || (!isEditMode && !isProfileMode) || !member) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateMember(member.id, {
      ...formData,
      timeline: timelineEvents
    });
    setActiveModal(null);
  };

  const handleAddTimeline = () => {
    if (!newTimeline.year || !newTimeline.title) return;
    setTimelineEvents([...timelineEvents, { ...newTimeline }]);
    setNewTimeline({ year: '', title: '', description: '', type: 'milestone' });
  };

  const handleRemoveTimeline = (index) => {
    setTimelineEvents(timelineEvents.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <h2>{isEditMode ? 'Edit Member Profile' : `${member.firstName} ${member.lastName}`}</h2>
            <span className="modal-subtitle">Gen {member.generation || 'IV'} Atlas Record</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        {isProfileMode ? (
          /* ─── Profile Read View ─── */
          <div className="modal-body profile-view">
            <div className="profile-hero">
              <img src={member.avatar} alt={member.firstName} className="profile-hero-img" />
              <div className="profile-hero-info">
                <h3>{member.firstName} {member.lastName}</h3>
                <div className="profile-meta-tag">
                  {member.birthYear} – {member.deathYear || 'Present'} • {member.occupation || 'Family Member'}
                </div>
                <p className="profile-bio-quote">"{member.bio}"</p>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <Calendar size={18} />
                <div>
                  <div className="stat-box-label">Birth Date</div>
                  <div className="stat-box-val">{member.birthYear || 'Unknown'}</div>
                </div>
              </div>
              <div className="profile-stat-box">
                <MapPin size={18} />
                <div>
                  <div className="stat-box-label">Origin Location</div>
                  <div className="stat-box-val">{member.birthPlace || 'Not Specified'}</div>
                </div>
              </div>
              <div className="profile-stat-box">
                <Briefcase size={18} />
                <div>
                  <div className="stat-box-label">Career & Calling</div>
                  <div className="stat-box-val">{member.occupation || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="profile-timeline-section">
              <h4>Historical Milestones</h4>
              <div className="profile-timeline-flow">
                {timelineEvents.map((t, idx) => (
                  <div key={idx} className="timeline-flow-item">
                    <div className="timeline-flow-badge">{t.year}</div>
                    <div className="timeline-flow-details">
                      <strong>{t.title}</strong>
                      <p>{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => setActiveModal('edit')}
              >
                Edit Details
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ─── Edit Form View ─── */
          <form onSubmit={handleSave} className="modal-body edit-form">
            <div className="form-row two-cols">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="form-row three-cols">
              <div className="form-group">
                <label>Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
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
                  placeholder="e.g. 1962"
                />
              </div>
              <div className="form-group">
                <label>Death Year (or empty)</label>
                <input 
                  type="text" 
                  value={formData.deathYear || ''} 
                  onChange={e => setFormData({ ...formData, deathYear: e.target.value })}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Birthplace / Residence</label>
                <input 
                  type="text" 
                  value={formData.birthPlace} 
                  onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input 
                  type="text" 
                  value={formData.occupation} 
                  onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Profession"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Avatar Photo URL</label>
              <div className="avatar-input-wrapper">
                <input 
                  type="url" 
                  value={formData.avatar} 
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                />
                <img src={formData.avatar || AVATAR_PRESETS.sarah} alt="Preview" className="avatar-mini-preview" />
              </div>
              {/* Preset Avatars Bar */}
              <div className="avatar-presets-bar">
                <span>Or pick preset:</span>
                {Object.entries(AVATAR_PRESETS).slice(0, 7).map(([key, url]) => (
                  <img 
                    key={key} 
                    src={url} 
                    alt={key} 
                    className="preset-avatar-thumb"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Biography & Heritage Story</label>
              <textarea 
                rows="3" 
                value={formData.bio} 
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Timeline Events Editor */}
            <div className="form-group timeline-editor">
              <label>Timeline Milestones</label>
              <div className="timeline-add-row">
                <input 
                  type="text" 
                  placeholder="Year" 
                  style={{ width: '80px' }}
                  value={newTimeline.year}
                  onChange={e => setNewTimeline({ ...newTimeline, year: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Milestone Title" 
                  style={{ flex: 1 }}
                  value={newTimeline.title}
                  onChange={e => setNewTimeline({ ...newTimeline, title: e.target.value })}
                />
                <button type="button" className="btn btn-small" onClick={handleAddTimeline}>
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="timeline-items-list">
                {timelineEvents.map((t, idx) => (
                  <div key={idx} className="timeline-edit-item">
                    <span><strong>{t.year}</strong>: {t.title}</span>
                    <button type="button" onClick={() => handleRemoveTimeline(idx)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
