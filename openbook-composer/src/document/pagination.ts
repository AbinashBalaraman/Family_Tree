/**
 * OpenBook Composer — Height-Weighted Pagination
 *
 * Estimates each block's rendered height (in approximate CSS px) and packs
 * blocks into pages so that available space is utilised efficiently without
 * overflowing the printable page canvas.
 *
 * Page budget is calibrated against the actual CSS paper canvas:
 *   - Total paper height: 980px
 *   - Margins: 45px top + 45px bottom = 90px
 *   - Header & Footer: ~70px
 *   - Usable content height: ~640px
 */

import { Block } from './types';

// ── Usable content height on one page (CSS px) ──────────────────────
// Calibrated for A4 portrait (297mm height = ~1122px at 96DPI)
// minus margins (top ~68px + bottom ~68px) and header/footer (~94px) => ~892px available.
// Using 850px budget to allow dense packing while preventing page overflow.
const PAGE_BUDGET_PX = 850;

/**
 * Estimate the rendered CSS-pixel height of a single block in the Studio editor and Print output.
 * Accounts for fonts, line wrapping, margins, and padding.
 */
export function estimateBlockHeight(block: Block, templateId?: string): number {
  switch (block.type) {
    case 'heading':
      return block.level === 1 ? 52 : block.level === 2 ? 42 : 32;

    case 'paragraph': {
      const charLen = (block.text || '').length;
      const lines = Math.max(1, Math.ceil(charLen / 80));
      return 8 + lines * 20;
    }

    case 'list': {
      const items = (block as any).items || [];
      return 8 + Math.max(1, items.length) * 20;
    }

    case 'table': {
      const rows = block.rows?.length || 0;
      return 50 + rows * 24 + (block.caption ? 16 : 0);
    }

    case 'equation':
      return 90 + (block.caption ? 16 : 0);

    case 'callout': {
      const textLen = ((block as any).text || '').length;
      const textLines = Math.max(1, Math.ceil(textLen / 80));
      return 46 + textLines * 18;
    }

    case 'mcq': {
      const opts = block.options?.length || 4;
      const questionLen = (block.question || '').length;
      const qLines = Math.max(1, Math.ceil(questionLen / 75));
      const hasExplanation = !!(block as any).explanation;
      const optLines = (templateId === 'exam-coaching-blue') ? Math.ceil(opts / 2) : opts;
      return 48 + qLines * 20 + optLines * 22 + (hasExplanation ? 24 : 0);
    }

    case 'pyq':
      return 86;

    case 'quick_revision': {
      const bullets = (block as any).bulletPoints?.length || 0;
      return 66 + Math.max(1, bullets) * 20;
    }

    case 'quote':
      return 50;

    case 'image':
      return 220;

    case 'page_break':
      return PAGE_BUDGET_PX;

    case 'spacer':
      return 25;

    case 'horizontal_rule':
      return 16;

    case 'mindmap':
      return 160;

    case 'footnote':
      return 52;

    default:
      return 35;
  }
}

/**
 * Split a chapter's blocks into pages based on estimated height.
 * Returns an array of block-arrays, one per page.
 */
export function paginateBlocks(blocks: Block[], templateId?: string): Block[][] {
  if (blocks.length === 0) return [];

  const pages: Block[][] = [];
  let currentPage: Block[] = [];
  let usedHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const h = estimateBlockHeight(block, templateId);

    // Force page break
    if (block.type === 'page_break') {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        usedHeight = 0;
      }
      continue;
    }

    // If adding this block would overflow AND the page isn't empty,
    // start a new page first (or split paragraph if possible).
    if (usedHeight + h > PAGE_BUDGET_PX && currentPage.length > 0) {
      const remainingPx = PAGE_BUDGET_PX - usedHeight;

      // If the block is a paragraph and remaining space fits at least 2 lines (~48px),
      // split the paragraph text at a word boundary to fill the current page completely.
      if (block.type === 'paragraph' && remainingPx >= 48) {
        const text = block.text || '';
        const linesToFit = Math.floor((remainingPx - 8) / 20);
        const approxChars = linesToFit * 80;

        let splitIdx = text.lastIndexOf(' ', approxChars);
        if (splitIdx < 20) {
          splitIdx = text.indexOf(' ', approxChars);
        }

        if (splitIdx > 20 && splitIdx < text.length - 20) {
          const headText = text.substring(0, splitIdx);
          const tailText = text.substring(splitIdx + 1);

          const headBlock: Block = { ...block, text: headText };
          const tailBlock: Block = { ...block, id: `${block.id}_p2`, text: tailText };

          currentPage.push(headBlock);
          pages.push(currentPage);

          currentPage = [tailBlock];
          usedHeight = estimateBlockHeight(tailBlock, templateId);
          continue;
        }
      }

      // Keep-with-next constraint for headings:
      const lastBlock = currentPage[currentPage.length - 1];
      if ((lastBlock?.layout?.keep_with_next || lastBlock?.type === 'heading') && currentPage.length > 1) {
        const pulled = currentPage.pop()!;
        usedHeight -= estimateBlockHeight(pulled, templateId);
        pages.push(currentPage);
        currentPage = [pulled];
        usedHeight = estimateBlockHeight(pulled, templateId);
      } else {
        pages.push(currentPage);
        currentPage = [];
        usedHeight = 0;
      }
    }

    currentPage.push(block);
    usedHeight += h;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

/**
 * Given a chapter's blocks and a target block ID, return the 0-based
 * page index within the chapter where that block appears.
 */
export function findBlockPageIndex(blocks: Block[], blockId: string, templateId?: string): number {
  const pages = paginateBlocks(blocks, templateId);
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].some((b) => b.id === blockId)) {
      return i;
    }
  }
  return 0;
}

