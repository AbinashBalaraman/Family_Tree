import React, { useState } from 'react';
import { User, ChevronRight, Sparkles } from 'lucide-react';

export default function PedigreeView({ members, selectedMemberId, onSelectMember, onEditMember }) {
  const focusMember = members.find(m => m.id === selectedMemberId) || members[0];

  if (!focusMember) {
    return (
      <div className="p-12 text-center text-[var(--text-muted)]">
        No family members available to display pedigree.
      </div>
    );
  }

  // Recursive Ancestor Fetcher
  const getAncestors = (member, depth = 0) => {
    if (!member || depth > 3) return null;
    const father = members.find(m => m.id === member.fatherId);
    const mother = members.find(m => m.id === member.motherId);
    return {
      member,
      father: getAncestors(father, depth + 1),
      mother: getAncestors(mother, depth + 1)
    };
  };

  const pedigreeTree = getAncestors(focusMember);

  const renderPedigreeNode = (nodeData, label, level = 0) => {
    if (!nodeData) {
      return (
        <div className="w-52 p-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface-elevated)]/30 text-center opacity-60">
          <p className="text-xs text-[var(--text-muted)] font-medium">Unknown {label}</p>
        </div>
      );
    }

    const { member } = nodeData;
    const isFemale = member.gender === 'female';
    const isFocus = member.id === focusMember.id;

    return (
      <div className="flex items-center gap-4">
        <div 
          onClick={() => onSelectMember(member.id)}
          className={`w-56 p-3 rounded-xl border-2 transition-all cursor-pointer shadow-md ${isFocus ? 'border-amber-400 bg-amber-500/10 shadow-amber-500/20' : (isFemale ? 'border-pink-500/40 bg-pink-500/5' : 'border-blue-500/40 bg-blue-500/5')} hover:scale-105`}
        >
          <div className="flex items-center gap-3">
            {member.avatar ? (
              <img src={member.avatar} alt={member.firstName} className="w-10 h-10 rounded-full object-cover border" />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${isFemale ? 'bg-pink-500' : 'bg-blue-600'}`}>
                {member.firstName[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                {label}
              </span>
              <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">
                {member.firstName} {member.lastName}
              </h4>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {member.birthDate ? member.birthDate.substring(0, 4) : '????'}
              </p>
            </div>
          </div>
        </div>

        {/* Child level branches */}
        {(nodeData.father || nodeData.mother || level < 2) && (
          <div className="flex flex-col gap-4 relative pl-6 border-l-2 border-[var(--border-color)]">
            {renderPedigreeNode(nodeData.father, 'Father', level + 1)}
            {renderPedigreeNode(nodeData.mother, 'Mother', level + 1)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fade-in">
      
      {/* Header & Focus Member Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-color)]">
        <div>
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Direct Ancestry Pedigree Chart
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Tracing biological direct-line ancestors for {focusMember.firstName} {focusMember.lastName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Focus Individual:</label>
          <select
            value={focusMember.id}
            onChange={(e) => onSelectMember(e.target.value)}
            className="bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-medium focus:outline-none focus:border-[var(--accent-primary)]"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.gender})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pedigree Horizontal Flow */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-[900px] flex items-center">
          {renderPedigreeNode(pedigreeTree, 'Primary Root', 0)}
        </div>
      </div>

    </div>
  );
}
