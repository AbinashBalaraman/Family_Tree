/**
 * OpenBook Composer - Document IR Operations Executor
 * Applies validated structured operations to the Document IR without corrupting state.
 */

import {
  DocumentIR,
  DocumentOperation,
  Block,
  Chapter,
  ParagraphBlock
} from './types';

/**
 * Main dispatcher to apply an array of operations safely to a Document IR copy.
 */
export function applyOperations(
  doc: DocumentIR,
  operations: DocumentOperation[]
): { updatedDoc: DocumentIR; appliedCount: number; errors: string[] } {
  // Deep copy document to preserve immutability
  const updatedDoc: DocumentIR = JSON.parse(JSON.stringify(doc));
  let appliedCount = 0;
  const errors: string[] = [];

  for (const op of operations) {
    try {
      const success = applySingleOperation(updatedDoc, op);
      if (success) {
        appliedCount++;
      } else {
        errors.push(`Failed to apply operation: ${op.op}`);
      }
    } catch (err: any) {
      errors.push(`Error executing ${op.op}: ${err?.message || String(err)}`);
    }
  }

  return { updatedDoc, appliedCount, errors };
}

function applySingleOperation(doc: DocumentIR, op: DocumentOperation): boolean {
  switch (op.op) {
    case 'insert_block': {
      let targetChapter = doc.chapters.find((c) => c.id === op.chapter_id);
      if (!targetChapter) {
        targetChapter = doc.chapters[0];
      }
      if (!targetChapter) return false;

      if (!op.block.id) {
        op.block.id = 'b_' + Math.random().toString(36).substr(2, 9);
      }

      if (op.after_block_id) {
        const idx = targetChapter.blocks.findIndex((b) => b.id === op.after_block_id);
        if (idx !== -1) {
          targetChapter.blocks.splice(idx + 1, 0, op.block);
          return true;
        }
      }
      targetChapter.blocks.push(op.block);
      return true;
    }

    case 'delete_block': {
      for (const ch of doc.chapters) {
        const idx = ch.blocks.findIndex((b) => b.id === op.block_id);
        if (idx !== -1) {
          ch.blocks.splice(idx, 1);
          return true;
        }
      }
      return false;
    }

    case 'move_block': {
      let foundBlock: Block | null = null;
      let sourceChapter: Chapter | null = null;
      let sourceIdx = -1;

      for (const ch of doc.chapters) {
        const idx = ch.blocks.findIndex((b) => b.id === op.block_id);
        if (idx !== -1) {
          foundBlock = ch.blocks[idx];
          sourceChapter = ch;
          sourceIdx = idx;
          break;
        }
      }

      if (!foundBlock || !sourceChapter) return false;

      // Remove from source
      sourceChapter.blocks.splice(sourceIdx, 1);

      // Find target chapter
      const targetChapter = op.target_chapter_id
        ? doc.chapters.find((ch) => ch.id === op.target_chapter_id) || sourceChapter
        : sourceChapter;

      if (op.after_block_id) {
        const afterIdx = targetChapter.blocks.findIndex((b) => b.id === op.after_block_id);
        if (afterIdx !== -1) {
          targetChapter.blocks.splice(afterIdx + 1, 0, foundBlock);
          return true;
        }
      }
      targetChapter.blocks.push(foundBlock);
      return true;
    }

    case 'update_block': {
      for (const ch of doc.chapters) {
        const block = ch.blocks.find((b) => b.id === op.block_id);
        if (block) {
          Object.assign(block, op.changes);
          return true;
        }
      }
      return false;
    }

    case 'split_block': {
      for (const ch of doc.chapters) {
        const idx = ch.blocks.findIndex((b) => b.id === op.block_id);
        if (idx !== -1) {
          const targetBlock = ch.blocks[idx];
          if (targetBlock.type === 'paragraph') {
            const fullText = targetBlock.text;
            const splitIdx = Math.max(0, Math.min(op.split_at_index, fullText.length));
            const part1 = fullText.slice(0, splitIdx).trim();
            const part2 = fullText.slice(splitIdx).trim();

            targetBlock.text = part1;
            const newBlock: ParagraphBlock = {
              id: 'b_' + Math.random().toString(36).substr(2, 9),
              type: 'paragraph',
              text: part2,
              layout: targetBlock.layout ? { ...targetBlock.layout } : undefined,
            };
            ch.blocks.splice(idx + 1, 0, newBlock);
            return true;
          }
        }
      }
      return false;
    }

    case 'merge_block': {
      for (const ch of doc.chapters) {
        const idx1 = ch.blocks.findIndex((b) => b.id === op.block_id_1);
        const idx2 = ch.blocks.findIndex((b) => b.id === op.block_id_2);
        if (idx1 !== -1 && idx2 !== -1) {
          const b1 = ch.blocks[idx1];
          const b2 = ch.blocks[idx2];
          if (b1.type === 'paragraph' && b2.type === 'paragraph') {
            b1.text = `${b1.text} ${b2.text}`;
            ch.blocks.splice(idx2, 1);
            return true;
          }
        }
      }
      return false;
    }

    case 'change_style': {
      for (const ch of doc.chapters) {
        const block = ch.blocks.find((b) => b.id === op.block_id);
        if (block) {
          if (!block.layout) block.layout = {};
          Object.assign(block.layout, op.style);
          return true;
        }
      }
      return false;
    }

    case 'set_constraint': {
      for (const ch of doc.chapters) {
        const block = ch.blocks.find((b) => b.id === op.block_id);
        if (block) {
          block.layout = {
            ...(block.layout || {}),
            ...op.constraint,
          };
          return true;
        }
      }
      return false;
    }

    default:
      return false;
  }
}
