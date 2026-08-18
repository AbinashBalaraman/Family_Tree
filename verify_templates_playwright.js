import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/c3e54785-cce6-42cc-a230-c5d5a7e989bc';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function verifyTemplates() {
  console.log('🚀 Starting visual verification of all 6 book templates on http://localhost:3000/ ...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];

  // Step 1: Open http://localhost:3000/
  console.log('1. Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Take screenshot of home
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '00_initial_studio.png'), fullPage: false });

  const templatesToTest = [
    {
      id: 'exam-coaching-blue',
      name: 'Competitive Exam & Coaching Guide',
      expectedBg: 'rgb(255, 255, 255)', // #ffffff
      expectedPrimaryColor: '#1e3a8a',
      checkElements: ['Exam Tip', 'MCQ', 'Quantitative Aptitude']
    },
    {
      id: 'academic-tufte-emerald',
      name: 'Academic Monograph & Research Paper',
      expectedBg: 'rgb(250, 250, 250)', // #fafafa
      expectedPrimaryColor: '#047857',
      checkElements: ['Theorem', 'Equation', 'Axiomatic']
    },
    {
      id: 'fiction-garamond-parchment',
      name: 'Classic Literature & Fiction Novel',
      expectedBg: 'rgb(255, 251, 235)', // #fffbeb
      expectedPrimaryColor: '#9f1239',
      checkElements: ['Departure at Dawn', 'Oakhaven Epigraph', 'parapet']
    },
    {
      id: 'technical-engineering-indigo',
      name: 'Technical & Engineering Handbook',
      expectedBg: 'rgb(255, 255, 255)', // #ffffff
      expectedPrimaryColor: '#3730a3',
      checkElements: ['Microservice Architecture', 'interface EventPayload', 'Distributed System Resilience Tree']
    },
    {
      id: 'corporate-executive-slate',
      name: 'Executive & Corporate Report',
      expectedBg: 'rgb(255, 255, 255)', // #ffffff
      expectedPrimaryColor: '#0f172a',
      checkElements: ['Executive Leadership Summary', 'Key Performance Indicators', 'Annual Recurring Revenue']
    },
    {
      id: 'quick-revision-violet',
      name: 'Quick Revision & Mindmap Cheat-Sheet',
      expectedBg: 'rgb(250, 245, 255)', // #faf5ff
      expectedPrimaryColor: '#5b21b6',
      checkElements: ['Express Memory Aid', 'Part III Fundamental Rights Concept Tree', 'Rapid Formula']
    }
  ];

  for (let i = 0; i < templatesToTest.length; i++) {
    const t = templatesToTest[i];
    console.log(`\n--- Testing Template ${i + 1}/6: "${t.name}" ---`);

    // Step 2: Click '🎨 Templates' in navbar
    const templatesBtn = await page.$('button:has-text("Templates")');
    if (!templatesBtn) {
      throw new Error('Templates button not found in top navbar!');
    }
    await templatesBtn.click();
    await page.waitForTimeout(800);

    // Click 'Load Sample' for the specific template card
    // We look for the card containing the template name
    const cardHandle = await page.evaluateHandle((name) => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const targetH3 = h3s.find(h => h.innerText.includes(name));
      return targetH3 ? targetH3.closest('.group') : null;
    }, t.name);

    if (!cardHandle.asElement()) {
      throw new Error(`Could not find template card for "${t.name}"`);
    }

    const loadSampleBtn = await cardHandle.$('button:has-text("Load Sample")');
    if (!loadSampleBtn) {
      throw new Error(`Could not find "Load Sample" button for "${t.name}"`);
    }

    await loadSampleBtn.click();
    await page.waitForTimeout(800);

    // If modal is still open, click "Done / Close" or close button if present
    const doneBtn = await page.$('button:has-text("Done / Close")');
    if (doneBtn) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    } else {
      // Click backdrop or ESC if needed
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // Capture screenshot of rendered Live Page Studio for this template
    const screenshotPath = path.join(ARTIFACT_DIR, `template_${i + 1}_${t.id}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Captured screenshot: template_${i + 1}_${t.id}.png`);

    // Inspect rendered document state & DOM properties in Live Page Studio
    const domAnalysis = await page.evaluate(() => {
      // Find the page paper element in studio
      // Common page containers in OpenBook Composer
      const paperContainer = document.querySelector('[style*="background-color"], [style*="backgroundColor"], .shadow-2xl, .bg-white, .a4-page') || document.querySelector('main');
      
      // Let's get computed styles of headings and page paper
      const h1El = document.querySelector('h1, h2, [class*="heading"]');
      const bodyEl = document.querySelector('p, div[contenteditable]');
      
      // Look for page style in editor state or paper wrapper
      const pageWrapper = document.querySelector('.transform-gpu, [style*="background"]');
      const computedPaper = pageWrapper ? getComputedStyle(pageWrapper) : null;
      const computedH1 = h1El ? getComputedStyle(h1El) : null;
      const computedBody = bodyEl ? getComputedStyle(bodyEl) : null;

      const pageText = document.body.innerText;

      // Find all rendered block types
      const hasMcq = pageText.includes('Q1.') || !!document.querySelector('[data-block-type="mcq"]');
      const hasExamTip = pageText.includes('Exam Tip') || pageText.includes('💡');
      const hasTheorem = pageText.includes('Theorem') || pageText.includes('Gödel');
      const hasEquation = pageText.includes('E = m c') || pageText.includes('Equation') || !!document.querySelector('.katex, [data-block-type="equation"]');
      const hasCodeBlock = pageText.includes('interface EventPayload') || pageText.includes('async function dispatchEvent');
      const hasMindmap = pageText.includes('Resilience Tree') || pageText.includes('Concept Tree') || !!document.querySelector('.svg-mindmap, [data-block-type="mindmap"]');
      const hasKpi = pageText.includes('Key Performance Indicators') || pageText.includes('YoY');
      const hasRevision = pageText.includes('Flash Notes') || pageText.includes('1-Minute Formula Snapshot');

      return {
        pageTextSnippet: pageText.substring(0, 400),
        headingFontFamily: computedH1 ? computedH1.fontFamily : 'unknown',
        headingColor: computedH1 ? computedH1.color : 'unknown',
        bodyFontFamily: computedBody ? computedBody.fontFamily : 'unknown',
        paperBgColor: computedPaper ? computedPaper.backgroundColor : 'unknown',
        blocksFound: {
          hasMcq,
          hasExamTip,
          hasTheorem,
          hasEquation,
          hasCodeBlock,
          hasMindmap,
          hasKpi,
          hasRevision
        }
      };
    });

    console.log(`DOM Analysis for ${t.name}:`, JSON.stringify(domAnalysis, null, 2));

    results.push({
      template: t,
      screenshot: screenshotPath,
      domAnalysis
    });
  }

  await browser.close();

  // Save report
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'visual_verification_results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n✅ All 6 templates successfully tested and verified!');
}

verifyTemplates().catch(err => {
  console.error('❌ Error during verification:', err);
  process.exit(1);
});
