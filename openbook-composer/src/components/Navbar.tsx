import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { downloadTypstSource, downloadDocumentIR } from '../renderer/typst-compiler';
import {
  BookOpen,
  FileCode,
  Download,
  RotateCcw,
  RotateCw,
  Settings,
  Sparkles,
  Layers,
  FileText,
  Palette
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenTemplates }) => {
  const {
    document,
    setLayoutMode,
    activeTab,
    setActiveTab,
    undo,
    redo,
    historyIndex,
    history
  } = useComposerStore();
  const layoutMode = document.layoutMode;

  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="no-print h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none">
      {/* Brand logo & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-sm text-slate-100 tracking-tight">OpenBook Composer</h1>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">{document.document.title}</p>
        </div>
      </div>

      {/* Center Tabs: Live Page Studio / Block Form */}
      <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 space-x-1">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'studio'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Live Page Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeTab === 'editor'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Block Form</span>
        </button>
      </div>

      {/* Right Controls: Layout Mode selector, History, Settings, Export */}
      <div className="flex items-center space-x-3">
        {/* Book Word Count & Reading Time Analytics */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>
            📚 {document.chapters.reduce((acc, ch) => acc + ch.blocks.length, 0)} blocks
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-semibold">
            ⏱️ ~{Math.max(1, Math.ceil(document.chapters.reduce((acc, ch) => acc + ch.blocks.reduce((bAcc, b) => bAcc + ((b as any).text?.length || 50), 0), 0) / 800))} min read
          </span>
        </div>

        {/* Layout Mode Selector */}
        <div className="flex items-center bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 space-x-2">
          <span className="text-[11px] text-slate-400 font-medium">Layout:</span>
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as any)}
            className="bg-transparent text-xs text-sky-400 font-mono font-semibold focus:outline-none cursor-pointer"
          >
            <option value="FLOW" className="bg-slate-900 text-slate-200">FLOW (Auto Pagination)</option>
            <option value="SMART" className="bg-slate-900 text-slate-200">SMART (AI Grouping)</option>
            <option value="FIXED" className="bg-slate-900 text-slate-200">FIXED (Target Pages)</option>
          </select>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Templates & Themes Picker Trigger */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-medium text-xs shadow-sm transition-all"
          title="Browse & Apply Book Genre Templates & Themes"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>Templates</span>
        </button>

        {/* Book Settings Modal Trigger */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Book Page & Layout Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Document</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  downloadTypstSource(document, `${document.document.id}.typ`);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
              >
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Export Typst (.typ)</span>
              </button>

              <button
                onClick={() => {
                  downloadDocumentIR(document, `${document.document.id}_IR.json`);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Export JSON IR (.json)</span>
              </button>

              <div className="border-t border-slate-800 my-1"></div>

              <button
                onClick={() => {
                  window.print();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
