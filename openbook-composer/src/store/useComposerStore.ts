/**
 * OpenBook Composer - Zustand Application Store
 * Centralized state management for Document IR, Studio UI, AI operations, and Undo/Redo history.
 */

import { create } from 'zustand';
import {
  DocumentIR,
  Block,
  Chapter,
  LayoutMode,
  PaperSize,
  DocumentOperation,
  BookPageConfig
} from '../document/types';
import { SAMPLE_DOCUMENT } from '../document/samples';
import { BOOK_TEMPLATES } from '../document/templates';
import { applyOperations } from '../document/operations';
import { AIProviderConfig, DEFAULT_AI_CONFIG, createLLMProvider } from '../ai/providers';
import { generateTypstCode } from '../renderer/typst-generator';

import { paginateBlocks, findBlockPageIndex } from '../document/pagination';

export function calculatePageIndexForBlock(doc: DocumentIR, chapterId: string, blockId?: string | null): number {
  if (chapterId === 'cover') return 0;
  if (chapterId === 'toc') return doc.document.page.showCoverPage ? 1 : 0;

  let pageOffset = 0;
  if (doc.document.page.showCoverPage) pageOffset++;
  if (doc.document.page.includeTOC) pageOffset++;

  let cumulativePages = pageOffset;

  for (const chapter of doc.chapters) {
    const chapterPages = paginateBlocks(chapter.blocks);

    if (chapter.id === chapterId) {
      if (blockId) {
        const pageWithinChapter = findBlockPageIndex(chapter.blocks, blockId);
        return cumulativePages + pageWithinChapter;
      }
      return cumulativePages;
    }

    cumulativePages += chapterPages.length;
  }

  return 0;
}

interface ComposerState {
  // Document State
  document: DocumentIR;
  activeChapterId: string;
  selectedBlockId: string | null;
  history: DocumentIR[];
  historyIndex: number;

  // Typst & View State
  typstCode: string;
  activeTab: 'studio' | 'editor' | 'typst';
  zoomLevel: number;
  activePageIndex: number;

  // AI Assistant State
  aiConfig: AIProviderConfig;
  aiPrompt: string;
  isAiProcessing: boolean;
  aiLogs: Array<{ id: string; timestamp: string; prompt: string; explanation: string; opsCount: number }>;

  // Document & Project Actions
  createNewProject: (title?: string, author?: string) => void;
  setDocument: (doc: DocumentIR) => void;
  updateBookMetadata: (metadata: Partial<{ title: string; subtitle: string; author: string; edition: string; version: string }>) => void;
  setActiveChapter: (chapterId: string) => void;
  setSelectedBlock: (blockId: string | null) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setBookPageConfig: (config: Partial<BookPageConfig>) => void;
  setChapterHeaderFooter: (chapterId: string, headerText?: string, footerText?: string) => void;
  setActiveTab: (tab: 'studio' | 'editor' | 'typst') => void;
  setZoomLevel: (zoom: number) => void;
  setActivePageIndex: (index: number) => void;
  navigateToChapterOrBlock: (chapterId: string, blockId?: string | null) => void;

  // Block Editing Actions
  addBlock: (chapterId: string, block: Block, afterBlockId?: string) => void;
  updateBlock: (blockId: string, changes: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (blockId: string, direction: 'up' | 'down') => void;
  
  // AI Operations Execution
  setAiConfig: (config: Partial<AIProviderConfig>) => void;
  setAiPrompt: (prompt: string) => void;
  runAiPrompt: (promptText?: string) => Promise<void>;
  applyOperationsList: (ops: DocumentOperation[], explanation?: string) => void;

  // Template & Theme Actions
  applyTemplate: (templateId: string, loadSampleContent?: boolean) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
}

const AI_CONFIG_STORAGE_KEY = 'openbook_ai_config';

function loadStoredAiConfig(): AIProviderConfig {
  try {
    const saved = localStorage.getItem(AI_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_AI_CONFIG, ...parsed };
    }
  } catch {
    // Ignore storage parse error
  }
  return DEFAULT_AI_CONFIG;
}

export const useComposerStore = create<ComposerState>((set, get) => ({
  document: SAMPLE_DOCUMENT,
  activeChapterId: SAMPLE_DOCUMENT.chapters[0]?.id || 'chapter-1',
  selectedBlockId: null,
  history: [SAMPLE_DOCUMENT],
  historyIndex: 0,

  typstCode: generateTypstCode(SAMPLE_DOCUMENT),
  activeTab: 'studio',
  zoomLevel: 100,
  activePageIndex: 0,

  aiConfig: loadStoredAiConfig(),
  aiPrompt: '',
  isAiProcessing: false,
  aiLogs: [],
  createNewProject: (title?: string, author?: string) => {
    const bookTitle = title || 'My New Book';
    const bookAuthor = author || 'Author Name';

    const newDoc: DocumentIR = {
      document: {
        id: 'doc_' + Date.now(),
        title: bookTitle,
        subtitle: 'Created with OpenBook Composer',
        author: bookAuthor,
        edition: '1st Edition',
        version: '1.0.0',
        page: {
          size: 'A4',
          margin: { top: 18, bottom: 18, left: 18, right: 18 },
          showPageNumbers: true,
          headerText: `${bookTitle} — Chapter 1`,
          footerText: 'OpenBook Composer',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'Libertinus Serif',
          bodyFontSize: 10.5,
        },
      },
      layoutMode: 'FLOW',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Chapter 1: Introduction',
          subtitle: 'Getting Started',
          blocks: [
            {
              id: 'b1_' + Date.now(),
              type: 'heading',
              level: 1,
              text: 'Welcome to Your New Book',
              layout: { keep_with_next: true },
            },
            {
              id: 'b2_' + Date.now(),
              type: 'paragraph',
              text: 'Start writing your content here. Use the AI Assistant to co-author chapters or add callout boxes, tables, and quizzes.',
            },
          ],
        },
      ],
    };

    set({
      document: newDoc,
      activeChapterId: 'chapter-1',
      selectedBlockId: null,
      history: [newDoc],
      historyIndex: 0,
      typstCode: generateTypstCode(newDoc),
      activePageIndex: 0,
      aiLogs: [],
    });
  },

  setDocument: (doc) => {
    const typst = generateTypstCode(doc);
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        document: doc,
        typstCode: typst,
        history: [...newHistory, doc],
        historyIndex: newHistory.length,
      };
    });
  },

  updateBookMetadata: (metadata) => {
    const currentDoc = get().document;
    const updatedDoc: DocumentIR = {
      ...currentDoc,
      document: {
        ...currentDoc.document,
        ...metadata,
      },
    };
    get().setDocument(updatedDoc);
  },

  setActiveChapter: (chapterId) => set({ activeChapterId: chapterId, selectedBlockId: null }),

  setSelectedBlock: (blockId) => set({ selectedBlockId: blockId }),

  setActivePageIndex: (index) => set({ activePageIndex: index }),

  navigateToChapterOrBlock: (chapterId, blockId) => {
    const doc = get().document;
    const targetPageIndex = calculatePageIndexForBlock(doc, chapterId, blockId);
    set({
      activeChapterId: chapterId,
      selectedBlockId: blockId || null,
      activePageIndex: targetPageIndex,
      activeTab: 'studio',
    });
  },

  setLayoutMode: (mode) => {
    const doc = { ...get().document, layoutMode: mode };
    get().setDocument(doc);
  },

  applyTemplate: (templateId: string, loadSampleContent = false) => {
    const template = BOOK_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const currentDoc = get().document;
    let updatedDoc: DocumentIR;

    if (loadSampleContent && template.sampleDocument) {
      updatedDoc = {
        ...template.sampleDocument,
        document: {
          ...template.sampleDocument.document,
          id: currentDoc.document.id || template.sampleDocument.document.id,
          page: {
            ...template.pageConfig,
          },
        },
      };
    } else {
      updatedDoc = {
        ...currentDoc,
        document: {
          ...currentDoc.document,
          page: {
            ...currentDoc.document.page,
            ...template.pageConfig,
          },
        },
      };
    }

    get().setDocument(updatedDoc);
  },

  setBookPageConfig: (configChanges) => {
    const currentDoc = get().document;
    const updatedDoc: DocumentIR = {
      ...currentDoc,
      document: {
        ...currentDoc.document,
        page: {
          ...currentDoc.document.page,
          ...configChanges,
        },
      },
    };
    get().setDocument(updatedDoc);
  },

  setChapterHeaderFooter: (chapterId, headerText, footerText) => {
    const currentDoc = get().document;
    const updatedChapters = currentDoc.chapters.map((ch) => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          ...(headerText !== undefined ? { headerText } : {}),
          ...(footerText !== undefined ? { footerText } : {}),
        };
      }
      return ch;
    });
    get().setDocument({ ...currentDoc, chapters: updatedChapters });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

  addBlock: (chapterId, block, afterBlockId) => {
    const op: DocumentOperation = {
      op: 'insert_block',
      chapter_id: chapterId,
      block,
      after_block_id: afterBlockId,
    };
    get().applyOperationsList([op], `Added ${block.type} block`);
  },

  updateBlock: (blockId, changes) => {
    const op: DocumentOperation = {
      op: 'update_block',
      block_id: blockId,
      changes,
    };
    get().applyOperationsList([op], `Updated block`);
  },

  deleteBlock: (blockId) => {
    const op: DocumentOperation = {
      op: 'delete_block',
      block_id: blockId,
    };
    get().applyOperationsList([op], `Deleted block`);
  },

  moveBlock: (blockId, direction) => {
    const doc = get().document;
    let targetChapter: Chapter | undefined;
    let blockIdx = -1;

    for (const ch of doc.chapters) {
      const idx = ch.blocks.findIndex((b) => b.id === blockId);
      if (idx !== -1) {
        targetChapter = ch;
        blockIdx = idx;
        break;
      }
    }

    if (!targetChapter || blockIdx === -1) return;

    const targetIdx = direction === 'up' ? blockIdx - 1 : blockIdx + 1;
    if (targetIdx < 0 || targetIdx >= targetChapter.blocks.length) return;

    const afterId = direction === 'up' ? targetChapter.blocks[targetIdx - 1]?.id : targetChapter.blocks[targetIdx]?.id;

    const op: DocumentOperation = {
      op: 'move_block',
      block_id: blockId,
      after_block_id: afterId,
      target_chapter_id: targetChapter.id,
    };
    get().applyOperationsList([op], `Moved block ${direction}`);
  },

  setAiConfig: (configChanges) =>
    set((state) => {
      const updated = { ...state.aiConfig, ...configChanges };
      try {
        localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage write error
      }
      return { aiConfig: updated };
    }),

  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),

  runAiPrompt: async (promptText) => {
    const query = promptText || get().aiPrompt;
    if (!query.trim()) return;

    set({ isAiProcessing: true });
    try {
      const provider = createLLMProvider(get().aiConfig);

      // Construct multi-turn conversation memory history (last 10 messages)
      const historyMessages = get().aiLogs.slice(-10).flatMap((log) => [
        { role: 'user' as const, content: log.prompt },
        { role: 'assistant' as const, content: log.explanation },
      ]);

      const res = await provider.generate({
        prompt: query,
        document: get().document,
        targetChapterId: get().activeChapterId,
        history: historyMessages,
      });

      if (res.operations && res.operations.length > 0) {
        get().applyOperationsList(res.operations, res.explanation);
      }

      set((state) => ({
        aiPrompt: '',
        aiLogs: [
          ...state.aiLogs,
          {
            id: 'log_' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            prompt: query,
            explanation: res.explanation,
            opsCount: res.operations ? res.operations.length : 0,
          },
        ],
      }));
    } finally {
      set({ isAiProcessing: false });
    }
  },

  applyOperationsList: (ops, explanation) => {
    const { updatedDoc } = applyOperations(get().document, ops);
    const typst = generateTypstCode(updatedDoc);

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        document: updatedDoc,
        typstCode: typst,
        history: [...newHistory, updatedDoc],
        historyIndex: newHistory.length,
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevDoc = history[historyIndex - 1];
      const typst = generateTypstCode(prevDoc);
      set({
        document: prevDoc,
        typstCode: typst,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextDoc = history[historyIndex + 1];
      const typst = generateTypstCode(nextDoc);
      set({
        document: nextDoc,
        typstCode: typst,
        historyIndex: historyIndex + 1,
      });
    }
  },
}));
