import { describe, it, expect } from 'vitest';
import { BOOK_TEMPLATES } from '../document/templates';
import { useComposerStore } from '../store/useComposerStore';

describe('OpenBook Composer - Book Templates & Themes System', () => {
  it('should contain 6 predefined professional genre templates', () => {
    expect(BOOK_TEMPLATES.length).toBe(6);
    const genres = BOOK_TEMPLATES.map((t) => t.genre);
    expect(genres).toContain('exam-prep');
    expect(genres).toContain('academic');
    expect(genres).toContain('fiction');
    expect(genres).toContain('technical');
    expect(genres).toContain('corporate');
    expect(genres).toContain('revision');
  });

  it('should apply template theme without replacing current document text', () => {
    const store = useComposerStore.getState();
    const originalTitle = store.document.document.title;

    store.applyTemplate('fiction-garamond-parchment', false);

    const updated = useComposerStore.getState().document;
    expect(updated.document.title).toBe(originalTitle);
    expect(updated.document.page.templateId).toBe('fiction-garamond-parchment');
    expect(updated.document.page.headingFont).toBe('Playfair Display, Georgia, serif');
  });

  it('should load full template sample document when requested', () => {
    const store = useComposerStore.getState();

    store.applyTemplate('academic-tufte-emerald', true);

    const updated = useComposerStore.getState().document;
    expect(updated.document.page.templateId).toBe('academic-tufte-emerald');
    expect(updated.document.title).toBe('Foundations of Advanced Theoretical Knowledge');
  });
});
