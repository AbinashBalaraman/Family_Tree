import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { BOOK_TEMPLATES } from '../document/templates';
import { X, Check, BookOpen, Palette, Sparkles, Sliders, Type, ZoomIn, CheckCircle2 } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({ isOpen, onClose }) => {
  const { document, applyTemplate } = useComposerStore();
  const activeTemplateId = document.document.page.templateId || 'exam-coaching-blue';

  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(activeTemplateId);
  const [loadSampleMode, setLoadSampleMode] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null);

  if (!isOpen) return null;

  const filteredTemplates = selectedGenre === 'all'
    ? BOOK_TEMPLATES
    : BOOK_TEMPLATES.filter((t) => t.genre === selectedGenre);

  const handleApply = (templateId: string, loadSample: boolean) => {
    applyTemplate(templateId, loadSample);
    const t = BOOK_TEMPLATES.find((x) => x.id === templateId);
    setAppliedNotification(`Applied "${t?.name}" ${loadSample ? 'with sample document' : 'theme & fonts'}!`);
    setTimeout(() => {
      setAppliedNotification(null);
      onClose();
    }, 1200);
  };

  const handleImageError = (templateId: string) => {
    setFailedImages((prev) => ({ ...prev, [templateId]: true }));
  };

  const currentSelectedTemplate = BOOK_TEMPLATES.find((t) => t.id === selectedTemplateId) || BOOK_TEMPLATES[0];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>Select Book Template & Theme</span>
                  <span className="text-[10px] font-mono uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">
                    6 Presets
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Click any template card or use the quick action buttons below to apply the theme instantly.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Applied Notification Banner */}
          {appliedNotification && (
            <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 flex items-center space-x-2 text-emerald-300 text-xs font-semibold animate-in fade-in slide-in-from-top-2 shrink-0">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{appliedNotification}</span>
            </div>
          )}

          {/* Genre Category Filter Pills */}
          <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center space-x-2 overflow-x-auto text-xs scrollbar-thin shrink-0">
            <span className="text-slate-500 font-mono text-[11px] uppercase mr-2 flex items-center space-x-1 shrink-0">
              <Sliders className="w-3 h-3" />
              <span>Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Templates' },
              { id: 'exam-prep', label: '🏆 Exam Prep' },
              { id: 'academic', label: '🎓 Academic' },
              { id: 'fiction', label: '📖 Literature & Novel' },
              { id: 'technical', label: '💻 Tech & Eng' },
              { id: 'corporate', label: '📊 Corporate Report' },
              { id: 'revision', label: '⚡ Revision Sheet' },
            ].map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
                  selectedGenre === genre.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>

          {/* Templates Scrollable Grid Container */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-950/70 min-h-0">
            {filteredTemplates.map((template) => {
              const isCurrentActive = activeTemplateId === template.id;
              const isSelected = selectedTemplateId === template.id;
              const isImgFailed = failedImages[template.id];

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`group relative rounded-xl border transition-all flex flex-col bg-slate-900 overflow-hidden shadow-lg cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 ring-4 ring-sky-500/30 shadow-sky-950/60 bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  }`}
                >
                  {/* Card Header Color Ribbon */}
                  <div
                    className="h-1.5 w-full shrink-0"
                    style={{ backgroundColor: template.primaryColor }}
                  />

                  {/* Visual Preview Image Container (A4 aspect ratio 1:1.414) */}
                  <div className="relative w-full aspect-[1/1.414] overflow-hidden bg-slate-950 border-b border-slate-800 shrink-0 flex items-center justify-center p-0 group/img bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px]">
                    {template.previewImage && !isImgFailed ? (
                      <>
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          onError={() => handleImageError(template.id)}
                          className="w-full h-full object-cover group-hover/img:scale-[1.03] transition-transform duration-300"
                        />
                        {/* Small explicit zoom button in top-left corner */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (template.previewImage) {
                              setZoomedImage({ url: template.previewImage, name: template.name });
                            }
                          }}
                          className="absolute top-2.5 left-2.5 p-1.5 bg-slate-900/90 hover:bg-sky-600 text-slate-300 hover:text-white rounded-lg border border-slate-700 shadow-md transition-all z-20 flex items-center space-x-1 text-[11px] font-medium"
                          title="Enlarge preview image"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>
                      </>
                    ) : (
                      /* Fallback Banner */
                      <div
                        className="w-full h-full flex flex-col justify-between p-4 relative rounded"
                        style={{
                          background: `linear-gradient(135deg, ${template.primaryColor}dd 0%, #0f172a 100%)`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono uppercase bg-slate-950/60 text-white px-2 py-0.5 rounded border border-white/10">
                            {template.genre}
                          </span>
                          <Palette className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white tracking-tight drop-shadow">
                            {template.name}
                          </div>
                          <div className="text-xs text-white/80 font-mono mt-0.5">
                            {template.headingFont.split(',')[0]} + {template.bodyFont.split(',')[0]}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Active/Selected Badge */}
                    {isSelected && (
                      <span className="absolute top-3 right-3 flex items-center space-x-1 text-[10px] font-bold text-white bg-sky-600 px-3 py-1 rounded-full shadow-lg border border-sky-400/40 z-10 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected Template</span>
                      </span>
                    )}

                    {isCurrentActive && !isSelected && (
                      <span className="absolute top-3 right-3 flex items-center space-x-1 text-[10px] font-bold text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700 z-10">
                        <span>Current Active</span>
                      </span>
                    )}
                  </div>

                  {/* Card Main Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {template.genre}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                        {template.name}
                      </h3>
                      <p className="text-[11px] text-amber-400 font-medium">{template.badge}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Typography & Colors Specs Container */}
                    <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center space-x-1 text-slate-400">
                          <Type className="w-3 h-3 text-sky-400" />
                          <span>Fonts:</span>
                        </span>
                        <span
                          className="font-mono text-slate-200 truncate max-w-[160px]"
                          title={`${template.headingFont} / ${template.bodyFont}`}
                        >
                          {template.headingFont.split(',')[0]} / {template.bodyFont.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center space-x-1 text-slate-400">
                          <Palette className="w-3 h-3 text-emerald-400" />
                          <span>Colors:</span>
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                            style={{ backgroundColor: template.primaryColor }}
                            title={`Primary: ${template.primaryColor}`}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                            style={{ backgroundColor: template.accentColor }}
                            title={`Accent: ${template.accentColor}`}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                            style={{ backgroundColor: template.paperBgColor }}
                            title={`Paper: ${template.paperBgColor}`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                        <span>Paper: <strong className="text-slate-200">{template.pageConfig.size}</strong></span>
                        <span>Margins: <strong className="text-slate-200">{template.pageConfig.margin.top}mm</strong></span>
                      </div>
                    </div>

                    {/* Actions (Always visible at card bottom) */}
                    <div className="pt-3 grid grid-cols-2 gap-2 mt-auto border-t border-slate-800/80">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(template.id);
                          handleApply(template.id, false);
                        }}
                        className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                        title="Apply theme colors, font pairings, and page margins to your current document without erasing text"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Select & Apply Theme</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(template.id);
                          handleApply(template.id, true);
                        }}
                        className="py-2.5 px-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-500 hover:to-indigo-500 shadow-md flex items-center justify-center space-x-1 transition-all"
                        title="Load full template with sample chapters, headings, tables, callouts, and MCQs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Load Sample</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Bottom Bar with Selected Template Action */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center space-x-2">
                  <span>Selected: {currentSelectedTemplate.name}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                    {currentSelectedTemplate.genre}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-3 mt-0.5">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="templateMode"
                      checked={!loadSampleMode}
                      onChange={() => setLoadSampleMode(false)}
                      className="text-sky-500 focus:ring-sky-500"
                    />
                    <span>Keep my text & apply theme</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="templateMode"
                      checked={loadSampleMode}
                      onChange={() => setLoadSampleMode(true)}
                      className="text-sky-500 focus:ring-sky-500"
                    />
                    <span>Load sample book structure</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(selectedTemplateId, loadSampleMode)}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center space-x-3 z-10">
            <span className="text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
              {zoomedImage.name} (Full Page Preview)
            </span>
            <button
              onClick={() => setZoomedImage(null)}
              className="p-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="max-w-4xl max-h-[88vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </>
  );
};
