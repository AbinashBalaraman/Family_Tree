import React, { useState, useEffect } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { getTemplatePaperStyles } from '../document/templates';
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
  CalloutVariant,
  MindMapBlock,
  FootnoteBlock
} from '../document/types';
import { paginateBlocks } from '../document/pagination';
import { MathEquation } from './MathEquation';
import { MindMapViewer } from './MindMapViewer';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Scissors,
  Heading,
  AlignLeft,
  Table,
  HelpCircle,
  AlertTriangle,
  Code,
  CheckCircle2,
  Sparkles,
  Rows,
  Columns,
  Minus
} from 'lucide-react';

export const LivePageStudio: React.FC = () => {
  const {
    document,
    zoomLevel,
    setZoomLevel,
    activeChapterId,
    setActiveChapter,
    selectedBlockId,
    setSelectedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    activePageIndex,
    setActivePageIndex,
    updateBookMetadata,
    setBookPageConfig,
    setChapterHeaderFooter
  } = useComposerStore();

  const [headerScope, setHeaderScope] = useState<'chapter' | 'project'>('chapter');

  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(null);

  const pageConfig = document.document.page;

  // Aggregate document pages (Cover + TOC + Chapters)
  const totalPagesList: Array<{
    title: string;
    type: 'cover' | 'toc' | 'chapter';
    chapterId?: string;
    chapterIdx?: number;
    blocks?: Block[];
  }> = [];

  if (pageConfig.showCoverPage) {
    totalPagesList.push({ title: 'Cover Page', type: 'cover' });
  }

  if (pageConfig.includeTOC) {
    totalPagesList.push({ title: 'Table of Contents', type: 'toc' });
  }

  document.chapters.forEach((chapter, chIdx) => {
    const chapterPages = paginateBlocks(chapter.blocks);

    if (chapterPages.length === 0) {
      totalPagesList.push({
        title: `Chapter ${chIdx + 1}: ${chapter.title}`,
        type: 'chapter',
        chapterId: chapter.id,
        chapterIdx: chIdx,
        blocks: [],
      });
    } else {
      chapterPages.forEach((pageBlocks) => {
        totalPagesList.push({
          title: `Chapter ${chIdx + 1}: ${chapter.title}`,
          type: 'chapter',
          chapterId: chapter.id,
          chapterIdx: chIdx,
          blocks: pageBlocks,
        });
      });
    }
  });

  const currentPage = totalPagesList[activePageIndex] || totalPagesList[0];
  const totalPages = totalPagesList.length;

  useEffect(() => {
    if (selectedBlockId) {
      setTimeout(() => {
        const el = window.document.getElementById(`block-${selectedBlockId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedBlockId, activePageIndex]);

  const handleCreateBlockOnPage = (type: Block['type'], targetChapterId: string, afterBlockId?: string) => {
    const id = 'b_' + Math.random().toString(36).substr(2, 9);
    let newBlock: Block;

    switch (type) {
      case 'heading':
        newBlock = { id, type: 'heading', level: 2, text: 'New Section Heading' };
        break;
      case 'paragraph':
        newBlock = { id, type: 'paragraph', text: 'Type text directly on the page...' };
        break;
      case 'table':
        newBlock = {
          id,
          type: 'table',
          columns: ['Article', 'Right', 'Details'],
          rows: [
            ['14', 'Equality', 'Equality before law'],
            ['15', 'Non-discrimination', 'Prohibition of discrimination'],
          ],
          caption: 'Interactive Table',
        };
        break;
      case 'callout':
        newBlock = {
          id,
          type: 'callout',
          variant: 'exam-tip',
          title: 'EXAM TIP',
          text: 'Key point to remember for exams.',
        };
        break;
      case 'equation':
        newBlock = { id, type: 'equation', expression: '(A+B)^5 / (A-B)' };
        break;
      case 'mcq':
        newBlock = {
          id,
          type: 'mcq',
          question: 'Sample Question?',
          options: [
            { id: 'opt_1', label: 'A', text: 'Option A' },
            { id: 'opt_2', label: 'B', text: 'Option B', isCorrect: true },
          ],
          explanation: 'Explanation for answer B.',
        };
        break;
      case 'pyq':
        newBlock = {
          id,
          type: 'pyq',
          examName: 'UPSC 2024',
          question: 'Previous Year Question statement?',
          answerText: 'Answer explanation text...',
        };
        break;
      case 'quick_revision':
        newBlock = {
          id,
          type: 'quick_revision',
          title: 'Quick Revision',
          bulletPoints: ['Point 1: Key rule', 'Point 2: Key formula'],
        };
        break;
      case 'mindmap':
        newBlock = {
          id,
          type: 'mindmap',
          title: 'Constitutional Rights Concept Tree',
          rootNode: {
            id: 'r1',
            label: 'Part III: Fundamental Rights',
            children: [
              { id: 'c1', label: 'Right to Equality (14-18)' },
              { id: 'c2', label: 'Right to Freedom (19-22)' },
              { id: 'c3', label: 'Remedies (32)' },
            ],
          },
        };
        break;
      case 'footnote':
        newBlock = {
          id,
          type: 'footnote',
          number: 1,
          term: 'Landmark Case',
          citationText: 'Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225.',
        };
        break;
      default:
        newBlock = { id, type: 'paragraph', text: 'New content block' };
    }

    addBlock(targetChapterId, newBlock, afterBlockId);
    setInsertAfterBlockId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-hidden select-none">
      {/* Top Page & Studio Controls Toolbar */}
      <div className="no-print h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300">
        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex === 0}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-200">
            Page <span className="font-bold text-sky-400">{activePageIndex + 1}</span> / {totalPages}
          </span>
          <button
            onClick={() => setActivePageIndex(Math.min(totalPages - 1, activePageIndex + 1))}
            disabled={activePageIndex >= totalPages - 1}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-500 font-medium ml-2 truncate max-w-[200px]">
            ({currentPage?.title})
          </span>
        </div>

        {/* Studio Status & Zoom Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live WYSIWYG Mode</span>
          </span>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
            <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-1 hover:text-white">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-300 w-10 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} className="p-1 hover:text-white">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoomLevel(100)} className="p-1 hover:text-white border-l border-slate-800 pl-1.5" title="Reset Zoom">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Paper Page Canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-950/90">
        {(() => {
          const paperStyle = getTemplatePaperStyles(pageConfig.templateId, pageConfig.paperBgColor);
          return (
            <div
              className="text-slate-900 shadow-2xl transition-all rounded-sm flex flex-col relative"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                width: '720px',
                height: '980px',
                overflow: 'hidden',
                paddingTop: `${pageConfig.margin.top * 2.5}px`,
                paddingBottom: `${pageConfig.margin.bottom * 2.5}px`,
                paddingLeft: `${pageConfig.margin.left * 2.5}px`,
                paddingRight: `${pageConfig.margin.right * 2.5}px`,
                fontFamily: pageConfig.bodyFont || pageConfig.themeFont || 'Libertinus Serif, Georgia, serif',
                ...paperStyle.containerStyle,
              }}
            >
              {/* Optional Top Color Ribbon Accent */}
              {paperStyle.topRibbonClass && (
                <div className={`absolute top-0 left-0 right-0 ${paperStyle.topRibbonClass}`} />
              )}
          {/* Running Header — Editable with Chapter / Project Scope Switcher */}
          {currentPage?.type !== 'cover' && (() => {
            const currentChapter = document.chapters.find((ch) => ch.id === currentPage?.chapterId);
            const activeHeaderVal = headerScope === 'chapter'
              ? (currentChapter?.headerText !== undefined ? currentChapter.headerText : pageConfig.headerText || '')
              : (pageConfig.headerText || '');

            return (
              <div className="border-b border-slate-200 pb-1.5 mb-4 flex items-center justify-between text-[10px] text-slate-500 font-sans tracking-wide no-print-input">
                <button
                  onClick={() => setHeaderScope(headerScope === 'chapter' ? 'project' : 'chapter')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[9px] font-medium text-slate-600 border border-slate-300 transition-colors flex items-center space-x-1"
                  title="Click to toggle between Chapter Header vs Project Default Header"
                >
                  <span className="font-semibold text-sky-700">{headerScope === 'chapter' ? '📍 Chapter Header' : '🌐 Project Default Header'}</span>
                </button>

                <input
                  type="text"
                  value={activeHeaderVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (headerScope === 'chapter' && currentPage?.chapterId) {
                      setChapterHeaderFooter(currentPage.chapterId, val, undefined);
                    } else {
                      setBookPageConfig({ headerText: val });
                    }
                  }}
                  placeholder={headerScope === 'chapter' ? 'Enter Chapter Header…' : 'Enter Project Default Header…'}
                  className="flex-1 text-right text-[10px] text-slate-600 font-sans tracking-wide bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-1 py-0.5 focus:outline-none transition-colors ml-2"
                />
              </div>
            );
          })()}

          {/* Main Printable Page Content Area */}
          <div className={`flex-1 min-h-0 overflow-y-auto ${currentPage?.type === 'cover' ? 'flex flex-col justify-center items-center' : 'space-y-3'}`}>
            {/* Cover Page Interactive View */}
            {currentPage?.type === 'cover' && (
              <div className="my-auto flex flex-col items-center justify-center text-center py-8 w-full max-w-lg space-y-3">
                <input
                  type="text"
                  value={document.document.title}
                  onChange={(e) => updateBookMetadata({ title: e.target.value })}
                  placeholder="Book Title"
                  className="text-3xl font-bold text-sky-900 tracking-tight text-center bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-2 py-1 w-full focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  value={document.document.subtitle || ''}
                  onChange={(e) => updateBookMetadata({ subtitle: e.target.value })}
                  placeholder="Book Subtitle / Tagline"
                  className="text-base italic text-slate-600 text-center bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-2 py-1 w-full focus:outline-none transition-colors"
                />
                <div className="w-24 h-1 bg-sky-600 my-4"></div>
                <input
                  type="text"
                  value={document.document.author}
                  onChange={(e) => updateBookMetadata({ author: e.target.value })}
                  placeholder="Author Name"
                  className="text-sm font-semibold text-slate-700 text-center bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-2 py-1 w-full focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  value={document.document.edition || ''}
                  onChange={(e) => updateBookMetadata({ edition: e.target.value })}
                  placeholder="Edition (e.g. 2026 Edition)"
                  className="text-xs text-slate-500 text-center bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-2 py-1 w-full focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Table of Contents View */}
            {currentPage?.type === 'toc' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4">
                  Table of Contents
                </h2>
                <div className="space-y-3 font-sans text-sm">
                  {document.chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      onClick={() => setActiveChapter(ch.id)}
                      className="flex justify-between items-center border-b border-dotted border-slate-300 pb-1 cursor-pointer hover:text-sky-700"
                    >
                      <span className="font-medium">
                        Chapter {idx + 1}: {ch.title}
                      </span>
                      <span className="font-mono text-xs text-slate-500">Page {idx + 2}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Chapter Page Blocks */}
            {currentPage?.type === 'chapter' && currentPage.blocks && currentPage.chapterId && (
              <div className="space-y-2">
                {currentPage.blocks.map((block) => {
                  const isSelected = block.id === selectedBlockId;
                  const chapterId = currentPage.chapterId!;

                  return (
                    <div key={block.id} id={`block-${block.id}`} className="relative group">
                      {/* On-Page Block Container */}
                      <div
                        onClick={() => setSelectedBlock(block.id)}
                        className={`relative rounded p-2 transition-all border ${
                          isSelected
                            ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5'
                            : 'border-transparent hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Floating Block Control Bar (Appears on Hover / Selection) */}
                        <div
                          className={`absolute top-1.5 right-2 transition-all bg-slate-900/95 text-slate-100 rounded-lg px-2.5 py-1 shadow-xl flex items-center space-x-2 text-[10px] z-30 border border-slate-700 no-print ${
                            isSelected ? 'opacity-100 ring-1 ring-sky-500/50' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <span className="font-mono font-semibold uppercase text-sky-400 text-[9px]">
                            {block.type}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, 'up');
                            }}
                            className="hover:text-sky-400"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, 'down');
                            }}
                            className="hover:text-sky-400"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addBlock(chapterId, { id: `pb_${Date.now()}`, type: 'page_break' }, block.id);
                            }}
                            className="hover:text-amber-400 flex items-center space-x-0.5"
                            title="Insert Page Break (Push content to next page)"
                          >
                            <Scissors className="w-3 h-3 text-amber-400" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInsertAfterBlockId(insertAfterBlockId === block.id ? null : block.id);
                            }}
                            className="hover:text-emerald-400 flex items-center space-x-0.5"
                            title="Insert Block Below"
                          >
                            <Plus className="w-3 h-3 text-emerald-400" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlock(block.id);
                            }}
                            className="hover:text-red-400"
                            title="Delete Block"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* On-Page Direct Editable Content */}
                        <OnPageBlockEditor
                          block={block}
                          onUpdate={(changes) => updateBlock(block.id, changes)}
                        />
                      </div>

                      {/* In-Page Block Insertion Popover Line */}
                      {insertAfterBlockId === block.id && (
                        <div className="my-2 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-40 text-xs no-print">
                          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1.5 text-[11px]">
                            <span>Insert New Block Here:</span>
                            <button
                              onClick={() => setInsertAfterBlockId(null)}
                              className="text-slate-500 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                            <button
                              onClick={() => handleCreateBlockOnPage('heading', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <Heading className="w-3 h-3 text-sky-400" />
                              <span>Heading</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('paragraph', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <AlignLeft className="w-3 h-3 text-emerald-400" />
                              <span>Paragraph</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('table', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <Table className="w-3 h-3 text-indigo-400" />
                              <span>Table</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('callout', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>Callout</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('equation', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <Code className="w-3 h-3 text-purple-400" />
                              <span>Equation</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('mcq', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <HelpCircle className="w-3 h-3 text-blue-400" />
                              <span>MCQ</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('pyq', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-teal-400" />
                              <span>PYQ Box</span>
                            </button>
                            <button
                              onClick={() => handleCreateBlockOnPage('quick_revision', chapterId, block.id)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-600/30 rounded text-slate-200 text-left flex items-center space-x-1"
                            >
                              <Sparkles className="w-3 h-3 text-rose-400" />
                              <span>Revision</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Running Footer — Editable with Chapter / Project Override Support */}
          {currentPage?.type !== 'cover' && (() => {
            const currentChapter = document.chapters.find((ch) => ch.id === currentPage?.chapterId);
            const activeFooterVal = headerScope === 'chapter'
              ? (currentChapter?.footerText !== undefined ? currentChapter.footerText : pageConfig.footerText || '')
              : (pageConfig.footerText || '');

            return (
              <div className="border-t border-slate-200 pt-2 mt-4 flex justify-between items-center text-[10px] text-slate-500 font-sans no-print-input">
                <input
                  type="text"
                  value={activeFooterVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (headerScope === 'chapter' && currentPage?.chapterId) {
                      setChapterHeaderFooter(currentPage.chapterId, undefined, val);
                    } else {
                      setBookPageConfig({ footerText: val });
                    }
                  }}
                  placeholder={headerScope === 'chapter' ? 'Chapter Footer (or switch badge above to Project Default)…' : 'Project Default Footer…'}
                  className="flex-1 text-left text-[10px] text-slate-500 font-sans bg-transparent border border-dashed border-transparent hover:border-sky-300 focus:border-sky-500 rounded px-1 py-0.5 focus:outline-none transition-colors mr-2"
                />
                <span className="font-mono flex-shrink-0">Page {activePageIndex + 1}</span>
              </div>
            );
          })()}
        </div>
      );
    })()}
  </div>
</div>
  );
};

interface OnPageBlockEditorProps {
  block: Block;
  onUpdate: (changes: Partial<Block>) => void;
}

const OnPageBlockEditor: React.FC<OnPageBlockEditorProps> = ({ block, onUpdate }) => {
  const { document: doc } = useComposerStore();
  const pageConfig = doc.document.page;
  const [isEditingFormula, setIsEditingFormula] = useState(false);

  const paperStyle = getTemplatePaperStyles(pageConfig.templateId, pageConfig.paperBgColor);

  switch (block.type) {
    case 'heading': {
      const b = block as HeadingBlock;
      return (
        <div className="w-full">
          <input
            type="text"
            value={b.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className={`w-full bg-transparent focus:outline-none focus:bg-amber-500/10 rounded px-1 font-bold ${
              b.level === 1 ? 'text-2xl my-2' : b.level === 2 ? 'text-lg my-1' : 'text-base'
            }`}
            style={{
              fontFamily: pageConfig.headingFont || pageConfig.themeFont || 'inherit',
              color: pageConfig.primaryColor || '#0f172a',
              textAlign: paperStyle.headingAlignment || 'left',
            }}
          />
          {paperStyle.headingAccentBar && b.level === 1 && (
            <div
              className="h-1 w-full rounded-full mb-3"
              style={{ backgroundColor: paperStyle.accentBarColor || pageConfig.primaryColor }}
            />
          )}
        </div>
      );
    }

    case 'paragraph': {
      const b = block as ParagraphBlock;
      const text = b.text || '';
      const hasDropCapText = paperStyle.hasDropCap && text.length > 2 && text[1] === ' ';

      // Scene Break Dinkus Check
      if (text === '• • •' || text === '* * *' || text.includes('❦')) {
        return (
          <div className="text-center py-2 text-sm font-bold tracking-widest" style={{ color: pageConfig.primaryColor || '#9f1239' }}>
            {paperStyle.dinkusSymbol || '❦ • • • ❦'}
          </div>
        );
      }

      return (
        <div className="relative group/p">
          {hasDropCapText && (
            <span
              className="float-left text-4xl font-bold font-serif leading-none pr-2 pt-0.5 uppercase select-none"
              style={{ color: pageConfig.primaryColor || '#9f1239' }}
            >
              {text[0]}
            </span>
          )}
          <textarea
            value={hasDropCapText ? text.slice(2) : text}
            onChange={(e) => {
              const newText = hasDropCapText ? `${text[0]} ${e.target.value}` : e.target.value;
              onUpdate({ text: newText });
            }}
            rows={Math.max(2, Math.ceil(text.length / 75))}
            className="w-full bg-transparent focus:outline-none focus:bg-amber-500/10 rounded p-1 text-xs leading-relaxed text-slate-800 resize-none text-justify"
            style={{
              fontFamily: pageConfig.bodyFont || pageConfig.themeFont || 'inherit',
            }}
          />
        </div>
      );
    }

    case 'callout': {
      const b = block as CalloutBlock;
      let containerClass = 'p-3 rounded border text-xs space-y-1';
      let titleClass = 'font-bold text-[10px] uppercase tracking-wider focus:outline-none focus:bg-amber-500/20 px-1 rounded flex-1 min-w-0';
      
      if (pageConfig.templateId === 'exam-coaching-blue' && b.variant === 'exam-tip') {
        containerClass = 'p-3 rounded-lg border-none text-xs space-y-1 bg-[#10b981] text-white shadow-md relative overflow-hidden mt-4 mb-2';
        titleClass = 'font-bold text-sm tracking-widest focus:outline-none focus:bg-white/20 px-1 rounded flex-1 min-w-0 text-white flex items-center gap-2';
      } else if (pageConfig.templateId === 'corporate-executive-slate') {
        containerClass = 'p-4 rounded-lg border-2 border-[#0f172a] text-xs space-y-2 bg-[#e0f2fe] shadow-sm mb-4';
        titleClass = 'font-bold text-[11px] uppercase tracking-widest focus:outline-none focus:bg-amber-500/20 px-1 rounded flex-1 min-w-0 text-[#0f172a]';
      } else if (pageConfig.templateId === 'academic-tufte-emerald') {
        containerClass = 'p-3 rounded-none border-l-4 border-[#047857] text-xs space-y-1 bg-slate-100 my-4 ml-4';
        titleClass = 'font-bold text-sm focus:outline-none focus:bg-amber-500/20 px-1 rounded flex-1 min-w-0 text-[#047857]';
      } else {
        const colors = getCalloutStudioColors(b.variant);
        containerClass += ` ${colors.bg} ${colors.border}`;
        titleClass += ` ${colors.title}`;
      }

      return (
        <div className={containerClass}>
          <div className="flex items-center space-x-2 w-full max-w-full">
            {pageConfig.templateId === 'exam-coaching-blue' && b.variant === 'exam-tip' && <span className="text-xl">💡</span>}
            <input
              type="text"
              value={b.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className={titleClass}
            />
            <select
              value={b.variant}
              onChange={(e) => onUpdate({ variant: e.target.value as CalloutVariant })}
              className="no-print text-[9px] bg-white border border-slate-300 rounded px-1 text-slate-600"
            >
              <option value="exam-tip">Exam Tip</option>
              <option value="important">Important</option>
              <option value="remember">Remember</option>
              <option value="common-mistake">Common Mistake</option>
            </select>
          </div>
          <textarea
            value={b.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            className={`w-full bg-transparent focus:outline-none rounded leading-normal text-xs resize-none ${
              pageConfig.templateId === 'exam-coaching-blue' && b.variant === 'exam-tip' ? 'text-white focus:bg-white/10' : 'text-slate-800 focus:bg-amber-500/10'
            }`}
          />
        </div>
      );
    }
    case 'table': {
      const b = block as TableBlock;
      let headerBg = 'bg-slate-100';
      let headerText = 'text-slate-800';
      let borderClass = 'border-slate-300';
      let altRow = 'bg-slate-50';

      if (pageConfig.templateId === 'exam-coaching-blue') {
        headerBg = 'bg-[#1e3a8a]';
        headerText = 'text-white';
        borderClass = 'border-[#d97706]';
        altRow = 'bg-[#fef3c7]';
      } else if (pageConfig.templateId === 'corporate-executive-slate') {
        headerBg = 'bg-[#0f172a]';
        headerText = 'text-white';
        borderClass = 'border-slate-300';
        altRow = 'bg-slate-50';
      }

      const handleAddRow = () => {
        const newRow = b.columns.map(() => '...');
        onUpdate({ rows: [...b.rows, newRow] });
      };

      const handleAddColumn = () => {
        const newColName = `Col ${b.columns.length + 1}`;
        const newCols = [...b.columns, newColName];
        const newRows = b.rows.map((r) => [...r, '...']);
        onUpdate({ columns: newCols, rows: newRows });
      };

      const handleRemoveRow = () => {
        if (b.rows.length <= 1) return;
        onUpdate({ rows: b.rows.slice(0, -1) });
      };

      const handleRemoveColumn = () => {
        if (b.columns.length <= 1) return;
        const newCols = b.columns.slice(0, -1);
        const newRows = b.rows.map((r) => r.slice(0, -1));
        onUpdate({ columns: newCols, rows: newRows });
      };

      return (
        <div className="my-1 space-y-1">
          <div className="flex items-center space-x-1 text-[10px] no-print justify-end">
            <button onClick={handleAddRow} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">+ Row</button>
            <button onClick={handleAddColumn} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">+ Col</button>
            <button onClick={handleRemoveRow} disabled={b.rows.length <= 1} className="p-1 rounded bg-slate-100 text-slate-600">- Row</button>
            <button onClick={handleRemoveColumn} disabled={b.columns.length <= 1} className="p-1 rounded bg-slate-100 text-slate-600">- Col</button>
          </div>
          <table className={`w-full text-xs border-collapse border ${borderClass}`}>
            <thead>
              <tr className={headerBg}>
                {b.columns.map((col, cIdx) => (
                  <th key={cIdx} className={`border ${borderClass} px-2 py-1.5 text-left font-bold ${headerText}`}>
                    <input type="text" value={col} onChange={(e) => { const newCols = [...b.columns]; newCols[cIdx] = e.target.value; onUpdate({ columns: newCols }); }} className="bg-transparent focus:outline-none w-full" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : altRow}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`border ${borderClass} px-2 py-1.5 text-slate-700`}>
                      <input type="text" value={cell} onChange={(e) => { const newRows = [...b.rows]; newRows[rIdx][cIdx] = e.target.value; onUpdate({ rows: newRows }); }} className="bg-transparent focus:outline-none w-full text-xs" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'equation': {
      const b = block as EquationBlock;

      const appendFormulaSymbol = (sym: string) => {
        onUpdate({ expression: (b.expression || '') + sym });
      };

      return (
        <div className="my-1.5 p-3 bg-slate-50 border border-slate-300 rounded-lg text-center space-y-2">
          {/* Formatted Typeset Equation Output */}
          <div
            onClick={() => setIsEditingFormula(true)}
            className="cursor-pointer hover:bg-purple-50 p-2 rounded transition-colors"
          >
            <MathEquation expression={b.expression} className="text-base text-purple-950 font-bold" />
          </div>

          {/* Equation Toolbar & Raw Expression Input */}
          <div className="space-y-1.5 no-print border-t border-slate-200 pt-2">
            <div className="flex flex-wrap justify-center gap-1 text-[10px]">
              <button
                onClick={() => appendFormulaSymbol(' / ')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
                title="Fraction (a/b)"
              >
                a/b Fraction
              </button>
              <button
                onClick={() => appendFormulaSymbol('^2')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
                title="Power ^n"
              >
                xⁿ Power
              </button>
              <button
                onClick={() => appendFormulaSymbol('_1')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
                title="Subscript _i"
              >
                xᵢ Subscript
              </button>
              <button
                onClick={() => appendFormulaSymbol('\\sqrt{x}')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
              >
                √x Root
              </button>
              <button
                onClick={() => appendFormulaSymbol('\\sum_{i=1}^n')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
              >
                ∑ Sum
              </button>
              <button
                onClick={() => appendFormulaSymbol('\\int_a^b')}
                className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold"
              >
                ∫ Integral
              </button>
            </div>

            <input
              type="text"
              value={b.expression}
              onChange={(e) => onUpdate({ expression: e.target.value })}
              placeholder="e.g. (A+B)^5 / (A-B)"
              className="w-full bg-white border border-purple-300 rounded px-2.5 py-1 text-center font-mono text-xs text-purple-900 focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>
      );
    }

    case 'mcq': {
      const b = block as MCQBlock;
      const isExam = pageConfig.templateId === 'exam-coaching-blue';
      
      return (
        <div className={`my-4 ${isExam ? '' : 'p-3 bg-slate-50 border border-slate-300 rounded'} text-xs space-y-3`}>
          <div className="flex items-start">
            {isExam && <span className="font-bold text-slate-900 mr-2 text-sm">{b.question.split('.')[0] || '1'}.</span>}
            <input
              type="text"
              value={isExam && b.question.includes('.') ? b.question.substring(b.question.indexOf('.') + 1).trim() : b.question}
              onChange={(e) => onUpdate({ question: isExam && b.question.includes('.') ? `${b.question.split('.')[0]}. ${e.target.value}` : e.target.value })}
              className={`w-full bg-transparent font-bold text-slate-900 focus:outline-none focus:bg-amber-100 rounded px-1 ${isExam ? 'text-sm' : ''}`}
            />
          </div>
          <div className={isExam ? "grid grid-cols-2 gap-y-4 gap-x-6 ml-6" : "space-y-1 ml-2"}>
            {b.options.map((opt, optIdx) => (
              <div key={opt.id} className={`flex items-start space-x-2 ${opt.isCorrect && !isExam ? 'font-semibold text-emerald-800' : 'text-slate-700'}`}>
                {isExam ? (
                  <div className="w-4 h-4 border-2 border-slate-700 rounded-sm flex-shrink-0 mt-0.5" />
                ) : (
                  <span className="font-bold text-slate-900 flex-shrink-0">({opt.label})</span>
                )}
                {isExam && <span className="font-bold text-slate-900 flex-shrink-0 text-sm">{opt.label}.</span>}
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => {
                    const newOpts = [...b.options];
                    newOpts[optIdx].text = e.target.value;
                    onUpdate({ options: newOpts });
                  }}
                  className={`flex-1 bg-transparent focus:outline-none focus:bg-amber-100 rounded px-1 ${isExam ? 'text-sm' : ''}`}
                />
                {opt.isCorrect && !isExam && <span className="text-[10px] text-emerald-600 font-sans ml-2 flex-shrink-0">(Correct)</span>}
              </div>
            ))}
          </div>
          {b.explanation && !isExam && (
            <p className="mt-2 text-[10px] italic text-slate-600 border-t border-slate-200 pt-1">
              Explanation: {b.explanation}
            </p>
          )}
        </div>
      );
    }
    case 'pyq': {
      const b = block as PYQBlock;
      return (
        <div className="my-1 p-3 bg-amber-50 border border-amber-300 rounded text-xs space-y-1">
          <input
            type="text"
            value={b.examName}
            onChange={(e) => onUpdate({ examName: e.target.value })}
            className="font-bold text-[9px] uppercase text-amber-800 bg-amber-200 px-1 py-0.5 rounded focus:outline-none"
          />
          <input
            type="text"
            value={b.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none focus:bg-amber-100 rounded px-1"
          />
          <textarea
            value={b.answerText}
            onChange={(e) => onUpdate({ answerText: e.target.value })}
            rows={2}
            className="w-full bg-transparent text-amber-900 focus:outline-none focus:bg-amber-100 rounded p-1 text-xs resize-none"
          />
        </div>
      );
    }

    case 'quick_revision': {
      const b = block as QuickRevisionBlock;
      const isCorporate = pageConfig.templateId === 'corporate-executive-slate';
      
      if (isCorporate) {
        return (
          <div className="my-4 p-4 bg-white border-[3px] border-[#38bdf8] rounded-xl text-center shadow-md relative">
            <input
              type="text"
              value={b.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-transparent font-bold text-sm tracking-widest text-slate-500 focus:outline-none focus:bg-blue-50 rounded px-1 text-center uppercase mb-2"
            />
            <textarea
              value={b.bulletPoints.join('\\n')}
              onChange={(e) => onUpdate({ bulletPoints: e.target.value.split('\\n') })}
              rows={b.bulletPoints.length || 2}
              className="w-full bg-transparent font-bold text-4xl text-[#0f172a] focus:outline-none focus:bg-blue-50 rounded px-1 text-center resize-none"
            />
          </div>
        );
      }

      return (
        <div className="my-1 p-3 bg-blue-50 border border-blue-300 rounded text-xs space-y-1">
          <input
            type="text"
            value={b.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full bg-transparent font-bold text-blue-900 focus:outline-none focus:bg-blue-100 rounded px-1"
          />
          <textarea
            value={b.bulletPoints.join('\\n')}
            onChange={(e) => onUpdate({ bulletPoints: e.target.value.split('\\n') })}
            rows={Math.max(3, b.bulletPoints.length)}
            className="w-full bg-transparent text-slate-800 focus:outline-none focus:bg-blue-100 rounded p-1 text-xs resize-none leading-relaxed"
          />
        </div>
      );
    }
    case 'mindmap': {
      const b = block as MindMapBlock;
      return (
        <MindMapViewer
          rootNode={b.rootNode}
          title={b.title}
          onUpdateTitle={(newTitle) => onUpdate({ title: newTitle })}
        />
      );
    }

    case 'footnote': {
      const b = block as FootnoteBlock;
      return (
        <div className="my-1 p-2 bg-slate-50 border border-slate-300 rounded text-[11px] font-sans flex items-start space-x-2">
          <span className="font-bold text-sky-700 font-mono">[{b.number}]</span>
          <div className="flex-1 space-y-0.5">
            <input
              type="text"
              value={b.term}
              onChange={(e) => onUpdate({ term: e.target.value })}
              className="font-bold text-slate-900 bg-transparent focus:outline-none focus:bg-sky-100 rounded px-1"
            />
            <input
              type="text"
              value={b.citationText}
              onChange={(e) => onUpdate({ citationText: e.target.value })}
              className="w-full text-slate-700 bg-transparent focus:outline-none focus:bg-sky-100 rounded px-1 italic"
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

function getCalloutStudioColors(variant: CalloutVariant) {
  switch (variant) {
    case 'exam-tip':
      return { bg: 'bg-emerald-50', border: 'border-emerald-300', title: 'text-emerald-800' };
    case 'important':
      return { bg: 'bg-red-50', border: 'border-red-300', title: 'text-red-800' };
    case 'remember':
      return { bg: 'bg-sky-50', border: 'border-sky-300', title: 'text-sky-800' };
    case 'common-mistake':
      return { bg: 'bg-orange-50', border: 'border-orange-300', title: 'text-orange-800' };
    default:
      return { bg: 'bg-slate-50', border: 'border-slate-300', title: 'text-slate-800' };
  }
}
