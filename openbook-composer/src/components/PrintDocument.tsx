import React from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { getTemplatePaperStyles } from '../document/templates';
import { Block, CalloutVariant, MindMapBlock, FootnoteBlock } from '../document/types';
import { paginateBlocks } from '../document/pagination';
import { MathEquation } from './MathEquation';
import { MindMapViewer } from './MindMapViewer';

export const PrintDocument: React.FC = () => {
  const { document } = useComposerStore();
  const pageConfig = document.document.page;
  const paperStyle = getTemplatePaperStyles(pageConfig.templateId, pageConfig.paperBgColor);

  const totalPagesList: Array<{ title: string; type: 'cover' | 'toc' | 'chapter'; chapterIdx?: number; blocks?: Block[] }> = [];

  if (pageConfig.showCoverPage) {
    totalPagesList.push({ title: 'Cover Page', type: 'cover' });
  }

  if (pageConfig.includeTOC) {
    totalPagesList.push({ title: 'Table of Contents', type: 'toc' });
  }

  document.chapters.forEach((chapter, chIdx) => {
    const chapterPages = paginateBlocks(chapter.blocks, pageConfig.templateId);

    chapterPages.forEach((pageBlocks) => {
      if (pageBlocks.length > 0) {
        totalPagesList.push({
          title: `Chapter ${chIdx + 1}: ${chapter.title}`,
          type: 'chapter',
          chapterIdx: chIdx,
          blocks: pageBlocks,
        });
      }
    });
  });

  return (
    <div className="print-only text-slate-900 bg-white w-full max-w-full box-border">
      {totalPagesList.map((pageItem, pIdx) => {
        const currentChapter = pageItem.chapterIdx !== undefined ? document.chapters[pageItem.chapterIdx] : undefined;
        const headerText = currentChapter?.headerText || pageConfig.headerText;
        const footerText = currentChapter?.footerText || pageConfig.footerText;

        return (
          <div
            key={pIdx}
            className="page-break flex flex-col justify-between box-border max-w-full overflow-hidden relative"
            style={{
              width: '100%',
              height: '297mm',
              maxHeight: '297mm',
              minHeight: '297mm',
              paddingTop: `${pageConfig.margin.top}mm`,
              paddingBottom: `${pageConfig.margin.bottom}mm`,
              paddingLeft: `${pageConfig.margin.left}mm`,
              paddingRight: `${pageConfig.margin.right}mm`,
              fontFamily: pageConfig.bodyFont || pageConfig.themeFont || 'Libertinus Serif, Georgia, serif',
              boxSizing: 'border-box',
              overflow: 'hidden',
              ...paperStyle.containerStyle,
            }}
          >
            {paperStyle.topRibbonClass && (
              <div className={`absolute top-0 left-0 right-0 ${paperStyle.topRibbonClass}`} />
            )}
            {/* Header */}
            {headerText && pageItem.type !== 'cover' && (
              <div className="border-b border-slate-300 pb-2 mb-6 text-right text-[10pt] text-slate-600 font-sans break-words max-w-full flex-shrink-0">
                {headerText}
              </div>
            )}

            {/* Content */}
            <div className={`flex-1 min-h-0 overflow-hidden ${pageItem.type === 'cover' ? 'flex flex-col justify-center items-center' : 'space-y-3'} max-w-full`}>
              {pageItem.type === 'cover' && (
                <div className="my-auto flex flex-col items-center justify-center text-center py-8 w-full max-w-full">
                  <h1 className="text-3xl font-bold text-sky-900 tracking-tight mb-3 break-words max-w-full">
                    {document.document.title}
                  </h1>
                  {document.document.subtitle && (
                    <p className="text-base italic text-slate-600 mb-8 break-words max-w-full">{document.document.subtitle}</p>
                  )}
                  <div className="w-24 h-1 bg-sky-600 mb-8"></div>
                  <p className="text-sm font-semibold text-slate-700">{document.document.author}</p>
                  <p className="text-xs text-slate-500 mt-1">{document.document.edition}</p>
                </div>
              )}

              {pageItem.type === 'toc' && (
                <div className="max-w-full">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4">
                    Table of Contents
                  </h2>
                  <div className="space-y-3 font-sans text-sm">
                    {document.chapters.map((ch, idx) => (
                      <div key={ch.id} className="flex justify-between items-center border-b border-dotted border-slate-300 pb-1">
                        <span className="font-medium text-slate-800 truncate mr-2">
                          Chapter {idx + 1}: {ch.title}
                        </span>
                        <span className="font-mono text-xs text-slate-500 flex-shrink-0">Page {idx + 2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pageItem.type === 'chapter' && pageItem.blocks && (
                <div className="space-y-3 max-w-full">
                  {pageItem.blocks.map((block) => (
                    <PrintBlockItem key={block.id} block={block} pageConfig={pageConfig} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {footerText && pageItem.type !== 'cover' && (
              <div className="border-t border-slate-300 pt-2 mt-6 flex justify-between items-center text-[10pt] text-slate-600 font-sans max-w-full flex-shrink-0">
                <span className="truncate mr-2">{footerText}</span>
                <span className="font-mono flex-shrink-0">Page {pIdx + 1}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const PrintBlockItem: React.FC<{ block: Block; pageConfig: any }> = ({ block, pageConfig }) => {
  const primaryColor = pageConfig?.primaryColor || '#1e3a8a';
  const headingFont = pageConfig?.headingFont || 'Outfit, sans-serif';
  const paperStyle = getTemplatePaperStyles(pageConfig?.templateId, pageConfig?.paperBgColor);

  switch (block.type) {
    case 'heading': {
      if (block.level === 1) {
        return (
          <div className="w-full">
            <h1
              className="text-xl font-bold mt-4 mb-2 break-words max-w-full"
              style={{
                breakAfter: 'avoid',
                pageBreakAfter: 'avoid',
                fontFamily: headingFont,
                color: primaryColor,
                textAlign: paperStyle.headingAlignment || 'left',
              }}
            >
              {block.text}
            </h1>
            {paperStyle.headingAccentBar && (
              <div
                className="h-1 w-full rounded-full mb-3"
                style={{ backgroundColor: paperStyle.accentBarColor || primaryColor }}
              />
            )}
          </div>
        );
      }
      if (block.level === 2) {
        return (
          <h2
            className="text-base font-bold mt-3 mb-1.5 break-words max-w-full"
            style={{
              breakAfter: 'avoid',
              pageBreakAfter: 'avoid',
              fontFamily: headingFont,
              color: primaryColor,
              textAlign: paperStyle.headingAlignment || 'left',
            }}
          >
            {block.text}
          </h2>
        );
      }
      return (
        <h3
          className="text-sm font-semibold text-slate-800 mt-2 mb-1 break-words max-w-full"
          style={{
            breakAfter: 'avoid',
            pageBreakAfter: 'avoid',
            fontFamily: headingFont,
            textAlign: paperStyle.headingAlignment || 'left',
          }}
        >
          {block.text}
        </h3>
      );
    }

    case 'paragraph': {
      const text = block.text || '';
      const hasDropCapText = paperStyle.hasDropCap && text.length > 2 && text[1] === ' ';

      if (text === '• • •' || text === '* * *' || text.includes('❦')) {
        return (
          <div className="text-center py-2 text-sm font-bold tracking-widest my-2" style={{ color: primaryColor }}>
            {paperStyle.dinkusSymbol || '❦ • • • ❦'}
          </div>
        );
      }

      if (hasDropCapText) {
        return (
          <p className="text-xs leading-relaxed text-slate-800 text-justify mb-2 break-words max-w-full">
            <span
              className="float-left text-3xl font-bold font-serif leading-none pr-1.5 pt-0.5 uppercase"
              style={{ color: primaryColor }}
            >
              {text[0]}
            </span>
            {text.slice(2)}
          </p>
        );
      }

      return <p className="text-xs leading-relaxed text-slate-800 text-justify mb-2 break-words max-w-full">{text}</p>;
    }

    case 'callout': {
      let containerClass = 'p-3 rounded border text-xs my-2.5 max-w-full box-border';
      let titleClass = 'font-bold text-[10px] uppercase tracking-wider mb-1 break-words max-w-full';
      
      if (pageConfig.templateId === 'exam-coaching-blue' && block.variant === 'exam-tip') {
        containerClass = 'p-3 rounded-lg border-none text-xs my-4 bg-[#10b981] text-white shadow-md max-w-full box-border';
        titleClass = 'font-bold text-sm tracking-widest mb-1 text-white flex items-center gap-2 max-w-full';
      } else if (pageConfig.templateId === 'corporate-executive-slate') {
        containerClass = 'p-4 rounded-lg border-2 border-[#0f172a] text-xs space-y-2 bg-[#e0f2fe] mb-4 max-w-full box-border';
        titleClass = 'font-bold text-[11px] uppercase tracking-widest mb-2 text-[#0f172a] max-w-full';
      } else if (pageConfig.templateId === 'academic-tufte-emerald') {
        containerClass = 'p-3 rounded-none border-l-4 border-[#047857] text-xs bg-slate-100 my-4 ml-4 max-w-full box-border';
        titleClass = 'font-bold text-sm mb-1 text-[#047857] max-w-full';
      } else {
        const colors = getCalloutPreviewColors(block.variant);
        containerClass += ` ${colors.bg} ${colors.border}`;
        titleClass += ` ${colors.title}`;
      }

      return (
        <div className={containerClass}>
          <div className={titleClass}>
            {pageConfig.templateId === 'exam-coaching-blue' && block.variant === 'exam-tip' && <span className="text-xl">💡</span>}
            {block.title || block.variant}
          </div>
          <p className={`leading-normal break-words max-w-full ${pageConfig.templateId === 'exam-coaching-blue' && block.variant === 'exam-tip' ? 'text-white' : 'text-slate-800'}`}>
            {block.text}
          </p>
        </div>
      );
    }
    case 'table': {
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

      return (
        <div className="my-4 max-w-full overflow-x-auto">
          <table className={`w-full text-xs border-collapse border max-w-full ${borderClass}`}>
            <thead>
              <tr className={headerBg}>
                {block.columns.map((col, idx) => (
                  <th key={idx} className={`border px-2 py-1.5 text-left font-bold break-words ${borderClass} ${headerText}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : altRow}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`border px-2 py-1.5 text-slate-700 break-words ${borderClass}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <p className="text-[10px] italic text-slate-500 mt-1 text-center break-words">{block.caption}</p>}
        </div>
      );
    }
    case 'equation': {
      return (
        <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded text-center max-w-full overflow-x-auto">
          <MathEquation expression={block.expression} className="text-base text-purple-950 font-bold" />
          {block.caption && <p className="text-[10px] italic text-slate-500 mt-1 break-words">{block.caption}</p>}
        </div>
      );
    }

    case 'mcq': {
      const isExam = pageConfig.templateId === 'exam-coaching-blue';
      return (
        <div className={`my-4 ${isExam ? '' : 'p-3 bg-slate-50 border border-slate-300 rounded'} text-xs max-w-full box-border`}>
          <div className="flex items-start mb-3">
            {isExam && <span className="font-bold text-slate-900 mr-2 text-sm">{block.question.split('.')[0] || '1'}.</span>}
            <p className={`font-bold text-slate-900 break-words ${isExam ? 'text-sm' : ''}`}>
              {isExam && block.question.includes('.') ? block.question.substring(block.question.indexOf('.') + 1).trim() : block.question}
            </p>
          </div>
          <div className={isExam ? "grid grid-cols-2 gap-y-4 gap-x-6 ml-6" : "space-y-1 ml-2"}>
            {block.options.map((opt) => (
              <div key={opt.id} className={`flex items-start space-x-2 ${opt.isCorrect && !isExam ? 'font-semibold text-emerald-800' : 'text-slate-700'}`}>
                {isExam ? (
                  <div className="w-4 h-4 border-2 border-slate-700 rounded-sm flex-shrink-0 mt-0.5" />
                ) : (
                  <span className="font-bold text-slate-900 flex-shrink-0">({opt.label})</span>
                )}
                {isExam && <span className="font-bold text-slate-900 flex-shrink-0 text-sm">{opt.label}.</span>}
                <span className={`break-words flex-1 ${isExam ? 'text-sm text-slate-800' : ''}`}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'pyq': {
      return (
        <div className="my-3 p-3 bg-amber-50 border border-amber-300 rounded text-xs max-w-full box-border">
          <span className="font-bold text-[10px] uppercase text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded inline-block mb-1">
            PYQ — {block.examName}
          </span>
          <p className="font-semibold text-slate-900 mt-1 break-words">{block.question}</p>
          <p className="text-amber-900 mt-1 text-[11px] break-words">{block.answerText}</p>
        </div>
      );
    }

    case 'quick_revision': {
      const isCorporate = pageConfig.templateId === 'corporate-executive-slate';
      
      if (isCorporate) {
        return (
          <div className="my-4 p-4 bg-white border-[3px] border-[#38bdf8] rounded-xl text-center shadow-md relative max-w-full box-border">
            <p className="w-full font-bold text-sm tracking-widest text-slate-500 uppercase mb-2 break-words">
              {block.title}
            </p>
            {block.bulletPoints.map((pt, idx) => (
              <p key={idx} className="font-bold text-4xl text-[#0f172a] break-words my-1">
                {pt}
              </p>
            ))}
          </div>
        );
      }

      return (
        <div className="my-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs max-w-full box-border">
          <p className="font-bold text-blue-900 mb-1 break-words">⚡ {block.title}</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-800">
            {block.bulletPoints.map((pt, idx) => (
              <li key={idx} className="break-words">{pt}</li>
            ))}
          </ul>
        </div>
      );
    }
    case 'mindmap': {
      const b = block as MindMapBlock;
      return (
        <div className="max-w-full overflow-x-auto">
          <MindMapViewer rootNode={b.rootNode} title={b.title} />
        </div>
      );
    }

    case 'footnote': {
      const b = block as FootnoteBlock;
      return (
        <div className="my-2 p-2 bg-slate-50 border border-slate-300 rounded text-[10pt] font-sans flex items-start space-x-2 max-w-full box-border">
          <span className="font-bold text-sky-800 font-mono flex-shrink-0">[{b.number}]</span>
          <div className="flex-1 break-words">
            <span className="font-bold text-slate-900">{b.term}: </span>
            <span className="text-slate-700 italic">{b.citationText}</span>
          </div>
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
