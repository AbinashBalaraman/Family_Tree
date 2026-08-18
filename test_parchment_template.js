import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/2d690c34-12d9-4a7f-92f0-f0c348830181';

async function testParchmentTemplate() {
  console.log('=== VERIFYING PARCHMENT TEMPLATE & STYLING UPDATES ===');

  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') consoleErrors.push(text);
  });

  page.on('pageerror', err => pageErrors.push(err.toString()));

  // 1. Open http://localhost:3000/
  console.log('1. Opening http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // 2. Check initial page background
  const initialPaperStyle = await page.evaluate(() => {
    const paper = document.querySelector('.a4-page') || document.querySelector('main div.shadow-2xl') || document.querySelector('main div.rounded-sm');
    if (!paper) return null;
    const s = window.getComputedStyle(paper);
    return {
      bgColor: s.backgroundColor,
      bgImage: s.backgroundImage,
      fontFamily: s.fontFamily,
      boxShadow: s.boxShadow,
      border: s.border
    };
  });
  console.log('2. Initial Page Paper Style:', JSON.stringify(initialPaperStyle, null, 2));

  // 3. Click '🎨 Templates' button
  console.log('3. Clicking Templates button...');
  const templatesBtn = await page.$('button:has-text("Templates")');
  if (!templatesBtn) {
    throw new Error('Templates button not found!');
  }
  await templatesBtn.click();
  await page.waitForTimeout(800);

  // 3b. Select 'Classic Literature & Fiction Novel' specifically and click 'Load Sample'
  console.log('3b. Locating "Classic Literature & Fiction Novel" template card and clicking "Load Sample"...');
  const cardClicked = await page.evaluate(() => {
    const h3s = Array.from(document.querySelectorAll('h3'));
    const targetH3 = h3s.find(h => h.innerText.includes('Classic Literature & Fiction Novel'));
    if (!targetH3) return { success: false, reason: 'H3 not found' };
    
    // Find parent container representing the template card
    let parent = targetH3.parentElement;
    while (parent && !parent.classList.contains('group')) {
      parent = parent.parentElement;
    }
    if (!parent) return { success: false, reason: 'Card group container not found' };

    // Find the 'Load Sample' button specifically
    const buttons = Array.from(parent.querySelectorAll('button'));
    const loadSampleBtn = buttons.find(b => b.innerText.includes('Load Sample'));
    
    if (loadSampleBtn) {
      loadSampleBtn.click();
      return { success: true, buttonClicked: 'Load Sample' };
    }
    
    const applyThemeBtn = buttons.find(b => b.innerText.includes('Apply Theme'));
    if (applyThemeBtn) {
      applyThemeBtn.click();
      return { success: true, buttonClicked: 'Apply Theme' };
    }

    return { success: false, reason: 'No Load Sample or Apply Theme button found in card', buttonsText: buttons.map(b => b.innerText) };
  });

  console.log('Card selection result:', JSON.stringify(cardClicked, null, 2));
  await page.waitForTimeout(1500);

  // Close modal if still open
  const doneBtn = await page.$('button:has-text("Done"), button:has-text("Close"), button:has-text("Done / Close")');
  if (doneBtn) {
    await doneBtn.click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 4. Check page background after template selection
  console.log('4. Inspecting page paper and block styling after template load...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_after_parchment_fiction_applied.png'), fullPage: false });

  const postPaperStyle = await page.evaluate(() => {
    const paper = document.querySelector('.a4-page') || document.querySelector('main div.shadow-2xl') || document.querySelector('main div.rounded-sm');
    if (!paper) return null;
    const s = window.getComputedStyle(paper);

    // Callouts, MCQs, Tables
    const callouts = Array.from(document.querySelectorAll('[class*="callout"], [class*="alert"], [class*="note"], [data-block-type="callout"]'));
    const mcqs = Array.from(document.querySelectorAll('[class*="mcq"], [data-block-type="mcq"]'));
    const tables = Array.from(document.querySelectorAll('table, [data-block-type="table"]'));
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    const paragraphs = Array.from(document.querySelectorAll('p, textarea'));

    return {
      bgColor: s.backgroundColor,
      bgImage: s.backgroundImage,
      fontFamily: s.fontFamily,
      boxShadow: s.boxShadow,
      border: s.border,
      headingFonts: headings.map(h => window.getComputedStyle(h).fontFamily),
      headingColors: headings.map(h => window.getComputedStyle(h).color),
      paragraphFonts: paragraphs.slice(0, 3).map(p => window.getComputedStyle(p).fontFamily),
      calloutDetails: callouts.map(c => ({
        text: c.innerText.substring(0, 100),
        bg: window.getComputedStyle(c).backgroundColor,
        border: window.getComputedStyle(c).borderColor || window.getComputedStyle(c).borderLeftColor,
        font: window.getComputedStyle(c).fontFamily
      })),
      mcqDetails: mcqs.map(m => ({
        question: m.innerText.substring(0, 100),
        bg: window.getComputedStyle(m).backgroundColor,
        font: window.getComputedStyle(m).fontFamily
      })),
      tableDetails: tables.map(t => ({
        border: window.getComputedStyle(t).borderColor,
        font: window.getComputedStyle(t).fontFamily
      })),
      pageText: document.body.innerText.substring(0, 800)
    };
  });

  console.log('Post Parchment Style Inspection:', JSON.stringify(postPaperStyle, null, 2));

  console.log('\n--- CONSOLE ERRORS ---');
  console.log(consoleErrors.length > 0 ? consoleErrors : 'None');

  console.log('\n--- PAGE ERRORS ---');
  console.log(pageErrors.length > 0 ? pageErrors : 'None');

  await browser.close();
}

testParchmentTemplate().catch(err => {
  console.error('Execution failure:', err);
  process.exit(1);
});
