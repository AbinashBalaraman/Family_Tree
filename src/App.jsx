import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TreeView from './components/TreeView';
import PedigreeView from './components/PedigreeView';
import MemberDirectory from './components/MemberDirectory';
import TimelineView from './components/TimelineView';
import AnalyticsView from './components/AnalyticsView';
import MemberModal from './components/MemberModal';
import ExportModal from './components/ExportModal';
import GitHubModal from './components/GitHubModal';
import { INITIAL_FAMILY_DATA } from './data/sampleTree';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeView, setActiveView] = useState('tree'); // 'tree' | 'pedigree' | 'directory' | 'timeline' | 'analytics'
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('kinship_family_members_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_FAMILY_DATA;
  });

  const [selectedMemberId, setSelectedMemberId] = useState('mem-6'); // Default selected (Julian)
  const [modalState, setModalState] = useState({
    member: null, // null = closed, {} = add new, memberObj = edit
    exportOpen: false,
    githubOpen: false
  });

  // Sync Theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kinship_family_members_v2', JSON.stringify(members));
  }, [members]);

  // Handlers
  const handleSaveMember = (memberData) => {
    const exists = members.some(m => m.id === memberData.id);
    let updated;
    if (exists) {
      updated = members.map(m => m.id === memberData.id ? memberData : m);
    } else {
      updated = [...members, memberData];
    }
    setMembers(updated);
    setSelectedMemberId(memberData.id);
    setModalState(prev => ({ ...prev, member: null }));
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Are you sure you want to delete this family member record?")) {
      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      if (selectedMemberId === id) {
        setSelectedMemberId(updated[0]?.id || null);
      }
    }
  };

  const handleAddRelative = (relativeMember) => {
    const newGen = relativeMember ? (relativeMember.generation || 1) + 1 : 1;
    setModalState(prev => ({
      ...prev,
      member: {
        id: `mem-${Date.now()}`,
        firstName: '',
        lastName: relativeMember ? relativeMember.lastName : '',
        gender: 'male',
        generation: newGen,
        fatherId: relativeMember && relativeMember.gender === 'male' ? relativeMember.id : null,
        motherId: relativeMember && relativeMember.gender === 'female' ? relativeMember.id : null,
        birthDate: '',
        birthPlace: '',
        occupation: '',
        bio: '',
        avatar: '',
        spouseIds: []
      }
    }));
  };

  const handleResetData = () => {
    if (window.confirm("Reset to default sample Rutherford family tree dataset?")) {
      setMembers(INITIAL_FAMILY_DATA);
      setSelectedMemberId('mem-6');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Top Navigation */}
      <Navbar 
        activeView={activeView}
        setActiveView={setActiveView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        setTheme={setTheme}
        onAddMember={() => setModalState(prev => ({ ...prev, member: {} }))}
        onOpenExport={() => setModalState(prev => ({ ...prev, exportOpen: true }))}
        onOpenGitHub={() => setModalState(prev => ({ ...prev, githubOpen: true }))}
        onResetData={handleResetData}
      />

      {/* Main View Area */}
      <main className="w-full">
        {activeView === 'tree' && (
          <TreeView 
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onEditMember={(m) => setModalState(prev => ({ ...prev, member: m }))}
            onAddRelative={handleAddRelative}
          />
        )}

        {activeView === 'pedigree' && (
          <PedigreeView 
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onEditMember={(m) => setModalState(prev => ({ ...prev, member: m }))}
          />
        )}

        {activeView === 'directory' && (
          <MemberDirectory 
            members={members}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectMember={(id) => {
              setSelectedMemberId(id);
              setActiveView('tree');
            }}
            onEditMember={(m) => setModalState(prev => ({ ...prev, member: m }))}
            onAddMember={() => setModalState(prev => ({ ...prev, member: {} }))}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeView === 'timeline' && (
          <TimelineView 
            members={members}
            onSelectMember={(id) => {
              setSelectedMemberId(id);
              setActiveView('tree');
            }}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsView members={members} />
        )}
      </main>

      {/* Modals */}
      {modalState.member && (
        <MemberModal 
          member={modalState.member.id ? modalState.member : null}
          members={members}
          onClose={() => setModalState(prev => ({ ...prev, member: null }))}
          onSave={handleSaveMember}
        />
      )}

      {modalState.exportOpen && (
        <ExportModal 
          members={members}
          onClose={() => setModalState(prev => ({ ...prev, exportOpen: false }))}
          onImportMembers={(imported) => setMembers(imported)}
        />
      )}

      {modalState.githubOpen && (
        <GitHubModal 
          onClose={() => setModalState(prev => ({ ...prev, githubOpen: false }))}
        />
      )}

    </div>
  );
}
