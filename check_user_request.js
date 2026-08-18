import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/2d690c34-12d9-4a7f-92f0-f0c348830181';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runCheck() {
  console.log('=== STARTING BROWSER DIAGNOSTIC CHECK FOR HTTP://LOCALHOST:3000/ ===');
  
  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(error.toString());
  });

  // Step 1: Open http://localhost:3000/
  console.log('1. Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Step 2: Check initial page background
  console.log('2. Inspecting initial page background & structure...');
  const initialInspect = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.a4-page, [data-page], [class*="page"], main div.bg-white, main div.shadow'));
    const bodyStyle = window.getComputedStyle(document.body);
    
    // Find main page paper element
    const paperEl = document.querySelector('.a4-page') || document.querySelector('[style*="background"]') || document.querySelector('main div');

    const paperStyle = paperEl ? window.getComputedStyle(paperEl) : null;

    return {
      bodyBg: bodyStyle.backgroundColor,
      bodyBgImage: bodyStyle.backgroundImage,
      paperCount: pages.length,
      paperBgColor: paperStyle ? paperStyle.backgroundColor : 'none',
      paperBgImage: paperStyle ? paperStyle.backgroundImage : 'none',
      paperBoxShadow: paperStyle ? paperStyle.boxShadow : 'none',
      paperClassName: paperEl ? paperEl.className : '',
      htmlStructure: document.body.innerHTML.substring(0, 500)
    };
  });
  console.log('Initial Page State:', JSON.stringify(initialInspect, null, 2));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_initial_page.png'), fullPage: false });

  // Step 3: Click on '🎨 Templates' button
  console.log('3. Looking for "Templates" button...');
  const templatesBtn = await page.$('button:has-text("Templates")');
  if (!templatesBtn) {
    console.error('CRITICAL: "Templates" button not found!');
  } else {
    await templatesBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step2_templates_modal.png'), fullPage: false });

    // Select 'Classic Literature & Fiction Novel'
    console.log('3b. Selecting "Classic Literature & Fiction Novel"...');
    const cardHandle = await page.evaluateHandle(() => {
      const h3s = Array.from(document.querySelectorAll('h3, div, span'));
      const target = h3s.find(el => el.innerText && el.innerText.includes('Classic Literature & Fiction Novel'));
      return target ? target.closest('.group, button, div.border, div.shadow') || target : null;
    });

    // Check all buttons inside the template modal/card
    const sampleBtn = await page.$('button:has-text("Load Sample"), button:has-text("Apply Theme")');
    if (sampleBtn) {
      console.log('Found Load Sample/Apply Theme button directly, clicking...');
      await sampleBtn.click();
      await page.waitForTimeout(1000);
    } else {
      // Find card specifically
      const loadSampleSpecific = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const loadBtn = buttons.find(b => b.innerText.includes('Load Sample') || b.innerText.includes('Apply Theme'));
        if (loadBtn) {
          loadBtn.click();
          return true;
        }
        return false;
      });
      console.log('Click result via evaluate:', loadSampleSpecific);
      await page.waitForTimeout(1000);
    }

    // Close modal if open
    const doneBtn = await page.$('button:has-text("Done"), button:has-text("Close"), button:has-text("Done / Close")');
    if (doneBtn) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }

  // Step 4: Check if page background changes to old parchment texture and if MCQ/Callout/Table styling updates
  console.log('4. Inspecting page state after template application...');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_after_template.png'), fullPage: false });

  const postInspect = await page.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    
    // Find all page paper containers
    const pageContainers = Array.from(document.querySelectorAll('.a4-page, [class*="paper"], [class*="page"]'));
    const paperEl = document.querySelector('.a4-page') || document.querySelector('main div.shadow-2xl') || document.querySelector('main div.bg-white') || document.querySelector('main');
    
    const paperStyle = paperEl ? window.getComputedStyle(paperEl) : null;

    // Check specific elements: Callout, MCQ, Table
    const callouts = Array.from(document.querySelectorAll('[class*="callout"], [class*="alert"], [class*="note"], [data-block-type="callout"]'));
    const mcqs = Array.from(document.querySelectorAll('[class*="mcq"], [data-block-type="mcq"]'));
    const tables = Array.from(document.querySelectorAll('table, [data-block-type="table"]'));
    const blockContainers = Array.from(document.querySelectorAll('[data-block-id], [class*="block"]'));

    const calloutStyles = callouts.map(el => {
      const s = window.getComputedStyle(el);
      return {
        className: el.className,
        bg: s.backgroundColor,
        border: s.borderLeft || s.borderColor,
        font: s.fontFamily
      };
    });

    const mcqStyles = mcqs.map(el => {
      const s = window.getComputedStyle(el);
      return {
        className: el.className,
        bg: s.backgroundColor,
        font: s.fontFamily,
        color: s.color
      };
    });

    const tableStyles = tables.map(el => {
      const s = window.getComputedStyle(el);
      return {
        className: el.className,
        border: s.borderColor,
        font: s.fontFamily
      };
    });

    // Get text snippets of rendered elements
    const bodyText = document.body.innerText;

    return {
      bodyBg: bodyStyle.backgroundColor,
      bodyBgImage: bodyStyle.backgroundImage,
      paperBgColor: paperStyle ? paperStyle.backgroundColor : 'none',
      paperBgImage: paperStyle ? paperStyle.backgroundImage : 'none',
      paperFontFamily: paperStyle ? paperStyle.fontFamily : 'none',
      paperClassName: paperEl ? paperEl.className : 'none',
      paperInlineStyle: paperEl ? paperEl.getAttribute('style') : 'none',
      calloutCount: callouts.length,
      calloutStyles,
      mcqCount: mcqs.length,
      mcqStyles,
      tableCount: tables.length,
      tableStyles,
      hasParchmentTexture: paperStyle ? (paperStyle.backgroundImage.includes('parchment') || paperStyle.backgroundColor.includes('255, 251, 235') || paperStyle.backgroundColor.includes('fffbeb')) : false,
      textSnippet: bodyText.substring(0, 600)
    };
  });

  console.log('Post Template Inspection:', JSON.stringify(postInspect, null, 2));

  console.log('\n--- CONSOLE ERRORS ---');
  console.log(consoleErrors.length > 0 ? consoleErrors : 'No console errors detected.');

  console.log('\n--- PAGE ERRORS ---');
  console.log(pageErrors.length > 0 ? pageErrors : 'No page errors detected.');

  await browser.close();
}

runCheck().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
