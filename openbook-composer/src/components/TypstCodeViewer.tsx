import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { Copy, Check, FileCode, Download } from 'lucide-react';
import { downloadTypstSource } from '../renderer/typst-compiler';

export const TypstCodeViewer: React.FC = () => {
  const { typstCode, document } = useComposerStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(typstCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="no-print flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 select-none">
      {/* Header Bar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-slate-200">document.typ</span>
          <span className="text-[10px] text-slate-500 font-mono">({typstCode.length} characters)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => downloadTypstSource(document, `${document.document.id}.typ`)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .typ</span>
          </button>
        </div>
      </div>

      {/* Typst Code Area */}
      <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-sky-300 leading-relaxed">
        <pre className="whitespace-pre-wrap selection:bg-sky-500/30 selection:text-white">
          {typstCode}
        </pre>
      </div>
    </div>
  );
};
