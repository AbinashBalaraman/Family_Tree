import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_MEMBERS, INITIAL_RELATIONSHIPS } from '../data/initialFamilyData';
import { calculateRadialLayout } from '../utils/radialLayout';

const FamilyContext = createContext(null);

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

export const FamilyProvider = ({ children }) => {
  // Members State
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('familyAtlas_members_v2');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  // Relationships State
  const [relationships, setRelationships] = useState(() => {
    const saved = localStorage.getItem('familyAtlas_relationships_v2');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  // Navigation & Selection States
  const [focusMemberId, setFocusMemberId] = useState('sarah-johnson-1891');
  const [selectedMemberId, setSelectedMemberId] = useState('sarah-johnson-1891');
  const [hoveredMemberId, setHoveredMemberId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranchFilter, setActiveBranchFilter] = useState('all'); // 'all', 'paternal', 'maternal', 'spouse', 'descendant'
  
  // Canvas Viewport Transform
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.92 });

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'add' | 'edit' | 'chronicles' | 'ai' | 'export'
  const [modalTargetMemberId, setModalTargetMemberId] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('familyAtlas_members_v2', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('familyAtlas_relationships_v2', JSON.stringify(relationships));
  }, [relationships]);

  // Compute Layout Memoized
  const layout = useMemo(() => {
    return calculateRadialLayout(members, relationships, focusMemberId);
  }, [members, relationships, focusMemberId]);

  // Get Member by ID helper
  const getMember = (id) => members.find(m => m.id === id);

  // Focus & Selection Helpers
  const selectMember = (id) => {
    setSelectedMemberId(id);
  };

  const setFocusPerson = (id) => {
    setFocusMemberId(id);
    setSelectedMemberId(id);
  };

  // CRUD: Add Member
  const addMember = (memberData, relationship = null) => {
    const newId = memberData.id || `member-${uuidv4().slice(0, 8)}`;
    const newMember = {
      id: newId,
      firstName: memberData.firstName || 'NEW',
      lastName: memberData.lastName || 'MEMBER',
      gender: memberData.gender || 'female',
      birthYear: memberData.birthYear || new Date().getFullYear().toString(),
      deathYear: memberData.deathYear || null,
      birthPlace: memberData.birthPlace || '',
      occupation: memberData.occupation || '',
      avatar: memberData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: memberData.bio || 'A valued member of the family lineage.',
      generation: memberData.generation || 4,
      branch: memberData.branch || 'descendant',
      vitalStats: memberData.vitalStats || {
        birthDate: memberData.birthYear || '1990',
        location: memberData.birthPlace || 'USA'
      },
      timeline: memberData.timeline || [
        { year: memberData.birthYear || '1990', title: 'Birth', description: 'Born into the family.', type: 'birth' }
      ]
    };

    const updatedMembers = [...members, newMember];
    let updatedRelationships = [...relationships];

    if (relationship && relationship.targetId) {
      updatedRelationships.push({
        id: `rel-${uuidv4().slice(0, 8)}`,
        from: relationship.type === 'child' ? relationship.targetId : newId,
        to: relationship.type === 'child' ? newId : relationship.targetId,
        type: relationship.type === 'spouse' ? 'marriage' : (relationship.type === 'sibling' ? 'sibling' : 'parent-child')
      });
    }

    setMembers(updatedMembers);
    setRelationships(updatedRelationships);
    setSelectedMemberId(newId);
    return newId;
  };

  // CRUD: Update Member
  const updateMember = (id, updatedFields) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  // CRUD: Delete Member
  const deleteMember = (id) => {
    if (members.length <= 1) {
      alert('Cannot delete the last remaining family member.');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    setRelationships(prev => prev.filter(r => r.from !== id && r.to !== id));
    if (selectedMemberId === id) {
      const remaining = members.filter(m => m.id !== id);
      setSelectedMemberId(remaining[0]?.id || null);
    }
    if (focusMemberId === id) {
      const remaining = members.filter(m => m.id !== id);
      setFocusMemberId(remaining[0]?.id || null);
    }
  };

  // Add Relationship
  const addRelationship = (from, to, type) => {
    if (relationships.some(r => r.from === from && r.to === to && r.type === type)) return;
    const newRel = {
      id: `rel-${uuidv4().slice(0, 8)}`,
      from,
      to,
      type
    };
    setRelationships(prev => [...prev, newRel]);
  };

  // Reset to Factory Default Data
  const resetToDefaultData = () => {
    if (window.confirm('Reset all family tree data to original Family Atlas sample dataset?')) {
      localStorage.removeItem('familyAtlas_members_v2');
      localStorage.removeItem('familyAtlas_relationships_v2');
      setMembers(INITIAL_MEMBERS);
      setRelationships(INITIAL_RELATIONSHIPS);
      setFocusMemberId('sarah-johnson-1891');
      setSelectedMemberId('sarah-johnson-1891');
      setTransform({ x: 0, y: 0, k: 0.92 });
    }
  };

  // Export JSON
  const exportDataJSON = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      focusMemberId,
      members,
      relationships
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family_atlas_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.members)) {
        setMembers(parsed.members);
        if (Array.isArray(parsed.relationships)) setRelationships(parsed.relationships);
        if (parsed.focusMemberId) setFocusMemberId(parsed.focusMemberId);
        alert('Family tree imported successfully!');
      } else {
        alert('Invalid family tree JSON structure.');
      }
    } catch (e) {
      alert('Failed to parse JSON file: ' + e.message);
    }
  };

  // Find relationships for current selected member
  const getMemberRelations = (memberId) => {
    if (!memberId) return { parents: [], spouses: [], siblings: [], children: [] };
    
    // Parents: relationships where 'from' is parent and 'to' is memberId with parent-child
    const parents = relationships
      .filter(r => r.to === memberId && (r.type === 'parent-child' || r.type === 'parent'))
      .map(r => getMember(r.from))
      .filter(Boolean);

    // Children: relationships where 'from' is memberId and 'to' is child with parent-child
    const children = relationships
      .filter(r => r.from === memberId && (r.type === 'parent-child' || r.type === 'parent'))
      .map(r => getMember(r.to))
      .filter(Boolean);

    // Spouses: marriage relationships
    const spouses = relationships
      .filter(r => (r.from === memberId || r.to === memberId) && (r.type === 'marriage' || r.type === 'partner'))
      .map(r => getMember(r.from === memberId ? r.to : r.from))
      .filter(Boolean);

    // Siblings: direct sibling links or sharing same parents
    const directSiblings = relationships
      .filter(r => (r.from === memberId || r.to === memberId) && r.type === 'sibling')
      .map(r => getMember(r.from === memberId ? r.to : r.from))
      .filter(Boolean);

    const parentIds = new Set(parents.map(p => p.id));
    const sharedParentSiblings = relationships
      .filter(r => parentIds.has(r.from) && r.to !== memberId && (r.type === 'parent-child' || r.type === 'parent'))
      .map(r => getMember(r.to))
      .filter(Boolean);

    const uniqueSiblings = Array.from(new Set([...directSiblings, ...sharedParentSiblings].map(s => s.id)))
      .map(id => getMember(id))
      .filter(Boolean);

    return { parents, spouses, siblings: uniqueSiblings, children };
  };

  return (
    <FamilyContext.Provider value={{
      members,
      relationships,
      layout,
      focusMemberId,
      setFocusPerson,
      selectedMemberId,
      selectMember,
      selectedMember: getMember(selectedMemberId) || members[0],
      hoveredMemberId,
      setHoveredMemberId,
      searchQuery,
      setSearchQuery,
      activeBranchFilter,
      setActiveBranchFilter,
      transform,
      setTransform,
      activeModal,
      setActiveModal,
      modalTargetMemberId,
      setModalTargetMemberId,
      addMember,
      updateMember,
      deleteMember,
      addRelationship,
      resetToDefaultData,
      exportDataJSON,
      importDataJSON,
      getMember,
      getMemberRelations
    }}>
      {children}
    </FamilyContext.Provider>
  );
};
