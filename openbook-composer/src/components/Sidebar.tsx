import React, { useState } from 'react';
import { useComposerStore } from '../store/useComposerStore';
import { BookOpen, Folder, FileText, Plus, Trash2, ChevronRight, LayoutList } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    document,
    setDocument,
    createNewProject,
    activeChapterId,
    setActiveChapter,
    selectedBlockId,
    navigateToChapterOrBlock
  } = useComposerStore();

  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isAddingChapter, setIsAddingChapter] = useState(false);

  const handlePromptNewProject = () => {
    const title = window.prompt('Enter Title for New Book Project:', 'My New Book');
    if (title === null) return;
    const author = window.prompt('Enter Author Name:', 'Author Name');
    createNewProject(title.trim() || 'My New Book', author?.trim() || 'Author Name');
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newId = 'chapter-' + (document.chapters.length + 1);
    const newChapter = {
      id: newId,
      title: newChapterTitle.trim(),
      blocks: [
        {
          id: 'b_' + Math.random().toString(36).substr(2, 9),
          type: 'heading' as const,
          level: 1 as const,
          text: newChapterTitle.trim(),
        },
        {
          id: 'b_' + Math.random().toString(36).substr(2, 9),
          type: 'paragraph' as const,
          text: 'Start typing chapter content here...',
        },
      ],
    };

    setDocument({
      ...document,
      chapters: [...document.chapters, newChapter],
    });

    setNewChapterTitle('');
    setIsAddingChapter(false);
    navigateToChapterOrBlock(newId);
  };

  const handleDeleteChapter = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.chapters.length <= 1) return; // Keep at least 1 chapter
    const updated = document.chapters.filter((ch) => ch.id !== chapterId);
    setDocument({
      ...document,
      chapters: updated,
    });
    if (activeChapterId === chapterId) {
      navigateToChapterOrBlock(updated[0].id);
    }
  };

  return (
    <aside className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* New Project Action Bar */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950/80">
        <button
          onClick={handlePromptNewProject}
          className="w-full py-1.5 px-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-lg text-xs font-medium transition-all shadow-md flex items-center justify-center space-x-1.5"
          title="Start a new blank book project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Book Project</span>
        </button>
      </div>

      {/* Document Outline Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-200">
          <LayoutList className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Document Outline</span>
        </div>
        <button
          onClick={() => setIsAddingChapter(true)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
          title="Add New Chapter"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Cover Page Node */}
        {document.document.page.showCoverPage !== false && (
          <div className="space-y-1 mb-1">
            <div
              onClick={() => navigateToChapterOrBlock('cover')}
              className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-medium text-slate-200 hover:bg-slate-800/60 transition-all border border-slate-800 bg-slate-900/60"
            >
              <div className="flex items-center space-x-2 truncate">
                <BookOpen className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="font-bold text-sky-300 truncate">Cover Page</span>
              </div>
            </div>

            {/* Nested Cover Page Properties */}
            <div className="ml-4 pl-2 border-l border-slate-800 space-y-0.5 my-1 text-[11px]">
              <div
                onClick={() => navigateToChapterOrBlock('cover')}
                className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer text-slate-300 hover:text-sky-300 hover:bg-slate-800/40 truncate"
              >
                <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                <span className="font-mono text-[10px] text-sky-400 mr-1 flex-shrink-0">[title]</span>
                <span className="truncate font-semibold">{document.document.title}</span>
              </div>

              {document.document.subtitle && (
                <div
                  onClick={() => navigateToChapterOrBlock('cover')}
                  className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer text-slate-400 hover:text-sky-300 hover:bg-slate-800/40 truncate"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-slate-500 mr-1 flex-shrink-0">[subtitle]</span>
                  <span className="truncate italic">{document.document.subtitle}</span>
                </div>
              )}

              {document.document.author && (
                <div
                  onClick={() => navigateToChapterOrBlock('cover')}
                  className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer text-slate-400 hover:text-sky-300 hover:bg-slate-800/40 truncate"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-slate-500 mr-1 flex-shrink-0">[author]</span>
                  <span className="truncate">{document.document.author}</span>
                </div>
              )}

              {document.document.edition && (
                <div
                  onClick={() => navigateToChapterOrBlock('cover')}
                  className="flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer text-slate-400 hover:text-sky-300 hover:bg-slate-800/40 truncate"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  <span className="font-mono text-[10px] text-slate-500 mr-1 flex-shrink-0">[edition]</span>
                  <span className="truncate">{document.document.edition}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table of Contents Node */}
        {document.document.page.includeTOC !== false && (
          <div
            onClick={() => navigateToChapterOrBlock('toc')}
            className="group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer text-xs font-medium text-slate-300 hover:bg-slate-800/60 transition-all mb-1 border border-slate-800/50"
          >
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="font-semibold text-slate-200 truncate">Table of Contents</span>
            </div>
          </div>
        )}

        <div className="border-t border-slate-800 my-1"></div>

        {document.chapters.map((chapter, idx) => {
          const isActive = chapter.id === activeChapterId;
          return (
            <div key={chapter.id} className="space-y-1">
              <div
                onClick={() => navigateToChapterOrBlock(chapter.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="truncate">
                    {idx + 1}. {chapter.title}
                  </span>
                </div>
                {document.chapters.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteChapter(chapter.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Nested Blocks List */}
              {isActive && (
                <div className="ml-4 pl-2 border-l border-slate-800 space-y-0.5 my-1">
                  {chapter.blocks.map((block) => {
                    const isBlockSelected = block.id === selectedBlockId;
                    return (
                      <div
                        key={block.id}
                        onClick={() => navigateToChapterOrBlock(chapter.id, block.id)}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[11px] cursor-pointer truncate transition-colors ${
                          isBlockSelected
                            ? 'bg-slate-800 text-sky-300 font-medium ring-1 ring-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                        <span className="capitalize font-mono text-[10px] text-slate-500 mr-1 flex-shrink-0">
                          [{block.type}]
                        </span>
                        <span className="truncate">
                          {(block as any).text || (block as any).title || (block as any).question || block.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Chapter Modal / Input */}
      {isAddingChapter && (
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <p className="text-[11px] font-medium text-slate-300 mb-1.5">Chapter Title:</p>
          <input
            type="text"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            placeholder="e.g. Fundamental Duties"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 mb-2"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddChapter}
              className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium py-1 rounded transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingChapter(false)}
              className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500">
        Total Chapters: <span className="font-mono text-slate-300">{document.chapters.length}</span>
      </div>
    </aside>
  );
};
