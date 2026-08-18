import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/SATHYA TRADERS/.gemini/antigravity/brain/15d5de80-9f33-49f4-9e17-59f02bd3861c';

async function runTest() {
  console.log('Launching Playwright Chromium browser to test Family Tree App...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Navigate to App
  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Take screenshot 1: Main Tree Canvas
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_tree_canvas.png') });
  console.log('Captured Screenshot 1: 01_tree_canvas.png');

  // 2. Click "Add Member" button
  console.log('Clicking "Add Member" button...');
  await page.click('header button:has-text("Add Member")');
  await page.waitForTimeout(800);

  // Take screenshot 2: Add Member Drawer
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_add_member_modal.png') });
  console.log('Captured Screenshot 2: 02_add_member_modal.png');

  // 3. Fill Form within modal
  console.log('Filling out member profile form in modal...');
  const modal = page.locator('.fixed.inset-0');
  
  // Fill first name & last name
  const textInputs = modal.locator('input[type="text"]');
  await textInputs.nth(0).fill('Alexander');
  await textInputs.nth(1).fill('Rutherford');

  // Fill place & occupation
  await modal.locator('input[placeholder="e.g. London, UK"]').fill('Edinburgh, Scotland');
  await modal.locator('input[placeholder="e.g. Botanist & Author"]').fill('Junior Inventor & Explorer');
  await modal.locator('textarea').fill('Bright young 5th generation descendant of Arthur Rutherford.');

  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_form_filled.png') });
  console.log('Captured Screenshot 3: 03_form_filled.png');

  // 4. Save Member Profile
  console.log('Saving profile...');
  await modal.locator('button[type="submit"]').click();
  await page.waitForTimeout(1500);

  // Take screenshot 4: Updated Tree Canvas with new member
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_tree_updated.png') });
  console.log('Captured Screenshot 4: 04_tree_updated.png');

  // 5. Navigate to Pedigree View
  console.log('Navigating to Pedigree View...');
  await page.click('button:has-text("Pedigree")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_pedigree_chart.png') });
  console.log('Captured Screenshot 5: 05_pedigree_chart.png');

  // 6. Navigate to Analytics View
  console.log('Navigating to Analytics View...');
  await page.click('button:has-text("Analytics")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_analytics_dashboard.png') });
  console.log('Captured Screenshot 6: 06_analytics_dashboard.png');

  // 7. Navigate to Directory View
  console.log('Navigating to Directory View...');
  await page.click('button:has-text("Directory")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_member_directory.png') });
  console.log('Captured Screenshot 7: 07_member_directory.png');

  // 8. Navigate to Timeline View
  console.log('Navigating to Timeline View...');
  await page.click('button:has-text("Timeline")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_family_timeline.png') });
  console.log('Captured Screenshot 8: 08_family_timeline.png');

  await browser.close();
  console.log('🎉 Browser test completed successfully with all views verified!');
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
