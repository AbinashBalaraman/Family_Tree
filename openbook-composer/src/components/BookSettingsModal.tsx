import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { BOOK_TEMPLATES } from '../document/templates';
import { PaperSize } from '../document/types';
import { X, Save, Sliders, Palette } from 'lucide-react';

interface BookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookSettingsModal: React.FC<BookSettingsModalProps> = ({ isOpen, onClose }) => {
  const { document, setBookPageConfig, applyTemplate } = useComposerStore();
  const page = document.document.page;

  const [selectedTemplateId, setSelectedTemplateId] = useState(page.templateId || 'exam-coaching-blue');
  const [size, setSize] = useState<PaperSize>(page.size);
  const [topMargin, setTopMargin] = useState(page.margin.top);
  const [bottomMargin, setBottomMargin] = useState(page.margin.bottom);
  const [leftMargin, setLeftMargin] = useState(page.margin.left);
  const [rightMargin, setRightMargin] = useState(page.margin.right);
  const [headerText, setHeaderText] = useState(page.headerText || '');
  const [footerText, setFooterText] = useState(page.footerText || '');
  const [includeTOC, setIncludeTOC] = useState(page.includeTOC || false);
  const [showCoverPage, setShowCoverPage] = useState(page.showCoverPage || false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedTemplateId !== page.templateId) {
      applyTemplate(selectedTemplateId, false);
    }
    setBookPageConfig({
      size,
      margin: {
        top: Number(topMargin),
        bottom: Number(bottomMargin),
        left: Number(leftMargin),
        right: Number(rightMargin),
      },
      headerText,
      footerText,
      includeTOC,
      showCoverPage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-slate-100 font-semibold text-sm">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Book & Page Configuration</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Book Genre Template & Theme Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-medium text-slate-300 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Book Genre Template & Theme:</span>
            </span>
            <span className="text-[10px] text-sky-400 font-mono">1-Click Theme</span>
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => {
              const tId = e.target.value;
              setSelectedTemplateId(tId);
              const t = BOOK_TEMPLATES.find((x) => x.id === tId);
              if (t) {
                setSize(t.pageConfig.size);
                setTopMargin(t.pageConfig.margin.top);
                setBottomMargin(t.pageConfig.margin.bottom);
                setLeftMargin(t.pageConfig.margin.left);
                setRightMargin(t.pageConfig.margin.right);
              }
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-sky-300 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {BOOK_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                {t.name} ({t.badge.split(' ')[0]} {t.genre})
              </option>
            ))}
          </select>
        </div>

        {/* Paper Size */}
        <div className="space-y-1.5 text-xs">
          <label className="font-medium text-slate-300">Paper Size:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['A4', 'A5', 'Letter'] as PaperSize[]).map((pSize) => (
              <button
                key={pSize}
                onClick={() => setSize(pSize)}
                className={`py-2 rounded-lg border font-mono font-medium transition-all ${
                  size === pSize
                    ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {pSize}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Margins */}
        <div className="space-y-1.5 text-xs">
          <label className="font-medium text-slate-300">Margins (mm):</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-500">Top:</span>
              <input
                type="number"
                value={topMargin}
                onChange={(e) => setTopMargin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Bottom:</span>
              <input
                type="number"
                value={bottomMargin}
                onChange={(e) => setBottomMargin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Left:</span>
              <input
                type="number"
                value={leftMargin}
                onChange={(e) => setLeftMargin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Right:</span>
              <input
                type="number"
                value={rightMargin}
                onChange={(e) => setRightMargin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Header & Footer Text */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-300">Running Header Text:</label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 mt-1"
            />
          </div>
          <div>
            <label className="font-medium text-slate-300">Running Footer Text:</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 mt-1"
            />
          </div>
        </div>

        {/* Structure Toggles */}
        <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
          <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showCoverPage}
              onChange={(e) => setShowCoverPage(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-sky-500"
            />
            <span>Include Cover Page</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={includeTOC}
              onChange={(e) => setIncludeTOC(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-sky-500"
            />
            <span>Generate Table of Contents (TOC)</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 border-t border-slate-800 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
