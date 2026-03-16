import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

function getNextFilename(label) {
  const files = fs.readdirSync(screenshotsDir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
  let max = 0;
  for (const f of files) {
    const match = f.match(/^screenshot-(\d+)/);
    if (match) max = Math.max(max, parseInt(match[1]));
  }
  const n = max + 1;
  return label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500)); // let animations settle

// Scroll through page to trigger ScrollTrigger animations
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= pageHeight; y += step) {
  await page.evaluate(s => window.scrollTo(0, s), y);
  await new Promise(r => setTimeout(r, 150));
}
// Let all triggered animations finish
await new Promise(r => setTimeout(r, 1200));
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 400));

const filename = getNextFilename(label);
const outPath = path.join(screenshotsDir, filename);
await page.screenshot({ path: outPath, fullPage: true });
console.log(`Screenshot saved: temporary screenshots/${filename}`);

await browser.close();
