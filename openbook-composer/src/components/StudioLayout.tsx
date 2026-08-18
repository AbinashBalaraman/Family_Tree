import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LivePageStudio } from './LivePageStudio';
import { BlockEditor } from '../editor/BlockEditor';
import { TypstCodeViewer } from './TypstCodeViewer';
import { AiAssistantPanel } from './AiAssistantPanel';
import { BookSettingsModal } from './BookSettingsModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import { PrintDocument } from './PrintDocument';

export const StudioLayout: React.FC = () => {
  const { activeTab } = useComposerStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  return (
    <>
      {/* Screen Studio View */}
      <div className="no-print flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
        {/* Top Navbar */}
        <Navbar
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
        />

        {/* Main Studio Body: 3-Panel Studio Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Chapter Tree & Document Outline */}
          <Sidebar />

          {/* Center Panel: Live WYSIWYG Page Studio / Block Form / Typst AST Code */}
          <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {activeTab === 'studio' && <LivePageStudio />}
            {activeTab === 'editor' && <BlockEditor />}
            {activeTab === 'typst' && <TypstCodeViewer />}
          </main>

          {/* Right Panel: AI Assistant & Operations Console */}
          <AiAssistantPanel />
        </div>

        {/* Book Settings & Template Modals */}
        <BookSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <TemplatePickerModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} />
      </div>

      {/* Printable Document View (Active during window.print()) */}
      <PrintDocument />
    </>
  );
};
