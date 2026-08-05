import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Heart, 
  Calendar, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export default function MemberDirectory({ 
  members, 
  searchTerm, 
  setSearchTerm, 
  onSelectMember, 
  onEditMember, 
  onAddMember, 
  onDeleteMember 
}) {
  const [genderFilter, setGenderFilter] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter & Sort
  const filteredMembers = members.filter(m => {
    const nameMatch = `${m.firstName} ${m.lastName} ${m.maidenName || ''} ${m.occupation || ''} ${m.birthPlace || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const genderMatch = genderFilter === 'all' || m.gender === genderFilter;
    const genMatch = generationFilter === 'all' || (m.generation || 1) === parseInt(generationFilter, 10);
    return nameMatch && genderMatch && genMatch;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.firstName.localeCompare(b.firstName);
    if (sortBy === 'birthDate') return (a.birthDate || '').localeCompare(b.birthDate || '');
    if (sortBy === 'generation') return (a.generation || 1) - (b.generation || 1);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fade-in">
      
      {/* Directory Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--accent-primary)]" />
            Family Member Directory
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Total {filteredMembers.length} indexed family records across {new Set(members.map(m => m.generation || 1)).size} generations
          </p>
        </div>

        <button onClick={onAddMember} className="btn btn-primary text-xs">
          <Plus className="w-4 h-4" />
          Add Family Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--text-muted)]" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-medium"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Generation Filter */}
          <div className="flex items-center gap-2">
            <select
              value={generationFilter}
              onChange={(e) => setGenerationFilter(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-medium"
            >
              <option value="all">All Generations</option>
              {[1, 2, 3, 4, 5].map(g => (
                <option key={g} value={g}>Gen {g}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-medium"
            >
              <option value="name">First Name</option>
              <option value="birthDate">Birth Date</option>
              <option value="generation">Generation Rank</option>
            </select>
          </div>
        </div>

      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => {
          const isFemale = member.gender === 'female';
          return (
            <div 
              key={member.id}
              className="glass-panel p-5 rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.firstName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-md" 
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md ${isFemale ? 'bg-pink-500' : 'bg-blue-600'}`}>
                        {member.firstName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {member.firstName} {member.lastName}
                      </h3>
                      {member.maidenName && (
                        <p className="text-xs text-[var(--text-muted)] italic">
                          née {member.maidenName}
                        </p>
                      )}
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                        Gen {member.generation || 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button 
                      onClick={() => onEditMember(member)}
                      className="btn-icon" 
                      title="Edit Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onDeleteMember(member.id)}
                      className="btn-icon text-rose-400 hover:text-rose-300 hover:border-rose-500/50" 
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[var(--text-secondary)] mb-4">
                  {member.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{member.birthDate} {member.deathDate ? `- ${member.deathDate}` : '(Living)'}</span>
                    </div>
                  )}
                  {member.birthPlace && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{member.birthPlace}</span>
                    </div>
                  )}
                  {member.occupation && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{member.occupation}</span>
                    </div>
                  )}
                </div>

                {member.bio && (
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 italic bg-[var(--bg-surface-elevated)]/50 p-2.5 rounded-xl">
                    "{member.bio}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <button 
                  onClick={() => onSelectMember(member.id)}
                  className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  View on Tree Canvas →
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
