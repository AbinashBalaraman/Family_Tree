import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/b6eed7f4-d37e-431d-b5ef-44ed7c4e6268';

async function runVerification() {
  console.log('Starting automated browser inspection of http://localhost:3000...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Record logs & errors
  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.toString()));

  // 1. Navigate to localhost:3000
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Take screenshot 1: Initial Page Layout
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_initial_layout.png') });
  console.log('Captured 01_initial_layout.png');

  // Extract page content details
  const pageTitle = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page Title:', pageTitle);
  console.log('Body Text snippet:', bodyText.substring(0, 300));

  // Find buttons & interactive elements
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      id: b.id,
      className: b.className,
      ariaLabel: b.getAttribute('aria-label')
    }));
  });
  console.log('Found Buttons:', JSON.stringify(buttons, null, 2));

  // 2. Check layout elements (headers, footers, sidebars, page containers)
  const layoutInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('header, [class*="header"]');
    const footers = document.querySelectorAll('footer, [class*="footer"]');
    const pages = document.querySelectorAll('[class*="page"], [data-page], .a4-page, .page-container');
    const blocks = document.querySelectorAll('[class*="block"], [data-block-type], .composer-block');
    return {
      headersCount: headers.length,
      footersCount: footers.length,
      pagesCount: pages.length,
      blocksCount: blocks.length
    };
  });
  console.log('Layout Info:', layoutInfo);

  // 3. Test Block Editing Controls
  console.log('Testing block editing interactions...');
  // Click on a block or editor element to reveal block editing controls / toolbar
  const editableElement = await page.$('[contenteditable="true"], [data-block-id], .composer-block, p, h1, h2');
  if (editableElement) {
    console.log('Clicking editable block...');
    await editableElement.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_block_selection.png') });
    console.log('Captured 02_block_selection.png');
  }

  // Look for format toolbar or block add buttons
  const addBlockBtn = await page.$('button:has-text("Add"), button:has-text("Block"), [title*="Add"], [aria-label*="Add"]');
  if (addBlockBtn) {
    console.log('Clicking Add Block button...');
    await addBlockBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_add_block_menu.png') });
  }

  // 4. Test Headers / Footers controls
  console.log('Checking Header & Footer elements and options...');
  const headerFooterBtns = await page.$$('button:has-text("Header"), button:has-text("Footer"), button:has-text("Settings"), button:has-text("Layout")');
  for (const btn of headerFooterBtns) {
    const text = await btn.innerText();
    console.log(`Clicking layout/header/footer button: "${text}"`);
    await btn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `04_click_${text.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`) });
  }

  // 5. Test PDF Export Functionality
  console.log('Testing PDF Export functionality...');
  const exportBtn = await page.$('button:has-text("Export"), button:has-text("PDF"), button:has-text("Download"), [title*="Export"], [aria-label*="Export"]');
  let exportModalOpened = false;
  if (exportBtn) {
    console.log('Found export button, clicking...');
    await exportBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_export_modal.png') });
    console.log('Captured 05_export_modal.png');
    exportModalOpened = true;

    // Check if there is a PDF confirm / export trigger inside modal
    const pdfConfirmBtn = await page.$('button:has-text("Download PDF"), button:has-text("Export PDF"), button:has-text("Generate PDF"), button:has-text("Confirm")');
    if (pdfConfirmBtn) {
      console.log('Found PDF confirm button, clicking to test PDF trigger...');
      // Listen for download event or print window
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        pdfConfirmBtn.click()
      ]);
      await page.waitForTimeout(1500);
      if (download) {
        console.log('PDF download triggered successfully:', await download.suggestedFilename());
      } else {
        console.log('No direct browser download event triggered, checking console / modal response.');
      }
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_post_export.png') });
    }
  } else {
    console.log('No explicit Export button found directly.');
  }

  await browser.close();

  const report = {
    pageTitle,
    consoleLogs,
    pageErrors,
    buttons,
    layoutInfo,
    exportModalOpened
  };

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'verification_report.json'), JSON.stringify(report, null, 2));
  console.log('Verification completed and report saved.');
}

runVerification().catch(err => {
  console.error('Browser inspection error:', err);
  process.exit(1);
});
