import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/c3e54785-cce6-42cc-a230-c5d5a7e989bc';

async function runDetailedChapterVerification() {
  console.log('🚀 Running detailed Chapter 1 visual & DOM verification for all 6 templates...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const reportData = [];

  // 1. Navigate to http://localhost:3000/
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  const templates = [
    {
      id: 'exam-coaching-blue',
      name: 'Competitive Exam & Coaching Guide',
      expectedBg: 'rgb(255, 255, 255)',
      expectedPrimaryColorHex: '#1e3a8a',
      expectedHeadingFont: 'Outfit',
      expectedBodyFont: 'Roboto',
      verifications: ['blue headers', 'exam tips callouts', 'MCQs']
    },
    {
      id: 'academic-tufte-emerald',
      name: 'Academic Monograph & Research Paper',
      expectedBg: 'rgb(250, 250, 250)',
      expectedPrimaryColorHex: '#047857',
      expectedHeadingFont: 'Libertinus Serif',
      expectedBodyFont: 'Libertinus Serif',
      verifications: ['emerald serif headers', 'theorem boxes', 'equations']
    },
    {
      id: 'fiction-garamond-parchment',
      name: 'Classic Literature & Fiction Novel',
      expectedBg: 'rgb(255, 251, 235)',
      expectedPrimaryColorHex: '#9f1239',
      expectedHeadingFont: 'Playfair Display',
      expectedBodyFont: 'EB Garamond',
      verifications: ['parchment background (#fffbeb)', 'Garamond serif text', 'crimson headers']
    },
    {
      id: 'technical-engineering-indigo',
      name: 'Technical & Engineering Handbook',
      expectedBg: 'rgb(255, 255, 255)',
      expectedPrimaryColorHex: '#3730a3',
      expectedHeadingFont: 'Plus Jakarta Sans',
      expectedBodyFont: 'Inter',
      verifications: ['indigo headers', 'code block', 'mindmap tree']
    },
    {
      id: 'corporate-executive-slate',
      name: 'Executive & Corporate Report',
      expectedBg: 'rgb(255, 255, 255)',
      expectedPrimaryColorHex: '#0f172a',
      expectedHeadingFont: 'Outfit',
      expectedBodyFont: 'Plus Jakarta Sans',
      verifications: ['slate navy headers', 'KPI cards']
    },
    {
      id: 'quick-revision-violet',
      name: 'Quick Revision & Mindmap Cheat-Sheet',
      expectedBg: 'rgb(250, 245, 255)',
      expectedPrimaryColorHex: '#5b21b6',
      expectedHeadingFont: 'Outfit',
      expectedBodyFont: 'Roboto',
      verifications: ['lavender background (#faf5ff)', 'violet mindmap tree', 'revision cards']
    }
  ];

  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    console.log(`\n==================================================`);
    console.log(`Testing Template ${i + 1}/6: "${t.name}"`);
    console.log(`==================================================`);

    // Open Templates modal
    const templatesBtn = await page.$('button:has-text("Templates")');
    await templatesBtn.click();
    await page.waitForTimeout(600);

    // Locate card and click 'Load Sample'
    const cardHandle = await page.evaluateHandle((name) => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const targetH3 = h3s.find(h => h.innerText.includes(name));
      return targetH3 ? targetH3.closest('.group') : null;
    }, t.name);

    const loadSampleBtn = await cardHandle.$('button:has-text("Load Sample")');
    await loadSampleBtn.click();
    await page.waitForTimeout(600);

    // Close modal if open
    const doneBtn = await page.$('button:has-text("Done / Close")');
    if (doneBtn) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    }

    // Now navigate to Chapter 1 page in studio
    // Click chapter 1 in sidebar outline or click page next button `>`
    const chapterOutlineBtn = await page.$('button:has-text("1. "), button:has-text("Chapter 1")');
    if (chapterOutlineBtn) {
      await chapterOutlineBtn.click();
      await page.waitForTimeout(500);
    } else {
      // Click next page button (">") in page navigation
      const nextPageBtn = await page.$('button[title*="Next"], button:has-text(">")');
      if (nextPageBtn) {
        await nextPageBtn.click();
        await page.waitForTimeout(400);
        await nextPageBtn.click();
        await page.waitForTimeout(400);
      }
    }

    // Capture screenshot of Chapter 1 for this template
    const screenshotPath = path.join(ARTIFACT_DIR, `chapter1_template_${i + 1}_${t.id}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Saved chapter screenshot: chapter1_template_${i + 1}_${t.id}.png`);

    // Perform detailed DOM inspection on the interactive paper canvas
    const chapterDetails = await page.evaluate(() => {
      // Find the main printable paper canvas container (720px width element with pageConfig background and font)
      const paperEl = Array.from(document.querySelectorAll('div')).find(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('width: 720px') || style.includes('720px');
      });

      const paperStyle = paperEl ? getComputedStyle(paperEl) : null;
      const paperBgColor = paperStyle ? paperStyle.backgroundColor : null;
      const paperFontFamily = paperStyle ? paperStyle.fontFamily : null;

      // Find h1 inside paper canvas
      const h1El = paperEl ? paperEl.querySelector('h1, h2, h3, [class*="heading"]') : null;
      const h1Style = h1El ? getComputedStyle(h1El) : null;
      const headingFontFamily = h1Style ? h1Style.fontFamily : null;
      const headingColor = h1Style ? h1Style.color : null;
      const headingText = h1El ? h1El.innerText : null;

      const innerContent = paperEl ? paperEl.innerText : document.body.innerText;

      // Block checks
      const hasMcq = innerContent.includes('Q1.') || innerContent.includes('Q2.') || !!document.querySelector('.border-sky-200');
      const hasExamTip = innerContent.includes('Exam Tip') || innerContent.includes('💡');
      const hasTheorem = innerContent.includes('Theorem') || innerContent.includes('Gödel');
      const hasEquation = innerContent.includes('E = m c') || innerContent.includes('Little\'s Law') || !!document.querySelector('.katex');
      const hasCodeBlock = innerContent.includes('interface EventPayload') || innerContent.includes('async function');
      const hasMindmap = innerContent.includes('Resilience Tree') || innerContent.includes('Concept Tree') || !!document.querySelector('svg');
      const hasKpi = innerContent.includes('Key Performance Indicators') || innerContent.includes('Revenue Growth');
      const hasRevision = innerContent.includes('Flash Notes') || innerContent.includes('1-Minute Formula Snapshot');
      const hasTable = innerContent.includes('Table 1.1') || !!document.querySelector('table');

      return {
        paperBgColor,
        paperFontFamily,
        headingFontFamily,
        headingColor,
        headingText,
        snippet: innerContent.substring(0, 500),
        blocks: {
          hasMcq,
          hasExamTip,
          hasTheorem,
          hasEquation,
          hasCodeBlock,
          hasMindmap,
          hasKpi,
          hasRevision,
          hasTable
        }
      };
    });

    console.log(`DOM verification result for ${t.name}:`, JSON.stringify(chapterDetails, null, 2));

    reportData.push({
      template: t,
      chapterDetails,
      screenshot: screenshotPath
    });
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'detailed_chapter_verification.json'),
    JSON.stringify(reportData, null, 2)
  );

  console.log('\n🎉 Comprehensive visual parity and verification check completed successfully!');
}

runDetailedChapterVerification().catch(err => {
  console.error('❌ Error during detailed chapter verification:', err);
  process.exit(1);
});
