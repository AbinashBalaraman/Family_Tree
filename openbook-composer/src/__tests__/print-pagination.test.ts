import { describe, it, expect } from 'vitest';
import { paginateBlocks, estimateBlockHeight } from '../document/pagination';
import { Block } from '../document/types';
import { SAMPLE_DOCUMENT } from '../document/samples';

describe('OpenBook Composer - Print Document & Pagination Verification', () => {
  it('should return empty page array for chapters with zero blocks (preventing blank pages)', () => {
    const pages = paginateBlocks([]);
    expect(pages).toEqual([]);
  });

  it('should estimate non-zero realistic heights for all block types', () => {
    const sampleBlocks: Block[] = [
      { id: '1', type: 'heading', level: 1, text: 'Test Heading 1' },
      { id: '2', type: 'paragraph', text: 'This is a sample paragraph with several words to test height estimation.' },
      { id: '3', type: 'callout', variant: 'important', title: 'Important Note', text: 'Callout test text' },
      { id: '4', type: 'table', columns: ['Col A', 'Col B'], rows: [['1', '2'], ['3', '4']] },
      { id: '5', type: 'equation', expression: 'E = mc^2' },
      { id: '6', type: 'mcq', question: 'What is 2+2?', options: [{ id: 'o1', label: 'A', text: '4', isCorrect: true }] },
      { id: '7', type: 'pyq', examName: 'GATE 2025', question: 'PYQ Question', answerText: 'Answer' },
      { id: '8', type: 'quick_revision', title: 'Revision', bulletPoints: ['Point 1', 'Point 2'] },
      { id: '9', type: 'footnote', number: 1, term: 'Ref', citationText: 'Citation' },
    ];

    sampleBlocks.forEach((b) => {
      const h = estimateBlockHeight(b);
      expect(h).toBeGreaterThan(0);
    });
  });

  it('should pack blocks densely within budget without overflowing', () => {
    const blocks: Block[] = [];
    for (let i = 0; i < 40; i++) {
      blocks.push({
        id: `para_${i}`,
        type: 'paragraph',
        text: `Paragraph ${i}: Standard text sentence for density testing in print layout engine.`,
      });
    }

    const pages = paginateBlocks(blocks);
    expect(pages.length).toBeGreaterThan(1);

    // Verify every page contains blocks and total blocks match
    const totalPackedBlocks = pages.reduce((sum, p) => sum + p.length, 0);
    expect(totalPackedBlocks).toBe(40);

    // Verify no empty pages were created
    pages.forEach((p) => {
      expect(p.length).toBeGreaterThan(0);
    });
  });

  it('should handle page_break blocks without creating duplicate blank pages', () => {
    const blocks: Block[] = [
      { id: '1', type: 'heading', level: 1, text: 'Chapter Intro' },
      { id: '2', type: 'paragraph', text: 'First page content.' },
      { id: 'pb1', type: 'page_break' },
      { id: '3', type: 'paragraph', text: 'Second page content.' },
      { id: 'pb2', type: 'page_break' },
    ];

    const pages = paginateBlocks(blocks);
    expect(pages.length).toBe(2);
    expect(pages[0].map((b) => b.id)).toEqual(['1', '2']);
    expect(pages[1].map((b) => b.id)).toEqual(['3']);
  });

  it('should preserve keep-with-next constraint for headings', () => {
    // Create paragraphs that fill almost the entire budget, then a heading + paragraph
    const blocks: Block[] = [];
    for (let i = 0; i < 15; i++) {
      blocks.push({
        id: `fill_${i}`,
        type: 'paragraph',
        text: 'Filling paragraph text for page height allocation testing.',
      });
    }
    blocks.push({ id: 'h_target', type: 'heading', level: 2, text: 'Section Heading' });
    blocks.push({ id: 'p_target', type: 'paragraph', text: 'Section content text.' });

    const pages = paginateBlocks(blocks);
    // Find page containing h_target
    const pageIndexWithHeading = pages.findIndex((p) => p.some((b) => b.id === 'h_target'));
    const pageWithHeading = pages[pageIndexWithHeading];
    // Heading and its next block should be on the same page
    expect(pageWithHeading.some((b) => b.id === 'p_target')).toBe(true);
  });

  it('should paginate sample document IR into non-empty pages', () => {
    const chapter1 = SAMPLE_DOCUMENT.chapters[0];
    const pages = paginateBlocks(chapter1.blocks);

    expect(pages.length).toBeGreaterThan(0);
    pages.forEach((page) => {
      expect(page.length).toBeGreaterThan(0);
    });
  });

  it('should verify Chapter 2 sample content fills Page 1 completely with zero empty gaps and paragraph splitting', () => {
    const chapter2 = SAMPLE_DOCUMENT.chapters[1];
    expect(chapter2.id).toBe('chapter-2');

    const pages = paginateBlocks(chapter2.blocks);
    expect(pages.length).toBe(2);

    const page1Blocks = pages[0];
    const page2Blocks = pages[1];

    // Page 1 must end with the head portion of paragraph b27
    const lastPage1Block = page1Blocks[page1Blocks.length - 1];
    expect(lastPage1Block.id).toBe('b27');
    expect(lastPage1Block.type).toBe('paragraph');

    // Page 2 must start with the tail portion of paragraph b27 (id b27_p2)
    const firstPage2Block = page2Blocks[0];
    expect(firstPage2Block.id).toBe('b27_p2');
    expect(firstPage2Block.type).toBe('paragraph');

    // Verify combined text matches original b27 paragraph text exactly
    const originalB27 = chapter2.blocks.find((b) => b.id === 'b27');
    const combinedText = `${(lastPage1Block as any).text} ${(firstPage2Block as any).text}`;
    expect(combinedText).toBe((originalB27 as any).text);

    // Calculate Page 1 fill height density
    const page1Height = page1Blocks.reduce((sum, b) => sum + estimateBlockHeight(b), 0);
    // Page 1 height should fill > 95% of 830px budget (~818px)
    expect(page1Height).toBeGreaterThanOrEqual(800);
    expect(page1Height).toBeLessThanOrEqual(830);
  });

  it('should cleanly split paragraphs at word boundaries when overflowing page budget', () => {
    const overflowParagraph: Block = {
      id: 'p_long',
      type: 'paragraph',
      text: 'First part of paragraph that fills initial space on page 1 cleanly. ' +
        'Middle section of paragraph that crosses page boundary seamlessly without breaking formatting. ' +
        'Final part of paragraph that continues onto the next page smoothly with full text preservation and no dropped words.',
    };

    const initialBlocks: Block[] = [];
    // Add blocks to reach 768px height (leaving 62px remaining on Page 1)
    for (let i = 0; i < 16; i++) {
      initialBlocks.push({
        id: `p_fill_${i}`,
        type: 'paragraph',
        text: 'Filling paragraph text sentence to occupy initial vertical height budget on printable canvas page.',
      });
    }
    initialBlocks.push(overflowParagraph);

    const pages = paginateBlocks(initialBlocks);
    expect(pages.length).toBe(2);

    const splitHead = pages[0][pages[0].length - 1];
    const splitTail = pages[1][0];

    expect(splitHead.id).toBe('p_long');
    expect(splitTail.id).toBe('p_long_p2');
    expect((splitHead as any).text.endsWith(' ')).toBe(false);
    expect(`${(splitHead as any).text} ${(splitTail as any).text}`).toBe(overflowParagraph.text);
  });
});
