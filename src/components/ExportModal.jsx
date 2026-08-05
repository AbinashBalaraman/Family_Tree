import React, { useState } from 'react';
import { X, Download, Upload, FileText, Code, Check } from 'lucide-react';
import { exportToGEDCOM, parseGEDCOM } from '../utils/gedcom';

export default function ExportModal({ members, onClose, onImportMembers }) {
  const [activeTab, setActiveTab] = useState('export');
  const [importText, setImportText] = useState('');
  const [importType, setImportType] = useState('gedcom');
  const [copySuccess, setCopySuccess] = useState(false);

  // Downloads
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "family_tree_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadGEDCOM = () => {
    const gedText = exportToGEDCOM(members);
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(gedText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "family_tree.ged");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyGEDCOMToClipboard = () => {
    const gedText = exportToGEDCOM(members);
    navigator.clipboard.writeText(gedText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;

    try {
      if (importType === 'json') {
        const parsed = JSON.parse(importText);
        if (Array.isArray(parsed)) {
          onImportMembers(parsed);
          onClose();
        }
      } else {
        const parsed = parseGEDCOM(importText);
        if (parsed && parsed.length > 0) {
          onImportMembers(parsed);
          onClose();
        }
      }
    } catch (err) {
      alert("Invalid format! Please check your file content.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportText(text);
      if (file.name.endsWith('.json')) {
        setImportType('json');
      } else {
        setImportType('gedcom');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-[var(--border-color)] shadow-2xl p-6 relative">
        
        <button onClick={onClose} className="btn-icon absolute top-5 right-5 z-10">
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
          <Download className="w-5 h-5 text-[var(--accent-primary)]" />
          Export & Import Family Data
        </h2>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[var(--bg-surface-elevated)] p-1 rounded-xl mb-6 border border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('export')}
            className={`flex-1 btn border-0 text-xs justify-center py-2 ${activeTab === 'export' ? 'btn-primary' : 'text-[var(--text-secondary)]'}`}
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={`flex-1 btn border-0 text-xs justify-center py-2 ${activeTab === 'import' ? 'btn-primary' : 'text-[var(--text-secondary)]'}`}
          >
            <Upload className="w-4 h-4" />
            Import File
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4">
            
            {/* GEDCOM Download */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs">
                  .GED
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">GEDCOM 5.5 Standard Export</h4>
                  <p className="text-xs text-[var(--text-muted)]">Compatible with Ancestry, MyHeritage, and Gramps</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyGEDCOMToClipboard} className="btn btn-secondary text-xs">
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : 'Copy'}
                </button>
                <button onClick={downloadGEDCOM} className="btn btn-primary text-xs">
                  Download .ged
                </button>
              </div>
            </div>

            {/* JSON Download */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 font-bold text-xs">
                  .JSON
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">Full Kinship JSON Backup</h4>
                  <p className="text-xs text-[var(--text-muted)]">Preserves custom avatars, photos, and formatted bios</p>
                </div>
              </div>
              <button onClick={downloadJSON} className="btn btn-primary text-xs">
                Download .json
              </button>
            </div>

          </div>
        ) : (
          <form onSubmit={handleImportSubmit} className="space-y-4">
            
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-2">Upload GEDCOM or JSON File:</label>
              <input 
                type="file" 
                accept=".ged,.json"
                onChange={handleFileUpload}
                className="w-full text-xs text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">Or Paste Text Content:</label>
              <textarea
                rows={6}
                placeholder="Paste GEDCOM string or JSON structure here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-xs">
                Import & Overwrite Tree
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
