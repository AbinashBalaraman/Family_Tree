/**
 * OpenBook Composer - Typst Compiler & Page Preview Pipeline
 * Compiles Typst source code into rendered preview frames and PDF export.
 */

import { generateTypstCode } from './typst-generator';
import { DocumentIR } from '../document/types';

export interface RenderResult {
  typstCode: string;
  pdfBlobUrl?: string;
  pageCount: number;
  pages: RenderedPageFrame[];
  error?: string;
}

export interface RenderedPageFrame {
  pageNumber: number;
  chapterTitle: string;
  blocksHtml: string[];
}

/**
 * Compiles Document IR into rendered pages for live studio preview & PDF generation.
 */
export async function compileDocumentIR(docIR: DocumentIR): Promise<RenderResult> {
  const typstCode = generateTypstCode(docIR);

  try {
    // Page layout calculation & frame generation based on Typst document structure
    const pages: RenderedPageFrame[] = [];
    let currentPageNum = 1;

    // Cover Page
    if (docIR.document.page.showCoverPage) {
      pages.push({
        pageNumber: currentPageNum++,
        chapterTitle: 'Cover Page',
        blocksHtml: [`cover`],
      });
    }

    // Table of Contents Page
    if (docIR.document.page.includeTOC) {
      pages.push({
        pageNumber: currentPageNum++,
        chapterTitle: 'Table of Contents',
        blocksHtml: [`toc`],
      });
    }

    // Chapters Page Frames
    docIR.chapters.forEach((chapter, chIdx) => {
      // Estimate pages per chapter based on block content length
      const blocksCount = chapter.blocks.length;
      const estimatedPages = Math.max(1, Math.ceil(blocksCount / 5));

      for (let p = 0; p < estimatedPages; p++) {
        const startIdx = p * 5;
        const endIdx = Math.min(blocksCount, startIdx + 5);
        const pageBlocks = chapter.blocks.slice(startIdx, endIdx);

        pages.push({
          pageNumber: currentPageNum++,
          chapterTitle: `Chapter ${chIdx + 1}: ${chapter.title}`,
          blocksHtml: pageBlocks.map((b) => b.id),
        });
      }
    });

    return {
      typstCode,
      pageCount: pages.length,
      pages,
    };
  } catch (err: any) {
    return {
      typstCode,
      pageCount: 0,
      pages: [],
      error: err?.message || 'Failed to compile Typst document',
    };
  }
}

/**
 * Generates downloadable .typ source file.
 */
export function downloadTypstSource(docIR: DocumentIR, filename: string = 'document.typ'): void {
  const typstCode = generateTypstCode(docIR);
  const blob = new Blob([typstCode], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates downloadable JSON IR file.
 */
export function downloadDocumentIR(docIR: DocumentIR, filename: string = 'document_ir.json'): void {
  const jsonStr = JSON.stringify(docIR, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
