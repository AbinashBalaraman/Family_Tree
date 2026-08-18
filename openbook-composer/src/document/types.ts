/**
 * OpenBook Composer - Document IR Types
 * Source of truth for book structure, blocks, and layout intent.
 */

export type PaperSize = 'A4' | 'A5' | 'Letter';
export type LayoutMode = 'FLOW' | 'SMART' | 'FIXED';

export interface PageMargin {
  top: number;    // in mm
  bottom: number; // in mm
  left: number;   // in mm
  right: number;  // in mm
}

export interface BookPageConfig {
  size: PaperSize;
  margin: PageMargin;
  showPageNumbers?: boolean;
  headerText?: string;
  footerText?: string;
  includeTOC?: boolean;
  showCoverPage?: boolean;
  themeFont?: string;
  headingFont?: string;
  bodyFont?: string;
  primaryColor?: string;
  accentColor?: string;
  paperBgColor?: string;
  bodyFontSize?: number; // e.g. 10.5 pt
  themePreset?: 'competitive-blue' | 'academic-emerald' | 'classic-serif' | 'modern-dark' | 'corporate-navy' | 'violet-revision' | 'warm-fiction';
  templateId?: string;
}

export interface TemplatePreset {
  id: string;
  name: string;
  genre: 'exam-prep' | 'academic' | 'fiction' | 'technical' | 'corporate' | 'revision';
  badge: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  paperBgColor: string;
  headingFont: string;
  bodyFont: string;
  previewImage?: string;
  pageConfig: BookPageConfig;
  sampleDocument: DocumentIR;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  author?: string;
  subtitle?: string;
  edition?: string;
  version: string;
  page: BookPageConfig;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'table'
  | 'image'
  | 'equation'
  | 'callout'
  | 'quote'
  | 'page_break'
  | 'spacer'
  | 'horizontal_rule'
  // Competitive exam & innovative blocks
  | 'mcq'
  | 'pyq'
  | 'quick_revision'
  | 'mindmap'
  | 'footnote';

export type CalloutVariant =
  | 'exam-tip'
  | 'important'
  | 'remember'
  | 'common-mistake'
  | 'shortcut'
  | 'formula'
  | 'example'
  | 'note'
  | 'warning'
  | 'summary';

export interface LayoutConstraint {
  keep_with_next?: boolean;
  keep_together?: boolean;
  preferred_width?: string; // e.g. "100%", "80%", "160mm"
  max_width?: string;
  alignment?: 'left' | 'center' | 'right';
  page?: number;            // Fixed target page (for FIXED layout mode)
  priority?: number;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  layout?: LayoutConstraint;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered: boolean;
  items: string[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  columns: string[];
  rows: string[][];
  caption?: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  caption?: string;
  alt?: string;
}

export interface EquationBlock extends BaseBlock {
  type: 'equation';
  expression: string; // LaTeX or Typst format
  caption?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: CalloutVariant;
  title: string;
  text: string;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author?: string;
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page_break';
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  height: string; // e.g. "12pt", "20mm"
}

export interface HorizontalRuleBlock extends BaseBlock {
  type: 'horizontal_rule';
}

export interface MCQOption {
  id: string;
  label: string; // "A", "B", "C", "D"
  text: string;
  isCorrect?: boolean;
}

export interface MCQBlock extends BaseBlock {
  type: 'mcq';
  question: string;
  options: MCQOption[];
  explanation?: string;
}

export interface PYQBlock extends BaseBlock {
  type: 'pyq';
  examName: string; // e.g., "UPSC CSE 2022"
  question: string;
  answerText: string;
}

export interface QuickRevisionBlock extends BaseBlock {
  type: 'quick_revision';
  title: string;
  bulletPoints: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface MindMapBlock extends BaseBlock {
  type: 'mindmap';
  title: string;
  rootNode: MindMapNode;
}

export interface FootnoteBlock extends BaseBlock {
  type: 'footnote';
  number: number;
  term: string;
  citationText: string;
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | ImageBlock
  | EquationBlock
  | CalloutBlock
  | QuoteBlock
  | PageBreakBlock
  | SpacerBlock
  | HorizontalRuleBlock
  | MCQBlock
  | PYQBlock
  | QuickRevisionBlock
  | MindMapBlock
  | FootnoteBlock;

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  headerText?: string;
  footerText?: string;
  blocks: Block[];
}

export interface DocumentIR {
  document: DocumentMetadata;
  chapters: Chapter[];
  layoutMode: LayoutMode;
}

// AI Operations Schema
export type OperationType =
  | 'insert_block'
  | 'delete_block'
  | 'move_block'
  | 'update_block'
  | 'split_block'
  | 'merge_block'
  | 'change_style'
  | 'set_constraint';

export interface InsertBlockOperation {
  op: 'insert_block';
  chapter_id: string;
  block: Block;
  after_block_id?: string;
}

export interface DeleteBlockOperation {
  op: 'delete_block';
  block_id: string;
}

export interface MoveBlockOperation {
  op: 'move_block';
  block_id: string;
  after_block_id?: string;
  target_chapter_id?: string;
}

export interface UpdateBlockOperation {
  op: 'update_block';
  block_id: string;
  changes: Partial<Block>;
}

export interface SplitBlockOperation {
  op: 'split_block';
  block_id: string;
  split_at_index: number;
}

export interface MergeBlockOperation {
  op: 'merge_block';
  block_id_1: string;
  block_id_2: string;
}

export interface ChangeStyleOperation {
  op: 'change_style';
  block_id: string;
  style: Record<string, any>;
}

export interface SetConstraintOperation {
  op: 'set_constraint';
  block_id: string;
  constraint: LayoutConstraint;
}

export type DocumentOperation =
  | InsertBlockOperation
  | DeleteBlockOperation
  | MoveBlockOperation
  | UpdateBlockOperation
  | SplitBlockOperation
  | MergeBlockOperation
  | ChangeStyleOperation
  | SetConstraintOperation;

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMRequest {
  prompt: string;
  document: DocumentIR;
  targetChapterId?: string;
  targetBlockId?: string;
  history?: LLMMessage[];
}

export interface LLMResponse {
  rawResponse: string;
  explanation: string;
  operations: DocumentOperation[];
}
