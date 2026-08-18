import { describe, it, expect } from 'vitest';
import { SAMPLE_DOCUMENT } from '../document/samples';
import { applyOperations } from '../document/operations';
import { generateTypstCode } from '../renderer/typst-generator';
import { DocumentIR, DocumentOperation } from '../document/types';

describe('OpenBook Composer - Document IR & Typst Engine', () => {
  it('should initialize with valid sample document IR', () => {
    expect(SAMPLE_DOCUMENT.document.title).toBe('The Modern Author’s Handbook');
    expect(SAMPLE_DOCUMENT.chapters.length).toBeGreaterThan(0);
  });

  it('should apply insert_block operation correctly', () => {
    const op: DocumentOperation = {
      op: 'insert_block',
      chapter_id: 'chapter-1',
      block: {
        id: 'b_test_1',
        type: 'paragraph',
        text: 'Unit test added paragraph.',
      },
    };

    const { updatedDoc, appliedCount } = applyOperations(SAMPLE_DOCUMENT, [op]);
    expect(appliedCount).toBe(1);
    const chapter1 = updatedDoc.chapters.find((c) => c.id === 'chapter-1');
    const addedBlock = chapter1?.blocks.find((b) => b.id === 'b_test_1');
    expect(addedBlock).toBeDefined();
    expect((addedBlock as any)?.text).toBe('Unit test added paragraph.');
  });

  it('should apply delete_block operation correctly', () => {
    const blockToDelete = SAMPLE_DOCUMENT.chapters[0].blocks[0];
    const op: DocumentOperation = {
      op: 'delete_block',
      block_id: blockToDelete.id,
    };

    const { updatedDoc, appliedCount } = applyOperations(SAMPLE_DOCUMENT, [op]);
    expect(appliedCount).toBe(1);
    const chapter1 = updatedDoc.chapters.find((c) => c.id === 'chapter-1');
    const found = chapter1?.blocks.find((b) => b.id === blockToDelete.id);
    expect(found).toBeUndefined();
  });

  it('should apply move_block operation correctly', () => {
    const ch = SAMPLE_DOCUMENT.chapters[0];
    const blockToMove = ch.blocks[ch.blocks.length - 1];
    const targetAfterBlock = ch.blocks[0];

    const op: DocumentOperation = {
      op: 'move_block',
      block_id: blockToMove.id,
      after_block_id: targetAfterBlock.id,
    };

    const { updatedDoc, appliedCount } = applyOperations(SAMPLE_DOCUMENT, [op]);
    expect(appliedCount).toBe(1);
    const updatedCh = updatedDoc.chapters[0];
    expect(updatedCh.blocks[1].id).toBe(blockToMove.id);
  });

  it('should apply set_constraint operation correctly', () => {
    const targetBlock = SAMPLE_DOCUMENT.chapters[0].blocks[0];
    const op: DocumentOperation = {
      op: 'set_constraint',
      block_id: targetBlock.id,
      constraint: { keep_with_next: true, preferred_width: '90%' },
    };

    const { updatedDoc, appliedCount } = applyOperations(SAMPLE_DOCUMENT, [op]);
    expect(appliedCount).toBe(1);
    const updatedBlock = updatedDoc.chapters[0].blocks[0];
    expect(updatedBlock.layout?.keep_with_next).toBe(true);
    expect(updatedBlock.layout?.preferred_width).toBe('90%');
  });

  it('should generate valid Typst source code from Document IR', () => {
    const typstCode = generateTypstCode(SAMPLE_DOCUMENT);
    expect(typstCode).toContain('#set page(');
    expect(typstCode).toContain('paper: "a4"');
    expect(typstCode).toContain('= Core Principles');
    expect(typstCode).toContain('#table(');
    expect(typstCode).toContain('#block(');
  });

  it('should handle AI conversational chat queries and layout prompts', async () => {
    const { createLLMProvider } = await import('../ai/providers');
    const provider = createLLMProvider({ type: 'ollama', modelId: 'llama3' });

    // 1. General Conversational Query
    const chatRes = await provider.generate({
      prompt: 'Explain the core principles of document composition',
      document: SAMPLE_DOCUMENT,
    });
    expect(chatRes.explanation).toContain('core principles');
    expect(chatRes.explanation.length).toBeGreaterThan(30);

    // 2. Chapter Summary Query
    const summaryRes = await provider.generate({
      prompt: 'Summarize the current chapter with key takeaways',
      document: SAMPLE_DOCUMENT,
    });
    expect(summaryRes.explanation).toContain('Summary');

    // 3. Layout Command Query
    const layoutRes = await provider.generate({
      prompt: 'Make page compact',
      document: SAMPLE_DOCUMENT,
    });
    expect(layoutRes.operations.length).toBeGreaterThan(0);
    expect(layoutRes.operations[0].op).toBe('set_constraint');
  });
});
