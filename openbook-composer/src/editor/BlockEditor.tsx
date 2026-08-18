import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { MathEquation } from '../components/MathEquation';
import {
  Block,
  HeadingBlock,
  ParagraphBlock,
  TableBlock,
  CalloutBlock,
  EquationBlock,
  MCQBlock,
  PYQBlock,
  QuickRevisionBlock,
  CalloutVariant
} from '../document/types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Sparkles,
  Heading,
  AlignLeft,
  Table,
  HelpCircle,
  AlertTriangle,
  Code,
  CheckCircle2
} from 'lucide-react';

export const BlockEditor: React.FC = () => {
  const {
    document,
    activeChapterId,
    selectedBlockId,
    setSelectedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    updateBookMetadata
  } = useComposerStore();

  const activeChapter = document.chapters.find((ch) => ch.id === activeChapterId) || document.chapters[0];
  const [showAddMenu, setShowAddMenu] = useState(false);

  if (activeChapterId === 'cover') {
    return (
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 p-6 overflow-y-auto select-none">
        <div className="max-w-3xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Cover Page & Manuscript Properties</h2>
              <p className="text-xs text-slate-400">Edit front cover title, subtitle, author, and edition metadata</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Book Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Book Title:</label>
              <input
                type="text"
                value={document.document.title}
                onChange={(e) => updateBookMetadata({ title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 font-semibold text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Book Subtitle */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Subtitle / Tagline:</label>
              <input
                type="text"
                value={document.document.subtitle || ''}
                onChange={(e) => updateBookMetadata({ subtitle: e.target.value })}
                placeholder="e.g. A Comprehensive Guide for Professionals"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs italic focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Author Name & Edition Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Author Name / Publisher:</label>
                <input
                  type="text"
                  value={document.document.author}
                  onChange={(e) => updateBookMetadata({ author: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Edition (e.g. 2026 Edition):</label>
                <input
                  type="text"
                  value={document.document.edition || ''}
                  onChange={(e) => updateBookMetadata({ edition: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Version */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Version / Release:</label>
              <input
                type="text"
                value={document.document.version || ''}
                onChange={(e) => updateBookMetadata({ version: e.target.value })}
                placeholder="1.0.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-300 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeChapter) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Select or create a chapter to edit content.
      </div>
    );
  }

  const handleCreateBlock = (type: Block['type']) => {
    const id = 'b_' + Math.random().toString(36).substr(2, 9);
    let newBlock: Block;

    switch (type) {
      case 'heading':
        newBlock = { id, type: 'heading', level: 2, text: 'New Subheading' };
        break;
      case 'paragraph':
        newBlock = { id, type: 'paragraph', text: 'Type paragraph content here...' };
        break;
      case 'table':
        newBlock = {
          id,
          type: 'table',
          columns: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            ['Data 1', 'Data 2', 'Data 3'],
            ['Data 4', 'Data 5', 'Data 6'],
          ],
          caption: 'Sample Table',
        };
        break;
      case 'callout':
        newBlock = {
          id,
          type: 'callout',
          variant: 'exam-tip',
          title: 'Exam Tip',
          text: 'Important concept for exams.',
        };
        break;
      case 'equation':
        newBlock = { id, type: 'equation', expression: 'E = mc^2' };
        break;
      case 'mcq':
        newBlock = {
          id,
          type: 'mcq',
          question: 'Sample Multiple Choice Question?',
          options: [
            { id: 'opt_1', label: 'A', text: 'Option A' },
            { id: 'opt_2', label: 'B', text: 'Option B', isCorrect: true },
            { id: 'opt_3', label: 'C', text: 'Option C' },
            { id: 'opt_4', label: 'D', text: 'Option D' },
          ],
          explanation: 'Sample explanation for correct answer B.',
        };
        break;
      case 'pyq':
        newBlock = {
          id,
          type: 'pyq',
          examName: 'UPSC 2023',
          question: 'Previous Year Question statement?',
          answerText: 'Detailed answer explanation...',
        };
        break;
      case 'quick_revision':
        newBlock = {
          id,
          type: 'quick_revision',
          title: 'Quick Revision',
          bulletPoints: ['Point 1: Key fact', 'Point 2: Key formula'],
        };
        break;
      default:
        newBlock = { id, type: 'paragraph', text: 'Content block' };
    }

    addBlock(activeChapter.id, newBlock);
    setShowAddMenu(false);
  };

  return (
    <div className="no-print flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto">
      {/* Chapter Title Banner */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>{activeChapter.title}</span>
        </h2>
        {activeChapter.subtitle && (
          <p className="text-xs text-slate-400 mt-1">{activeChapter.subtitle}</p>
        )}
      </div>

      {/* Block Items List */}
      {activeChapter.blocks.map((block, idx) => {
        const isSelected = block.id === selectedBlockId;
        return (
          <div
            key={block.id}
            onClick={() => setSelectedBlock(block.id)}
            className={`group relative rounded-xl border transition-all p-4 ${
              isSelected
                ? 'bg-slate-900/90 border-sky-500 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Block Controls Toolbar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  {block.type}
                </span>

                {/* Constraint Badges */}
                {block.layout?.keep_with_next && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>keep with next</span>
                  </span>
                )}
                {block.layout?.keep_together && (
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>keep together</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlock(block.id, 'up');
                  }}
                  disabled={idx === 0}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlock(block.id, 'down');
                  }}
                  disabled={idx === activeChapter.blocks.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  title="Delete Block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Block Body Content Renderer */}
            <BlockContentEditor block={block} onUpdate={(changes) => updateBlock(block.id, changes)} />
          </div>
        );
      })}

      {/* Add New Block Toolbar Button */}
      <div className="relative pt-4">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full border-2 border-dashed border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/5 rounded-xl py-3 text-slate-400 hover:text-sky-400 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Block to Chapter</span>
        </button>

        {showAddMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl z-40 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleCreateBlock('heading')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <Heading className="w-4 h-4 text-sky-400" />
              <span>Heading</span>
            </button>

            <button
              onClick={() => handleCreateBlock('paragraph')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <AlignLeft className="w-4 h-4 text-emerald-400" />
              <span>Paragraph</span>
            </button>

            <button
              onClick={() => handleCreateBlock('table')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <Table className="w-4 h-4 text-indigo-400" />
              <span>Table</span>
            </button>

            <button
              onClick={() => handleCreateBlock('callout')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Callout Box</span>
            </button>

            <button
              onClick={() => handleCreateBlock('equation')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <Code className="w-4 h-4 text-purple-400" />
              <span>Equation</span>
            </button>

            <button
              onClick={() => handleCreateBlock('mcq')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>MCQ Question</span>
            </button>

            <button
              onClick={() => handleCreateBlock('pyq')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>PYQ Box</span>
            </button>

            <button
              onClick={() => handleCreateBlock('quick_revision')}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600/20 text-slate-200 hover:text-sky-300 transition-all text-left"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Quick Revision</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface BlockContentEditorProps {
  block: Block;
  onUpdate: (changes: Partial<Block>) => void;
}

const BlockContentEditor: React.FC<BlockContentEditorProps> = ({ block, onUpdate }) => {
  switch (block.type) {
    case 'heading': {
      const b = block as HeadingBlock;
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-slate-400 font-medium">Level:</label>
            <select
              value={b.level}
              onChange={(e) => onUpdate({ level: Number(e.target.value) as any })}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-sky-400 font-mono"
            >
              <option value={1}>H1 Title</option>
              <option value={2}>H2 Subheading</option>
              <option value={3}>H3 Section</option>
            </select>
          </div>
          <input
            type="text"
            value={b.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
      );
    }

    case 'paragraph': {
      const b = block as ParagraphBlock;
      return (
        <textarea
          value={b.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-sky-500"
        />
      );
    }

    case 'callout': {
      const b = block as CalloutBlock;
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-slate-400 font-medium">Variant:</label>
            <select
              value={b.variant}
              onChange={(e) => onUpdate({ variant: e.target.value as CalloutVariant, title: e.target.value.replace('-', ' ').toUpperCase() })}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-amber-400 font-mono capitalize"
            >
              <option value="exam-tip">Exam Tip</option>
              <option value="important">Important</option>
              <option value="remember">Remember</option>
              <option value="common-mistake">Common Mistake</option>
              <option value="shortcut">Shortcut / Formula</option>
            </select>
          </div>
          <input
            type="text"
            value={b.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Title"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-sky-500"
          />
          <textarea
            value={b.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            placeholder="Callout text..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>
      );
    }

    case 'table': {
      const b = block as TableBlock;
      return (
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-slate-400 font-medium">Columns (comma separated):</p>
          <input
            type="text"
            value={b.columns.join(', ')}
            onChange={(e) => onUpdate({ columns: e.target.value.split(',').map((s) => s.trim()) })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          />
          <p className="text-[11px] text-slate-400 font-medium mt-2">Data Rows ({b.rows.length} rows):</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {b.rows.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center space-x-2">
                <span className="font-mono text-[10px] text-slate-500">R{rIdx + 1}:</span>
                <input
                  type="text"
                  value={row.join(' | ')}
                  onChange={(e) => {
                    const newRows = [...b.rows];
                    newRows[rIdx] = e.target.value.split('|').map((s) => s.trim());
                    onUpdate({ rows: newRows });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'equation': {
      const b = block as EquationBlock;
      return (
        <div className="space-y-2">
          <div className="p-2 bg-slate-950 border border-slate-800 rounded text-center">
            <MathEquation expression={b.expression} className="text-sm text-purple-300 font-bold" />
          </div>
          <label className="text-[11px] text-slate-400 font-medium">Formula Expression (LaTeX / Typst):</label>
          <input
            type="text"
            value={b.expression}
            onChange={(e) => onUpdate({ expression: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
          />
        </div>
      );
    }

    case 'mcq': {
      const b = block as MCQBlock;
      return (
        <div className="space-y-2 text-xs">
          <label className="text-[11px] text-slate-400 font-medium">Question Text:</label>
          <textarea
            value={b.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          />
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 font-medium">Options:</p>
            {b.options.map((opt, optIdx) => (
              <div key={opt.id} className="flex items-center space-x-2">
                <span className="font-bold text-sky-400 w-4">({opt.label})</span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => {
                    const newOpts = [...b.options];
                    newOpts[optIdx].text = e.target.value;
                    onUpdate({ options: newOpts });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
                />
                <label className="flex items-center space-x-1 cursor-pointer text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect || false}
                    onChange={(e) => {
                      const newOpts = b.options.map((o, idx) => ({
                        ...o,
                        isCorrect: idx === optIdx ? e.target.checked : false,
                      }));
                      onUpdate({ options: newOpts });
                    }}
                    className="rounded bg-slate-950 border-slate-800 text-sky-500"
                  />
                  <span>Correct</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'pyq': {
      const b = block as PYQBlock;
      return (
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <label className="text-[11px] text-slate-400 font-medium">Exam Name:</label>
            <input
              type="text"
              value={b.examName}
              onChange={(e) => onUpdate({ examName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-teal-300 font-medium"
            />
          </div>
          <input
            type="text"
            value={b.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="PYQ Question"
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100"
          />
          <textarea
            value={b.answerText}
            onChange={(e) => onUpdate({ answerText: e.target.value })}
            rows={2}
            placeholder="Answer explanation..."
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300"
          />
        </div>
      );
    }

    case 'quick_revision': {
      const b = block as QuickRevisionBlock;
      return (
        <div className="space-y-2 text-xs">
          <input
            type="text"
            value={b.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-bold text-rose-300"
          />
          <textarea
            value={b.bulletPoints.join('\n')}
            onChange={(e) => onUpdate({ bulletPoints: e.target.value.split('\n') })}
            rows={3}
            placeholder="One bullet point per line"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300"
          />
        </div>
      );
    }

    default:
      return <div className="text-xs text-slate-400">Custom block editor</div>;
  }
};
