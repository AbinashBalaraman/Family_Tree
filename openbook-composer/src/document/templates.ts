/**
 * OpenBook Composer - Professional Book Templates & Themes Registry
 * Predefined genre templates with curated font pairings, color palettes, margin geometries, and block presets.
 */

import { TemplatePreset } from './types';
import { SAMPLE_DOCUMENT } from './samples';

import imgExamCoaching from '../assets/templates/exam-coaching-blue.jpg';
import imgAcademicTufte from '../assets/templates/academic-tufte-emerald.jpg';
import imgFictionGaramond from '../assets/templates/fiction-garamond-parchment.jpg';
import imgTechnicalEngineering from '../assets/templates/technical-engineering-indigo.jpg';
import imgCorporateExecutive from '../assets/templates/corporate-executive-slate.jpg';
import imgQuickRevision from '../assets/templates/quick-revision-violet.jpg';

export const BOOK_TEMPLATES: TemplatePreset[] = [
  {
    id: 'exam-coaching-blue',
    name: 'Competitive Exam & Coaching Guide',
    genre: 'exam-prep',
    badge: '🏆 Bestseller for Quiz & Entrance Exams',
    description: 'High-density A4 layout tailored for entrance test prep, competitive exams, question banks, and coaching institute materials.',
    primaryColor: '#1e3a8a',
    accentColor: '#d97706',
    paperBgColor: '#ffffff',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Roboto, sans-serif',
    previewImage: imgExamCoaching,
    pageConfig: {
      size: 'A4',
      margin: { top: 15, bottom: 15, left: 15, right: 15 },
      showPageNumbers: true,
      headerText: 'Competitive Exam Masterclass — Chapter 1',
      footerText: 'OpenBook Coaching Series | Practice & Revision',
      includeTOC: true,
      showCoverPage: true,
      themeFont: 'Roboto, sans-serif',
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      primaryColor: '#1e3a8a',
      accentColor: '#d97706',
      paperBgColor: '#ffffff',
      themePreset: 'competitive-blue',
      templateId: 'exam-coaching-blue',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Mastering Competitive Entrance Examinations',
        subtitle: 'Comprehensive MCQ Bank, Exam Tips, and Quick Revision Snapshots',
        author: 'National Exam Preparation Board',
        edition: '2026 Ultimate Edition',
        page: {
          size: 'A4',
          margin: { top: 15, bottom: 15, left: 15, right: 15 },
          showPageNumbers: true,
          headerText: 'Competitive Exam Masterclass — Chapter 1',
          footerText: 'OpenBook Coaching Series | Practice & Revision',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'Roboto, sans-serif',
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'Roboto, sans-serif',
          primaryColor: '#1e3a8a',
          accentColor: '#d97706',
          paperBgColor: '#ffffff',
          themePreset: 'competitive-blue',
          templateId: 'exam-coaching-blue',
        },
      },
      chapters: [
        {
          id: 'ch-exam-1',
          title: 'Quantitative Aptitude & Entrance MCQs',
          headerText: 'Quantitative Aptitude — Chapter 1',
          footerText: 'Competitive Coaching Guide',
          blocks: [
            { id: 'b-ex-1', type: 'heading', level: 1, text: '1. Quantitative Aptitude & Entrance MCQs' },
            { id: 'b-ex-2', type: 'callout', variant: 'exam-tip', title: '💡 Exam Tip: Quadratic Formula Shortcut', text: 'When b² - 4ac = 0, roots are real and equal. Discriminant D determines nature of roots without full calculation.' },
            { id: 'b-ex-3', type: 'mcq', question: 'Q1. If x + (1/x) = 5, what is the value of x² + (1/x²)?', options: [{ id: 'o1', label: 'A', text: '23', isCorrect: true }, { id: 'o2', label: 'B', text: '25' }, { id: 'o3', label: 'C', text: '27' }, { id: 'o4', label: 'D', text: '21' }], explanation: 'x² + 1/x² = (x + 1/x)² - 2 = 25 - 2 = 23.' },
            { id: 'b-ex-4', type: 'mcq', question: 'Q2. Which Article of the Constitution cannot be suspended during National Emergency?', options: [{ id: 'o5', label: 'A', text: 'Article 19' }, { id: 'o6', label: 'B', text: 'Article 20 & 21', isCorrect: true }, { id: 'o7', label: 'C', text: 'Article 14' }, { id: 'o8', label: 'D', text: 'Article 32' }], explanation: 'Articles 20 & 21 (protection of life and personal liberty) cannot be suspended even during an emergency.' },
            { id: 'b-ex-5', type: 'quick_revision', title: '⚡ 1-Minute Formula Snapshot', bulletPoints: ['(a + b)² = a² + 2ab + b²', 'Speed = Distance / Time', 'Simple Interest = (P × R × T) / 100', 'Compound Interest A = P(1 + r/n)^(nt)'] },
            { id: 'b-ex-6', type: 'table', caption: 'Table 1.1: Core Formulas & Time Complexity', columns: ['Topic', 'Standard Formula', 'Time Complexity'], rows: [['Quadratic Roots', 'x = (-b ± √D) / 2a', 'O(1)'], ['Binary Search', 'mid = low + (high-low)/2', 'O(log N)'], ['Compound Interest', 'A = P(1+R/100)^N', 'O(1)']] }
          ]
        }
      ]
    },
  },
  {
    id: 'academic-tufte-emerald',
    name: 'Academic Monograph & Research Paper',
    genre: 'academic',
    badge: '🎓 University Press & Tufte Layout',
    description: 'Classic academic layout featuring wide outer margins for footnotes, citations, proof boxes, equations, and formal typography.',
    primaryColor: '#047857',
    accentColor: '#65a30d',
    paperBgColor: '#fafafa',
    headingFont: 'Libertinus Serif, Georgia, serif',
    bodyFont: 'Libertinus Serif, Georgia, serif',
    previewImage: imgAcademicTufte,
    pageConfig: {
      size: 'A4',
      margin: { top: 20, bottom: 20, left: 18, right: 25 },
      showPageNumbers: true,
      headerText: 'Academic Research Series — Vol. 12',
      footerText: 'University Press | Deterministic Layout Engine',
      includeTOC: true,
      showCoverPage: true,
      themeFont: 'Libertinus Serif, Georgia, serif',
      headingFont: 'Libertinus Serif, Georgia, serif',
      bodyFont: 'Libertinus Serif, Georgia, serif',
      primaryColor: '#047857',
      accentColor: '#65a30d',
      paperBgColor: '#fafafa',
      themePreset: 'academic-emerald',
      templateId: 'academic-tufte-emerald',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Foundations of Advanced Theoretical Knowledge',
        subtitle: 'An Academic Treatise on Systemic Structure, Logic, and Proofs',
        author: 'Prof. E. R. Tufte & Editorial Research Committee',
        edition: '2026 Academic Edition',
        page: {
          size: 'A4',
          margin: { top: 20, bottom: 20, left: 18, right: 25 },
          showPageNumbers: true,
          headerText: 'Academic Research Series — Vol. 12',
          footerText: 'University Press | Deterministic Layout Engine',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'Libertinus Serif, Georgia, serif',
          headingFont: 'Libertinus Serif, Georgia, serif',
          bodyFont: 'Libertinus Serif, Georgia, serif',
          primaryColor: '#047857',
          accentColor: '#65a30d',
          paperBgColor: '#fafafa',
          themePreset: 'academic-emerald',
          templateId: 'academic-tufte-emerald',
        },
      },
      chapters: [
        {
          id: 'ch-acad-1',
          title: 'Axiomatic Systems and Theoretical Proofs',
          headerText: 'Theoretical Monograph — Chapter 1',
          footerText: 'University Press Academic Series',
          blocks: [
            { id: 'b-ac-1', type: 'heading', level: 1, text: '1. Axiomatic Principles and Mathematical Proofs' },
            { id: 'b-ac-2', type: 'paragraph', text: 'In formal logic, an axiomatic system consists of any set of axioms from which some or all axioms can be used in conjunction to logically derive theorems. A formal proof is a finite sequence of sentences, each of which is an axiom or follows from the preceding sentences in the sequence.' },
            { id: 'b-ac-3', type: 'callout', variant: 'remember', title: 'Theorem 1.1 (Gödel Incompleteness)', text: 'Any consistent formal system F within which a certain amount of elementary arithmetic can be carried out is incomplete. That is, there are statements which can neither be proved nor disproved in F.' },
            { id: 'b-ac-4', type: 'equation', expression: 'E = m c^2 \\quad \\text{and} \\quad \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}', caption: 'Equation 1.1: Relativistic Energy & Gaussian Integral' },
            { id: 'b-ac-5', type: 'footnote', number: 1, term: 'Formal Proof', citationText: 'Tufte, E. R. (2001). The Visual Display of Quantitative Information. Graphics Press.' }
          ]
        }
      ]
    },
  },
  {
    id: 'fiction-garamond-parchment',
    name: 'Classic Literature & Fiction Novel',
    genre: 'fiction',
    badge: '📖 Elegant Novel & Prose Edition',
    description: 'Warm parchment paper aesthetic with Garamond serif typography, wide margins, centered headings, and drop cap styling.',
    primaryColor: '#9f1239',
    accentColor: '#b45309',
    paperBgColor: '#fffbeb',
    headingFont: 'Playfair Display, Georgia, serif',
    bodyFont: 'EB Garamond, Georgia, serif',
    previewImage: imgFictionGaramond,
    pageConfig: {
      size: 'A5',
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
      showPageNumbers: true,
      headerText: 'The Author’s Library Edition',
      footerText: 'Classic Literary Collection',
      includeTOC: true,
      showCoverPage: true,
      themeFont: 'EB Garamond, Georgia, serif',
      headingFont: 'Playfair Display, Georgia, serif',
      bodyFont: 'EB Garamond, Georgia, serif',
      primaryColor: '#9f1239',
      accentColor: '#b45309',
      paperBgColor: '#fffbeb',
      themePreset: 'warm-fiction',
      templateId: 'fiction-garamond-parchment',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Chronicles of the Great Horizon',
        subtitle: 'A Modern Novel in Three Volumes',
        author: 'Alexander V. Sterling',
        edition: 'First Deluxe Edition',
        page: {
          size: 'A5',
          margin: { top: 20, bottom: 20, left: 20, right: 20 },
          showPageNumbers: true,
          headerText: 'The Author’s Library Edition',
          footerText: 'Classic Literary Collection',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'EB Garamond, Georgia, serif',
          headingFont: 'Playfair Display, Georgia, serif',
          bodyFont: 'EB Garamond, Georgia, serif',
          primaryColor: '#9f1239',
          accentColor: '#b45309',
          paperBgColor: '#fffbeb',
          themePreset: 'warm-fiction',
          templateId: 'fiction-garamond-parchment',
        },
      },
      chapters: [
        {
          id: 'ch-fict-1',
          title: 'Chapter I: The Departure at Dawn',
          headerText: 'Chronicles of the Great Horizon',
          footerText: 'Volume I — Chapter I',
          blocks: [
            { id: 'b-fi-1', type: 'heading', level: 1, text: 'Chapter I: The Departure at Dawn' },
            { id: 'b-fi-2', type: 'paragraph', text: 'T he morning sun climbed slowly above the jagged ridge of Oakhaven, painting the valley in streaks of burnt amber and soft gold. Lord Alistair stood at the edge of the parapet, his heavy wool cloak billowing in the crisp mountain breeze as he surveyed the silent kingdom below.' },
            { id: 'b-fi-3', type: 'callout', variant: 'summary', title: 'The Oakhaven Epigraph', text: '“We do not choose the winds that blow across the turbulent sea, but we alone decide how to trim our sails when the storm arrives.”' },
            { id: 'b-fi-4', type: 'paragraph', text: 'Below in the courtyard, horses stamped their hooves against the wet cobblestones. Pack mules loaded with leather bound maps and iron-rimmed chests lined the narrow alleyway, awaiting the commander’s final nod.' },
            { id: 'b-fi-5', type: 'paragraph', text: '• • •' },
            { id: 'b-fi-6', type: 'paragraph', text: 'By noon, the expedition had crossed the stone bridge of Elldale. Silence settled over the column, save for the rhythmic clattering of armor and the distant call of mountain eagles.' }
          ]
        }
      ]
    },
  },
  {
    id: 'technical-engineering-indigo',
    name: 'Technical & Engineering Handbook',
    genre: 'technical',
    badge: '💻 Code, Math & Systems Architecture',
    description: 'Clean modern sans-serif template tailored for software documentation, engineering handbooks, math formulas, and code blocks.',
    primaryColor: '#3730a3',
    accentColor: '#0891b2',
    paperBgColor: '#ffffff',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    previewImage: imgTechnicalEngineering,
    pageConfig: {
      size: 'A4',
      margin: { top: 18, bottom: 18, left: 18, right: 18 },
      showPageNumbers: true,
      headerText: 'Systems Architecture Handbook — Ch. 1',
      footerText: 'OpenBook Tech Series | Specifications',
      includeTOC: true,
      showCoverPage: true,
      themeFont: 'Inter, sans-serif',
      headingFont: 'Plus Jakarta Sans, sans-serif',
      bodyFont: 'Inter, sans-serif',
      primaryColor: '#3730a3',
      accentColor: '#0891b2',
      paperBgColor: '#ffffff',
      themePreset: 'modern-dark',
      templateId: 'technical-engineering-indigo',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Distributed Systems & Software Engineering',
        subtitle: 'A Modern Technical Handbook for Engineers and Architects',
        author: 'OpenBook Engineering Group',
        edition: '2026 Tech Edition',
        page: {
          size: 'A4',
          margin: { top: 18, bottom: 18, left: 18, right: 18 },
          showPageNumbers: true,
          headerText: 'Systems Architecture Handbook — Ch. 1',
          footerText: 'OpenBook Tech Series | Specifications',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'Inter, sans-serif',
          headingFont: 'Plus Jakarta Sans, sans-serif',
          bodyFont: 'Inter, sans-serif',
          primaryColor: '#3730a3',
          accentColor: '#0891b2',
          paperBgColor: '#ffffff',
          themePreset: 'modern-dark',
          templateId: 'technical-engineering-indigo',
        },
      },
      chapters: [
        {
          id: 'ch-tech-1',
          title: 'High-Throughput Microservice Architecture',
          headerText: 'Systems Architecture — Chapter 1',
          footerText: 'Technical Engineering Series',
          blocks: [
            { id: 'b-tc-1', type: 'heading', level: 1, text: '1. High-Throughput Event-Driven Microservices' },
            { id: 'b-tc-2', type: 'paragraph', text: 'Event-driven architectures decouple producers from consumers using high-performance message brokers (Kafka/NATS), enabling horizontal scalability and sub-millisecond event streaming.' },
            { id: 'b-tc-3', type: 'callout', variant: 'shortcut', title: '⚡ Performance Best Practice: TCP Connections', text: 'Always configure zero-copy I/O and TCP_NODELAY on gRPC connection pools to eliminate Nagle algorithm buffering delays.' },
            { id: 'b-tc-4', type: 'paragraph', text: '```typescript\ninterface EventPayload {\n  eventId: string;\n  timestamp: number;\n  ack: boolean;\n}\n\nasync function dispatchEvent(event: EventPayload): Promise<void> {\n  await broker.publish("events.v1", JSON.stringify(event));\n}\n```' },
            { id: 'b-tc-5', type: 'mindmap', title: 'Distributed System Resilience Tree', rootNode: { id: 'r1', label: 'Event Engine', children: [{ id: 'c1', label: 'Kafka Broker' }, { id: 'c2', label: 'Redis Cache' }, { id: 'c3', label: 'gRPC Gateway' }] } },
            { id: 'b-tc-6', type: 'equation', expression: 'L = \\lambda \\cdot W \\quad \\text{(Little\'s Law for Queueing Capacity)}', caption: 'Equation 1.2: Queue Capacity' }
          ]
        }
      ]
    },
  },
  {
    id: 'corporate-executive-slate',
    name: 'Executive & Corporate Report',
    genre: 'corporate',
    badge: '📊 Business Case & Annual Report',
    description: 'Sleek executive corporate design with bold headers, slate navy branding, key metric tables, and executive summaries.',
    primaryColor: '#0f172a',
    accentColor: '#0284c7',
    paperBgColor: '#ffffff',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    previewImage: imgCorporateExecutive,
    pageConfig: {
      size: 'A4',
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
      showPageNumbers: true,
      headerText: 'Strategic Corporate Report 2026',
      footerText: 'Executive Board | Confidential Briefing',
      includeTOC: true,
      showCoverPage: true,
      themeFont: 'Plus Jakarta Sans, sans-serif',
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      primaryColor: '#0f172a',
      accentColor: '#0284c7',
      paperBgColor: '#ffffff',
      themePreset: 'corporate-navy',
      templateId: 'corporate-executive-slate',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Annual Strategic Review & Market Outlook',
        subtitle: 'Executive Leadership Briefing and Performance Metrics',
        author: 'Global Corporate Strategy Office',
        edition: '2026 Executive Summary',
        page: {
          size: 'A4',
          margin: { top: 20, bottom: 20, left: 20, right: 20 },
          showPageNumbers: true,
          headerText: 'Strategic Corporate Report 2026',
          footerText: 'Executive Board | Confidential Briefing',
          includeTOC: true,
          showCoverPage: true,
          themeFont: 'Plus Jakarta Sans, sans-serif',
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'Plus Jakarta Sans, sans-serif',
          primaryColor: '#0f172a',
          accentColor: '#0284c7',
          paperBgColor: '#ffffff',
          themePreset: 'corporate-navy',
          templateId: 'corporate-executive-slate',
        },
      },
      chapters: [
        {
          id: 'ch-corp-1',
          title: 'Executive Leadership Summary & Financial Performance',
          headerText: 'Strategic Review 2026',
          footerText: 'Executive Board Briefing',
          blocks: [
            { id: 'b-cr-1', type: 'heading', level: 1, text: '1. Executive Leadership Summary & Financial Performance' },
            { id: 'b-cr-2', type: 'callout', variant: 'important', title: '📊 Executive Takeaway: Financial Performance', text: 'Net ARR expanded +42% YoY driven by enterprise adoption across North America and European market expansion.' },
            { id: 'b-cr-3', type: 'quick_revision', title: '🎯 Key Performance Indicators (FY 2026)', bulletPoints: ['🚀 Revenue Growth: +42% YoY ($124.5M ARR)', '💼 Net Revenue Retention (NRR): 128%', '⚡ Operating Margin: 24.5% EBITDA', '🌐 Enterprise Customers: 2,400+ Active'] },
            { id: 'b-cr-4', type: 'table', caption: 'Table 1.1: FY 2025 vs FY 2026 Quarterly Performance Comparison', columns: ['Metric', 'FY 2025', 'FY 2026', 'YoY Growth'], rows: [['Annual Recurring Revenue', '$87.5M', '$124.5M', '+42.3%'], ['Gross Margin', '74.2%', '78.5%', '+4.3%'], ['Active Enterprise Accounts', '1,650', '2,400', '+45.4%']] }
          ]
        }
      ]
    },
  },
  {
    id: 'quick-revision-violet',
    name: 'Quick Revision & Mindmap Cheat-Sheet',
    genre: 'revision',
    badge: '⚡ Rapid Revision & Mindmaps',
    description: 'Ultra-compact layout with violet accents, high-density bullet grids, mindmaps, and rapid revision cards.',
    primaryColor: '#5b21b6',
    accentColor: '#c026d3',
    paperBgColor: '#faf5ff',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Roboto, sans-serif',
    previewImage: imgQuickRevision,
    pageConfig: {
      size: 'A4',
      margin: { top: 12, bottom: 12, left: 12, right: 12 },
      showPageNumbers: true,
      headerText: 'Formula & Mindmap Revision Sheet',
      footerText: 'Rapid Review Series | Last-Minute Notes',
      includeTOC: false,
      showCoverPage: false,
      themeFont: 'Roboto, sans-serif',
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      primaryColor: '#5b21b6',
      accentColor: '#c026d3',
      paperBgColor: '#faf5ff',
      themePreset: 'violet-revision',
      templateId: 'quick-revision-violet',
    },
    sampleDocument: {
      ...SAMPLE_DOCUMENT,
      document: {
        ...SAMPLE_DOCUMENT.document,
        title: 'Rapid Revision & Key Concept Flash-Notes',
        subtitle: 'Essential Formulas, Mindmaps, and Fast Memory Aids',
        author: 'OpenBook Revision Bureau',
        edition: '2026 Express Edition',
        page: {
          size: 'A4',
          margin: { top: 12, bottom: 12, left: 12, right: 12 },
          showPageNumbers: true,
          headerText: 'Formula & Mindmap Revision Sheet',
          footerText: 'Rapid Review Series | Last-Minute Notes',
          includeTOC: false,
          showCoverPage: false,
          themeFont: 'Roboto, sans-serif',
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'Roboto, sans-serif',
          primaryColor: '#5b21b6',
          accentColor: '#c026d3',
          paperBgColor: '#faf5ff',
          themePreset: 'violet-revision',
          templateId: 'quick-revision-violet',
        },
      },
      chapters: [
        {
          id: 'ch-rev-1',
          title: 'Express Memory Aid & Mindmap Review',
          headerText: 'Rapid Revision Sheet',
          footerText: 'Formula & Concept Review',
          blocks: [
            { id: 'b-rv-1', type: 'heading', level: 1, text: '⚡ Express Memory Aid & Mindmap Review' },
            { id: 'b-rv-2', type: 'mindmap', title: 'Part III Fundamental Rights Concept Tree', rootNode: { id: 'r1', label: 'Fundamental Rights', children: [{ id: 'c1', label: 'Equality (Art 14-18)' }, { id: 'c2', label: 'Freedom (Art 19-22)' }, { id: 'c3', label: 'Remedies (Art 32)' }] } },
            { id: 'b-rv-3', type: 'quick_revision', title: '⚡ Rapid Formula & Article Flash Notes', bulletPoints: ['Article 14: Equality before law and equal protection of laws', 'Article 21: Protection of life and personal liberty', 'Article 32: Constitutional remedies (Heart and Soul of Constitution)', 'Writs: Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari'] },
          ]
        }
      ]
    }
  },
];

export interface TemplatePaperStyle {
  containerStyle: React.CSSProperties;
  topRibbonClass?: string;
  hasDropCap?: boolean;
  headingAlignment?: 'left' | 'center';
  headingAccentBar?: boolean;
  accentBarColor?: string;
  headingPrefixSymbol?: string;
  dinkusSymbol?: string;
}

export function getTemplatePaperStyles(templateId?: string, fallbackBgColor?: string): TemplatePaperStyle {
  switch (templateId) {
    case 'fiction-garamond-parchment':
      return {
        containerStyle: {
          backgroundColor: '#fdf6e2',
          backgroundImage: "linear-gradient(rgba(253, 246, 226, 0.7), rgba(244, 236, 216, 0.7)), url('/textures/parchment.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '2px double #9f1239',
          boxShadow: 'inset 0 0 70px rgba(180, 83, 9, 0.08), 0 20px 50px -10px rgba(159, 18, 57, 0.2)',
        },
        hasDropCap: true,
        headingAlignment: 'center',
        dinkusSymbol: '❦ • • • ❦',
      };

    case 'academic-tufte-emerald':
      return {
        containerStyle: {
          backgroundColor: '#fbf9f5',
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')",
          backgroundSize: '100px 100px',
          border: '1px solid #d1fae5',
          boxShadow: 'inset 0 0 0 3px #f0fdf4, 0 15px 35px -10px rgba(4, 120, 87, 0.12)',
        },
        headingAlignment: 'left',
      };

    case 'technical-engineering-indigo':
      return {
        containerStyle: {
          backgroundColor: '#ffffff',
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/textures/blueprint.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #cbd5e1',
          boxShadow: '0 15px 35px -10px rgba(55, 48, 163, 0.12)',
        },
        topRibbonClass: 'h-2 bg-gradient-to-r from-indigo-800 via-indigo-600 to-cyan-500',
        headingPrefixSymbol: '⚙ ',
      };

    case 'exam-coaching-blue':
      return {
        containerStyle: {
          backgroundColor: '#ffffff',
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/textures/exam.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #cbd5e1',
          boxShadow: '0 15px 35px -10px rgba(30, 58, 138, 0.15)',
        },
        topRibbonClass: 'h-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-amber-500',
        headingAccentBar: true,
        accentBarColor: '#1e3a8a',
      };

    case 'corporate-executive-slate':
      return {
        containerStyle: {
          backgroundColor: '#ffffff',
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/textures/executive.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #cbd5e1',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.18)',
        },
        topRibbonClass: 'h-3 bg-slate-900 border-b-2 border-sky-500',
        headingAccentBar: true,
        accentBarColor: '#0284c7',
      };

    case 'quick-revision-violet':
      return {
        containerStyle: {
          backgroundColor: '#faf5ff',
          backgroundImage: "linear-gradient(rgba(250, 245, 255, 0.8), rgba(250, 245, 255, 0.8)), url('/textures/revision.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #e9d5ff',
          boxShadow: '0 15px 35px -10px rgba(91, 33, 182, 0.15)',
        },
        topRibbonClass: 'h-2 bg-gradient-to-r from-violet-900 via-purple-700 to-fuchsia-600',
        headingPrefixSymbol: '⚡ ',
      };

    default:
      return {
        containerStyle: {
          backgroundColor: fallbackBgColor || '#ffffff',
        },
      };
  }
}
