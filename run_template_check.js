import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/a50a11ca-4f65-4b4e-a381-b51c66e409bb';

async function runCheck() {
  console.log('🚀 Launching Playwright browser inspection for http://localhost:3000/ ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const pageErrors = [];
  const networkFailures = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.toString()));
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkFailures.push({ url: resp.url(), status: resp.status() });
    }
  });

  // Step 1: Open http://localhost:3000/
  console.log('Step 1: Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_homepage.png') });
  console.log('📸 Captured 01_homepage.png');

  // Step 2: Click '🎨 Templates' button in top navbar
  console.log('Step 2: Clicking Templates button in navbar...');
  const templatesBtn = await page.$('button:has-text("Templates")');
  if (!templatesBtn) {
    throw new Error('Templates button not found in navbar');
  }
  await templatesBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_templates_modal.png') });
  console.log('📸 Captured 02_templates_modal.png');

  // Step 3: Inspect 6 template images & card layout
  console.log('Step 3: Inspecting template cards and images...');
  const cardsData = await page.evaluate(() => {
    const cardEls = Array.from(document.querySelectorAll('.grid h3')).map(h => h.closest('.group'));
    return cardEls.map((card, idx) => {
      if (!card) return null;
      const titleEl = card.querySelector('h3');
      const genreEl = card.querySelector('span.uppercase');
      const badgeEl = card.querySelector('.text-amber-400');
      const descEl = card.querySelector('p.text-slate-400');
      const imgEl = card.querySelector('img');
      const fallbackEl = card.querySelector('[style*="linear-gradient"]');

      const buttons = Array.from(card.querySelectorAll('button'));
      const applyBtn = buttons.find(b => b.innerText.includes('Apply Theme'));
      const loadSampleBtn = buttons.find(b => b.innerText.includes('Load Sample'));

      let imgStatus = {
        hasImgTag: !!imgEl,
        src: imgEl ? imgEl.src : null,
        naturalWidth: imgEl ? imgEl.naturalWidth : 0,
        naturalHeight: imgEl ? imgEl.naturalHeight : 0,
        complete: imgEl ? imgEl.complete : false,
        isLoadedProperly: imgEl ? (imgEl.complete && imgEl.naturalWidth > 0) : false,
        isShowingFallback: !!fallbackEl
      };

      const applyRect = applyBtn ? applyBtn.getBoundingClientRect() : null;
      const loadSampleRect = loadSampleBtn ? loadSampleBtn.getBoundingClientRect() : null;

      const titleStyle = titleEl ? getComputedStyle(titleEl) : null;
      const cardStyle = getComputedStyle(card);

      return {
        index: idx,
        title: titleEl ? titleEl.innerText : null,
        genre: genreEl ? genreEl.innerText : null,
        badge: badgeEl ? badgeEl.innerText : null,
        desc: descEl ? descEl.innerText : null,
        imgStatus,
        applyBtn: {
          exists: !!applyBtn,
          text: applyBtn ? applyBtn.innerText : null,
          height: applyRect ? applyRect.height : 0
        },
        loadSampleBtn: {
          exists: !!loadSampleBtn,
          text: loadSampleBtn ? loadSampleBtn.innerText : null,
          height: loadSampleRect ? loadSampleRect.height : 0
        },
        titleColor: titleStyle ? titleStyle.color : null,
        cardBg: cardStyle ? cardStyle.backgroundColor : null
      };
    }).filter(Boolean);
  });

  console.log('Cards analysis summary: Total valid cards =', cardsData.length);
  cardsData.forEach(c => {
    console.log(`Card ${c.index + 1}: "${c.title}" | ImgLoaded: ${c.imgStatus.isLoadedProperly} (w:${c.imgStatus.naturalWidth}, h:${c.imgStatus.naturalHeight}) | Src: ${c.imgStatus.src}`);
  });

  // Check scrolling behavior inside modal
  const scrollInfo = await page.evaluate(() => {
    const gridContainer = document.querySelector('.flex-1.overflow-y-auto');
    if (!gridContainer) return null;
    return {
      scrollHeight: gridContainer.scrollHeight,
      clientHeight: gridContainer.clientHeight,
      isScrollable: gridContainer.scrollHeight > gridContainer.clientHeight
    };
  });
  console.log('Scroll Info:', scrollInfo);

  // Step 3b: Test clicking on template image container to trigger Lightbox modal
  console.log('Step 3b: Testing Lightbox modal on image container 1...');
  const firstImgContainer = await page.$('.grid > div .relative.h-64');
  let lightboxOpened = false;
  if (firstImgContainer) {
    await firstImgContainer.click({ force: true });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_lightbox_modal.png') });
    console.log('📸 Captured 03_lightbox_modal.png');

    const lightboxImg = await page.$('.fixed.inset-0.z-50 img');
    lightboxOpened = !!lightboxImg;
    console.log('Lightbox opened successfully:', lightboxOpened);

    // Close Lightbox by clicking backdrop or top-right close button
    console.log('Closing Lightbox modal...');
    await page.click('.fixed.inset-0.z-50', { position: { x: 20, y: 20 }, force: true });
    await page.waitForTimeout(800);
  }

  // Step 4: Test clicking 'Apply Theme'
  console.log('Step 4: Testing Apply Theme button on card 2 (Academic Monograph)...');
  const academicApplyBtn = await page.$('.grid > div:nth-child(2) button:has-text("Apply Theme")');
  let themeAppliedSuccess = false;
  if (academicApplyBtn) {
    await academicApplyBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_theme_applied_modal.png') });
    console.log('📸 Captured 04_theme_applied_modal.png');

    const notificationText = await page.evaluate(() => {
      const banner = document.querySelector('.bg-emerald-500\\/20');
      return banner ? banner.innerText : null;
    });
    console.log('Notification Banner:', notificationText);
    themeAppliedSuccess = !!notificationText;
  }

  // Close modal to see if theme applied to main document
  const doneCloseBtn = await page.$('button:has-text("Done / Close")');
  if (doneCloseBtn) {
    await doneCloseBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_main_doc_theme_updated.png') });
    console.log('📸 Captured 05_main_doc_theme_updated.png');
  }

  // Re-open Templates modal to test 'Load Sample'
  console.log('Step 4b: Re-opening Templates modal & testing Load Sample on card 3 (Fiction)...');
  const templatesBtn2 = await page.$('button:has-text("Templates")');
  if (templatesBtn2) {
    await templatesBtn2.click();
    await page.waitForTimeout(800);

    const fictionLoadSampleBtn = await page.$('.grid > div:nth-child(3) button:has-text("Load Sample")');
    if (fictionLoadSampleBtn) {
      await fictionLoadSampleBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_sample_loaded_modal.png') });
      console.log('📸 Captured 06_sample_loaded_modal.png');
    }

    const doneCloseBtn2 = await page.$('button:has-text("Done / Close")');
    if (doneCloseBtn2) {
      await doneCloseBtn2.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_main_doc_sample_loaded.png') });
      console.log('📸 Captured 07_main_doc_sample_loaded.png');
    }
  }

  const mainDocDetails = await page.evaluate(() => {
    const titleEl = document.querySelector('.no-print p.text-slate-400');
    return {
      titleInHeader: titleEl ? titleEl.innerText : null,
      bodyTextSnippet: document.body.innerText.substring(0, 500)
    };
  });
  console.log('Main Doc Details after Load Sample:', mainDocDetails);

  await browser.close();

  const report = {
    cardsData,
    scrollInfo,
    lightboxOpened,
    themeAppliedSuccess,
    mainDocDetails,
    consoleLogs,
    pageErrors,
    networkFailures
  };

  fs.writeFileSync(path.join(ARTIFACT_DIR, 'templates_check_report.json'), JSON.stringify(report, null, 2));
  console.log('✅ Inspection complete! Saved templates_check_report.json');
}

runCheck().catch(err => {
  console.error('❌ Check script failed:', err);
  process.exit(1);
});
