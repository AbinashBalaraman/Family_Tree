import React from 'react';
import { FamilyProvider, useFamily } from './context/FamilyContext';
import TopNavbar from './components/TopNavbar';
import LeftToolbar from './components/LeftToolbar';
import FamilyCanvas from './components/FamilyCanvas';
import MemberDetailsSidebar from './components/MemberDetailsSidebar';
import MemberModal from './components/MemberModal';
import AddMemberModal from './components/AddMemberModal';
import ChroniclesModal from './components/ChroniclesModal';
import AIStorytellerModal from './components/AIStorytellerModal';
import LegendPanel from './components/LegendPanel';
import './App.css';

function MainAtlasLayout() {
  const { selectedMemberId } = useFamily();

  return (
    <div className="atlas-app-container">
      {/* Top Header Navbar */}
      <TopNavbar />

      {/* Main Interactive Stage */}
      <div className="atlas-main-stage">
        {/* Left Floating Navigation Toolbar */}
        <LeftToolbar />

        {/* Central Radial Generational Canvas */}
        <FamilyCanvas />

        {/* Right Flyout Details Panel (Active when member selected) */}
        {selectedMemberId && <MemberDetailsSidebar />}

        {/* Bottom Right Tools & Legend */}
        <LegendPanel />
      </div>

      {/* Modals & Dialogs */}
      <MemberModal />
      <AddMemberModal />
      <ChroniclesModal />
      <AIStorytellerModal />
    </div>
  );
}

export default function App() {
  return <MainAtlasLayout />;
}
