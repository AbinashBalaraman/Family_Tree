/**
 * OpenBook Composer - Default Sample Document IR
 * Demonstrates chapters, headings, tables, callout boxes, equations, MCQs, and layout constraints.
 */

import { DocumentIR } from './types';

export const SAMPLE_DOCUMENT: DocumentIR = {
  document: {
    id: 'doc-master-001',
    title: 'The Modern Author’s Handbook',
    subtitle: 'A Universal Masterclass Template for Textbooks, Reports, and Guides',
    author: 'OpenBook Editorial Board',
    edition: '2026 Edition',
    version: '1.0.0',
    page: {
      size: 'A4',
      margin: {
        top: 18,
        bottom: 18,
        left: 18,
        right: 18,
      },
      showPageNumbers: true,
      headerText: 'The Modern Author’s Handbook — Chapter 1',
      footerText: 'OpenBook Composer | Deterministic Layout Engine',
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
      title: 'Foundations of Modern Knowledge & Composition',
      subtitle: 'Principles of Structured Content, Typography, and Visual Hierarchy',
      blocks: [
        {
          id: 'b1',
          type: 'heading',
          level: 1,
          text: 'Core Principles of Book Composition',
          layout: { keep_with_next: true },
        },
        {
          id: 'b2',
          type: 'paragraph',
          text: 'Structured document composition combines content clarity with deterministic typographic hierarchy. Whether writing a technical textbook, academic research monograph, law treatise, or business guide, establishing a clear visual rhythm ensures maximum reader comprehension.',
        },
        {
          id: 'b3',
          type: 'callout',
          variant: 'exam-tip',
          title: 'Key Takeaway — Visual Hierarchy',
          text: 'Use styled callout blocks for important tips, key takeaways, or critical case studies. Keep headings grouped with their following paragraphs to prevent orphan headers across pages.',
        },
        {
          id: 'b4',
          type: 'heading',
          level: 2,
          text: 'Classification of Document Components',
          layout: { keep_with_next: true },
        },
        {
          id: 'b5',
          type: 'table',
          caption: 'Table 1.1: Core Categories of Book Content Blocks',
          columns: ['Block Type', 'Category', 'Primary Use Case'],
          rows: [
            ['Headings (H1–H3)', 'Structure', 'Section titles, chapter subheadings, and topic boundaries'],
            ['Paragraphs', 'Body Content', 'Main explanatory prose, narrative text, and analysis'],
            ['Callout Boxes', 'Highlights', 'Exam tips, warnings, key definitions, and case studies'],
            ['Data Tables', 'Structured Data', 'Comparative matrices, statistics, and financial summaries'],
            ['Equations', 'Quantitative', 'Mathematical formulas, scientific models, and statistics'],
            ['Quiz & Revision', 'Interactive', 'Multiple Choice Questions (MCQ) and Quick Revision bullet points'],
          ],
          layout: { keep_together: true },
        },
        {
          id: 'b6',
          type: 'callout',
          variant: 'important',
          title: 'Deterministic Page Geometry',
          text: 'In OpenBook Composer, the LLM determines intent and structural semantics, while the Typst layout engine calculates exact physical geometry deterministically.',
        },
        {
          id: 'b7',
          type: 'heading',
          level: 2,
          text: 'Mathematical Models & Quantitative Formulas',
          layout: { keep_with_next: true },
        },
        {
          id: 'b8',
          type: 'paragraph',
          text: 'Scientific and analytical chapters can embed beautifully formatted mathematical equations using KaTeX and Typst syntax:',
        },
        {
          id: 'b9',
          type: 'equation',
          expression: 'E = m c^2 \\quad \\text{and} \\quad Q = \\frac{V}{S + 1} + 1',
          caption: 'Equation 1.1: Fundamental energy-mass equivalence and distribution formula',
        },
        {
          id: 'b10',
          type: 'heading',
          level: 2,
          text: 'Interactive Knowledge Check (MCQ)',
          layout: { keep_with_next: true },
        },
        {
          id: 'b13',
          type: 'mcq',
          question: 'Which design principle ensures that a heading never appears alone at the bottom of a page?',
          options: [
            { id: 'opt1', label: 'A', text: 'Column Spacing' },
            { id: 'opt2', label: 'B', text: 'Keep With Next Constraint', isCorrect: true },
            { id: 'opt3', label: 'C', text: 'Font Rescaling' },
            { id: 'opt4', label: 'D', text: 'Orphan Margin Control' },
          ],
          explanation: 'Setting keep_with_next: true on a heading binds it to the immediately following block, preventing orphan headers.',
        },
        {
          id: 'b14',
          type: 'quick_revision',
          title: 'Quick Revision Snapshot — Chapter Highlights',
          bulletPoints: [
            'Structure documents logically with clear heading hierarchies.',
            'Group related content using callouts, tables, and equations.',
            'Use layout constraints to maintain professional page geometry.',
            'Let AI assist with co-authoring while retaining full manual edit control.',
          ],
        },
        {
          id: 'b15',
          type: 'mindmap',
          title: 'Document Composition Architecture',
          rootNode: {
            id: 'r1',
            label: 'OpenBook Document IR',
            children: [
              { id: 'c1', label: 'Structural Blocks (Headings, Prose)' },
              { id: 'c2', label: 'Interactive Elements (Tables, MCQs)' },
              { id: 'c3', label: 'Layout Engine (Typst PDF/PNG)' },
            ],
          },
        },
        {
          id: 'b16',
          type: 'footnote',
          number: 1,
          term: 'Reference Note',
          citationText: 'OpenBook Composer Architecture Specifications (2026 Edition).',
        },
      ],
    },
    {
      id: 'chapter-2',
      title: 'Advanced Formatting & Publishing Workflows',
      subtitle: 'Export Options, Custom Styling, and Multi-Format Publishing',
      headerText: 'The Modern Author’s Handbook — Chapter 2',
      blocks: [
        {
          id: 'b20',
          type: 'heading',
          level: 1,
          text: 'Publishing Pipelines & Typography',
          layout: { keep_with_next: true },
        },
        {
          id: 'b21',
          type: 'paragraph',
          text: 'From single-column technical monographs to multi-column academic treatises, OpenBook Composer allows authors to seamlessly configure page layout parameters, typographic hierarchies, margins, and paper formats with instant real-time feedback. Built upon a deterministic Intermediate Representation (IR), every structural content block is guaranteed to render with identical visual proportions across studio screen editors, paginated live previews, browser print targets, and Typst vector engines.',
        },
        {
          id: 'b22',
          type: 'callout',
          variant: 'remember',
          title: 'Universal Multi-Format Output',
          text: 'Export finished manuscripts directly to high-resolution print PDF, standalone Typst markup (.typ), structured JSON IR, SVG vector assets, or crisp PNG page images with absolute sub-pixel typographic alignment.',
        },
        {
          id: 'b23',
          type: 'heading',
          level: 2,
          text: 'Multi-Format Export Architecture',
          layout: { keep_with_next: true },
        },
        {
          id: 'b24',
          type: 'paragraph',
          text: 'The dual publishing engine translates structured Document IR schemas into clean, compilable Typst source code or HTML/CSS paged media. By decoupling content semantics from geometric layout calculation, the system guarantees sub-pixel glyph positioning, precise margin enforcement, and consistent widow/orphan suppression across all commercial printing machinery. Authors retain full control over theme fonts, custom headers, running footers, and block-level layout constraints without requiring manual typesetting adjustments.',
        },
        {
          id: 'b25',
          type: 'table',
          caption: 'Table 2.1: Supported Document Export Formats and Characteristics',
          columns: ['Format', 'Engine', 'Best Used For'],
          rows: [
            ['PDF Document', 'Typst / WebPrint', 'Print-ready publishing, archiving, and commercial distribution'],
            ['Typst Source (.typ)', 'Native Typst Compiler', 'Local CLI compilation, LaTeX alternative typesetting'],
            ['JSON IR (.json)', 'OpenBook Core', 'Programmatic manuscript backup and AI pipeline processing'],
          ],
        },
        {
          id: 'b26',
          type: 'heading',
          level: 2,
          text: 'Deterministic Page Budgeting & Paragraph Splitting',
          layout: { keep_with_next: true },
        },
        {
          id: 'b27',
          type: 'paragraph',
          text: 'To achieve zero empty gaps at page boundaries, OpenBook Composer dynamically measures block heights against the physical printable canvas budget. When a detailed prose paragraph approaches the lower margin boundary of a page, the pagination engine automatically calculates word-boundary split points, preserving readability while densely filling every vertical pixel. The head portion of the split paragraph completes the current page without leaving awkward whitespace, while the tail portion seamlessly continues at the top of the next page. This intelligent paragraph splitting mechanism ensures that chapter pages present a polished, professionally typeset appearance identical to traditional high-end publishing houses.',
        },
        {
          id: 'b28',
          type: 'mcq',
          question: 'Which engine compiles openbook manuscripts into high-resolution vector PDF outputs?',
          options: [
            { id: 'o1', label: 'A', text: 'Typst Compiler Engine', isCorrect: true },
            { id: 'o2', label: 'B', text: 'HTML DOM Canvas' },
            { id: 'o3', label: 'C', text: 'Markdown Parser' },
            { id: 'o4', label: 'D', text: 'Plain Text Formatter' },
          ],
          explanation: 'Typst is a modern, fast markup-based typesetting engine designed to generate beautiful PDF documents deterministically.',
        },
        {
          id: 'b29',
          type: 'quick_revision',
          title: 'Publishing Workflow — Checklist Summary',
          bulletPoints: [
            'Verify margin and paper size settings before final print export.',
            'Ensure all headings have keep_with_next enabled to prevent orphan lines.',
            'Review tables and callouts for breakable container properties.',
            'Export Typst source for standalone local CLI compilation.',
          ],
        },
        {
          id: 'b30',
          type: 'footnote',
          number: 2,
          term: 'Publishing Note',
          citationText: 'OpenBook Typesetting Engine Reference Manual, Volume II (2026 Edition).',
        },
      ],
    },
  ],
};
