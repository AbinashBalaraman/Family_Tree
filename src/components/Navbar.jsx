import React from 'react';
import { 
  GitFork, 
  Network, 
  Users, 
  Clock, 
  BarChart3, 
  Download, 
  Plus, 
  Search, 
  Github, 
  Sun, 
  Moon, 
  RotateCcw
} from 'lucide-react';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  searchTerm, 
  setSearchTerm, 
  theme, 
  setTheme, 
  onAddMember, 
  onOpenExport, 
  onOpenGitHub, 
  onResetData 
}) {
  return (
    <header className="glass-panel sticky top-0 z-40 px-6 py-3 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl">
            🌳
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-[var(--text-primary)]">
              Kinship Studio
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Interactive Family Genealogy Suite
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] p-1 rounded-xl border border-[var(--border-color)]">
          <button 
            onClick={() => setActiveView('tree')}
            className={`btn border-0 text-xs py-1.5 px-3 rounded-lg ${activeView === 'tree' ? 'btn-primary' : 'btn-secondary text-[var(--text-secondary)]'}`}
          >
            <Network className="w-4 h-4" />
            Tree Canvas
          </button>

          <button 
            onClick={() => setActiveView('pedigree')}
            className={`btn border-0 text-xs py-1.5 px-3 rounded-lg ${activeView === 'pedigree' ? 'btn-primary' : 'btn-secondary text-[var(--text-secondary)]'}`}
          >
            <GitFork className="w-4 h-4" />
            Pedigree
          </button>

          <button 
            onClick={() => setActiveView('directory')}
            className={`btn border-0 text-xs py-1.5 px-3 rounded-lg ${activeView === 'directory' ? 'btn-primary' : 'btn-secondary text-[var(--text-secondary)]'}`}
          >
            <Users className="w-4 h-4" />
            Directory
          </button>

          <button 
            onClick={() => setActiveView('timeline')}
            className={`btn border-0 text-xs py-1.5 px-3 rounded-lg ${activeView === 'timeline' ? 'btn-primary' : 'btn-secondary text-[var(--text-secondary)]'}`}
          >
            <Clock className="w-4 h-4" />
            Timeline
          </button>

          <button 
            onClick={() => setActiveView('analytics')}
            className={`btn border-0 text-xs py-1.5 px-3 rounded-lg ${activeView === 'analytics' ? 'btn-primary' : 'btn-secondary text-[var(--text-secondary)]'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search member or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] w-48 transition-all focus:w-60"
            />
          </div>

          {/* Add Member Button */}
          <button onClick={onAddMember} className="btn btn-primary text-xs py-1.5">
            <Plus className="w-4 h-4" />
            Add Member
          </button>

          {/* Export / Import Button */}
          <button onClick={onOpenExport} className="btn btn-secondary text-xs py-1.5" title="Export JSON or GEDCOM">
            <Download className="w-4 h-4" />
            Export/Import
          </button>

          {/* GitHub Sync */}
          <button onClick={onOpenGitHub} className="btn btn-secondary text-xs py-1.5 gap-1.5" title="GitHub Remote Setup">
            <Github className="w-4 h-4" />
            GitHub
          </button>

          {/* Reset Preset */}
          <button onClick={onResetData} className="btn-icon" title="Reset Sample Tree Data">
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-icon" 
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

        </div>

      </div>
    </header>
  );
}
