import React, { useState, useEffect } from 'react';
import { X, User, Heart, Calendar, MapPin, Briefcase, FileText, Camera, Link2 } from 'lucide-react';

export default function MemberModal({ member, members, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: `mem-${Date.now()}`,
    firstName: '',
    lastName: '',
    maidenName: '',
    gender: 'male',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    occupation: '',
    bio: '',
    avatar: '',
    fatherId: '',
    motherId: '',
    spouseIds: [],
    generation: 1
  });

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        fatherId: member.fatherId || '',
        motherId: member.motherId || '',
        spouseIds: member.spouseIds || [],
        generation: member.generation || 1
      });
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    onSave({
      ...formData,
      fatherId: formData.fatherId || null,
      motherId: formData.motherId || null
    });
  };

  const isEditing = !!member?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border-color)] shadow-2xl p-6 relative">
        
        {/* Close button */}
        <button onClick={onClose} className="btn-icon absolute top-5 right-5 z-10">
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--accent-primary)]" />
          {isEditing ? `Edit ${formData.firstName}'s Profile` : 'Add New Family Member'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar & Basic Info Header */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
            <div className="relative">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl ${formData.gender === 'female' ? 'bg-pink-500' : 'bg-blue-600'}`}>
                  {formData.firstName[0] || '?'}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-[200px] space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Avatar Image URL:</label>
                <div className="relative">
                  <Camera className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Names & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">First Name *</label>
              <input 
                type="text" 
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Last / Family Name *</label>
              <input 
                type="text" 
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Maiden Name (optional)</label>
              <input 
                type="text" 
                value={formData.maidenName}
                onChange={(e) => setFormData({ ...formData, maidenName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Gender & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Birth Date</label>
              <input 
                type="date" 
                value={formData.birthDate || ''}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Death Date (if deceased)</label>
              <input 
                type="date" 
                value={formData.deathDate || ''}
                onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Place & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Birth Place / Location</label>
              <input 
                type="text" 
                placeholder="e.g. London, UK"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Occupation / Title</label>
              <input 
                type="text" 
                placeholder="e.g. Botanist & Author"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Kinship Connections (Father & Mother) */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-color)] space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-[var(--accent-primary)]" />
              Kinship Relationships
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Biological Father:</label>
                <select
                  value={formData.fatherId || ''}
                  onChange={(e) => setFormData({ ...formData, fatherId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  <option value="">-- None (Root Ancestor) --</option>
                  {members.filter(m => m.id !== formData.id && m.gender === 'male').map(m => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Biological Mother:</label>
                <select
                  value={formData.motherId || ''}
                  onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  <option value="">-- None (Root Ancestor) --</option>
                  {members.filter(m => m.id !== formData.id && m.gender === 'female').map(m => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bio / Biography */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Biography & Historical Notes</label>
            <textarea
              rows={3}
              placeholder="Write a brief life story or notable accomplishments..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Save Member Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
