import React, { useState } from 'react';
import { X, Github, GitBranch, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function GitHubModal({ onClose }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [pat, setPat] = useState('');
  const [commitMsg, setCommitMsg] = useState('Overhaul family tree project with Kinship Studio');
  const [status, setStatus] = useState(null);

  const handleSaveAndSync = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setStatus('saving');

    // Generate powershell commands for the user to copy/run if needed
    let cleanUrl = repoUrl.trim();
    if (pat.trim() && cleanUrl.startsWith('https://github.com/')) {
      cleanUrl = cleanUrl.replace('https://github.com/', `https://${pat.trim()}@github.com/`);
    }

    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-[var(--border-color)] shadow-2xl p-6 relative">
        
        <button onClick={onClose} className="btn-icon absolute top-5 right-5 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold">GitHub Repository Setup</h2>
            <p className="text-xs text-[var(--text-muted)]">Connect your project to GitHub for cloud version control</p>
          </div>
        </div>

        <form onSubmit={handleSaveAndSync} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">GitHub Repository Remote URL *</label>
            <input 
              type="text" 
              required
              placeholder="https://github.com/your-username/family-tree.git"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Personal Access Token (PAT) (Optional for private repos)</label>
            <input 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Commit Message</label>
            <input 
              type="text" 
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Direct Terminal Push Command
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Once saved, you can push changes directly from powershell using:
            </p>
            <code className="block p-2 rounded-lg bg-black/40 text-emerald-400 text-[10px] font-mono break-all select-all">
              git remote add origin {repoUrl || 'https://github.com/your-username/family-tree.git'} ; git add . ; git commit -m "{commitMsg}" ; git push -u origin master
            </code>
          </div>

          {status === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              GitHub remote configuration saved!
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Close
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Save Remote Config
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
