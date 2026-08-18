import React from 'react';
import { MindMapNode } from '../document/types';

interface MindMapViewerProps {
  rootNode: MindMapNode;
  title: string;
  onUpdateTitle?: (newTitle: string) => void;
}

export const MindMapViewer: React.FC<MindMapViewerProps> = ({ rootNode, title, onUpdateTitle }) => {
  const children = rootNode?.children || [
    { id: 'n1', label: 'Art 14-18: Equality' },
    { id: 'n2', label: 'Art 19-22: Freedom' },
    { id: 'n3', label: 'Art 32: Writs' },
  ];

  return (
    <div className="my-2 p-3.5 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-300 rounded-xl text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-200 pb-2">
        <div className="flex items-center space-x-1.5 font-bold text-sky-900 text-xs">
          <span>🌳 Concept MindMap:</span>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdateTitle?.(e.target.value)}
            className="bg-transparent focus:outline-none focus:bg-sky-200/50 px-1 rounded font-bold text-sky-900"
          />
        </div>
        <span className="text-[9px] uppercase tracking-wider font-mono text-sky-700 bg-sky-200 px-1.5 py-0.5 rounded">
          Interactive Concept Tree
        </span>
      </div>

      {/* Concept Tree Graph */}
      <div className="flex flex-col items-center space-y-3 py-1">
        {/* Root Node */}
        <div className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md border border-sky-700 tracking-wide text-center min-w-[140px]">
          {rootNode?.label || title || 'Core Concept'}
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-4 bg-sky-400"></div>

        {/* Children Nodes Grid */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {children.map((child, idx) => (
            <div
              key={child.id || idx}
              className="p-2 bg-white border border-sky-300 rounded-lg shadow-sm text-center font-medium text-slate-800 text-[11px] hover:border-sky-500 transition-all"
            >
              {child.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
