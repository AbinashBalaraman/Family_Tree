import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { Block, CalloutVariant } from '../document/types';
import { paginateBlocks } from '../document/pagination';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { MathEquation } from './MathEquation';

export const PagePreviewer: React.FC = () => {
  const { document, zoomLevel, setZoomLevel } = useComposerStore();
  const [activePageIndex, setActivePageIndex] = useState(0);

  const pageConfig = document.document.page;

  // Aggregate document pages (Cover + TOC + Chapters)
  const totalPagesList: Array<{ title: string; type: 'cover' | 'toc' | 'chapter'; chapterIdx?: number; blocks?: Block[] }> = [];

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
        chapterIdx: chIdx,
        blocks: [],
      });
    } else {
      chapterPages.forEach((pageBlocks) => {
        totalPagesList.push({
          title: `Chapter ${chIdx + 1}: ${chapter.title}`,
          type: 'chapter',
          chapterIdx: chIdx,
          blocks: pageBlocks,
        });
      });
    }
  });

  const currentPage = totalPagesList[activePageIndex] || totalPagesList[0];
  const totalPages = totalPagesList.length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-hidden select-none">
      {/* Top Page Controls Toolbar */}
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
          <span className="text-[11px] text-slate-500 font-medium ml-2">
            ({currentPage?.title})
          </span>
        </div>

        {/* Paper Size & Zoom Controls */}
        <div className="flex items-center space-x-4">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
            {pageConfig.size} ({pageConfig.margin.top}mm margin)
          </span>

          <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-300 w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-1 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:text-white border-l border-slate-800 pl-1.5"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Preview Canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-950/80">
        {(() => {
          const currentChapter = currentPage?.chapterIdx !== undefined ? document.chapters[currentPage.chapterIdx] : undefined;
          const headerText = currentChapter?.headerText || pageConfig.headerText;
          const footerText = currentChapter?.footerText || pageConfig.footerText;

          return (
            <div
              className="bg-white text-slate-900 shadow-2xl transition-transform rounded-sm border border-slate-300 flex flex-col justify-between"
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
                fontFamily: pageConfig.themeFont || 'Libertinus Serif, Georgia, serif',
              }}
            >
              {/* Header */}
              {headerText && currentPage?.type !== 'cover' && (
                <div className="border-b border-slate-200 pb-2 mb-4 text-right text-[10px] text-slate-500 font-sans tracking-wide flex-shrink-0">
                  {headerText}
                </div>
              )}

              {/* Page Content */}
              <div className={`flex-1 min-h-0 overflow-hidden ${currentPage?.type === 'cover' ? 'flex flex-col justify-center items-center' : 'space-y-3'}`}>
                {currentPage?.type === 'cover' && (
                  <div className="my-auto flex flex-col items-center justify-center text-center py-8 w-full">
                    <h1 className="text-3xl font-bold text-sky-900 tracking-tight mb-3">
                      {document.document.title}
                    </h1>
                    {document.document.subtitle && (
                      <p className="text-base italic text-slate-600 mb-8">{document.document.subtitle}</p>
                    )}
                    <div className="w-24 h-1 bg-sky-600 mb-8"></div>
                    <p className="text-sm font-semibold text-slate-700">{document.document.author}</p>
                    <p className="text-xs text-slate-500 mt-1">{document.document.edition}</p>
                  </div>
                )}

                {currentPage?.type === 'toc' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4">
                      Table of Contents
                    </h2>
                    <div className="space-y-3 font-sans text-sm">
                      {document.chapters.map((ch, idx) => (
                        <div key={ch.id} className="flex justify-between items-center border-b border-dotted border-slate-300 pb-1">
                          <span className="font-medium text-slate-800">
                            Chapter {idx + 1}: {ch.title}
                          </span>
                          <span className="font-mono text-xs text-slate-500">Page {idx + 2}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentPage?.type === 'chapter' && currentPage.blocks && (
                  <div className="space-y-3">
                    {currentPage.blocks.map((block) => (
                      <PreviewBlockItem key={block.id} block={block} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {footerText && currentPage?.type !== 'cover' && (
                <div className="border-t border-slate-200 pt-2 mt-4 flex justify-between items-center text-[10px] text-slate-500 font-sans flex-shrink-0">
                  <span className="truncate mr-2">{footerText}</span>
                  <span className="font-mono flex-shrink-0">Page {activePageIndex + 1}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

const PreviewBlockItem: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case 'heading': {
      if (block.level === 1) {
        return <h1 className="text-xl font-bold text-slate-900 mt-4 mb-2">{block.text}</h1>;
      }
      if (block.level === 2) {
        return <h2 className="text-base font-bold text-slate-800 mt-3 mb-1.5">{block.text}</h2>;
      }
      return <h3 className="text-sm font-semibold text-slate-800 mt-2 mb-1">{block.text}</h3>;
    }

    case 'paragraph': {
      return <p className="text-xs leading-relaxed text-slate-800 text-justify mb-2">{block.text}</p>;
    }

    case 'callout': {
      const colors = getCalloutPreviewColors(block.variant);
      return (
        <div className={`p-3 rounded border text-xs my-2.5 ${colors.bg} ${colors.border}`}>
          <div className={`font-bold text-[10px] uppercase tracking-wider mb-1 ${colors.title}`}>
            {block.title || block.variant}
          </div>
          <p className="text-slate-800 leading-normal">{block.text}</p>
        </div>
      );
    }

    case 'table': {
      return (
        <div className="my-3 overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                {block.columns.map((col, idx) => (
                  <th key={idx} className="border border-slate-300 px-2 py-1 text-left font-bold text-slate-800">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border border-slate-300 px-2 py-1 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <p className="text-[10px] italic text-slate-500 mt-1 text-center">{block.caption}</p>}
        </div>
      );
    }

    case 'equation': {
      return (
        <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded text-center">
          <MathEquation expression={block.expression} className="text-base text-purple-950 font-bold" />
          {block.caption && <p className="text-[10px] italic text-slate-500 mt-1">{block.caption}</p>}
        </div>
      );
    }

    case 'mcq': {
      return (
        <div className="my-3 p-3 bg-slate-50 border border-slate-300 rounded text-xs">
          <p className="font-bold text-slate-900 mb-2">Q: {block.question}</p>
          <div className="space-y-1 ml-2">
            {block.options.map((opt) => (
              <div key={opt.id} className={`flex items-center space-x-2 ${opt.isCorrect ? 'font-semibold text-emerald-800' : 'text-slate-700'}`}>
                <span className="font-bold text-slate-900">({opt.label})</span>
                <span>{opt.text}</span>
                {opt.isCorrect && <span className="text-[10px] text-emerald-600 font-sans ml-2">(Correct)</span>}
              </div>
            ))}
          </div>
          {block.explanation && (
            <p className="mt-2 text-[10px] italic text-slate-600 border-t border-slate-200 pt-1">
              Explanation: {block.explanation}
            </p>
          )}
        </div>
      );
    }

    case 'pyq': {
      return (
        <div className="my-3 p-3 bg-amber-50 border border-amber-300 rounded text-xs">
          <span className="font-bold text-[10px] uppercase text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
            PYQ — {block.examName}
          </span>
          <p className="font-semibold text-slate-900 mt-1">{block.question}</p>
          <p className="text-amber-900 mt-1 text-[11px]">{block.answerText}</p>
        </div>
      );
    }

    case 'quick_revision': {
      return (
        <div className="my-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs">
          <p className="font-bold text-blue-900 mb-1">⚡ {block.title}</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-800">
            {block.bulletPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      );
    }

    default:
      return null;
  }
};

function getCalloutPreviewColors(variant: CalloutVariant) {
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
