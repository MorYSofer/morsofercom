import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));

// scroll to fire all animations
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= h; y += 400) {
  await page.evaluate(s => window.scrollTo(0, s), y);
  await new Promise(r => setTimeout(r, 150));
}
await new Promise(r => setTimeout(r, 1200));

// Hero
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/section-hero.png' });

// About
await page.evaluate(() => document.getElementById('about').scrollIntoView());
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/section-about.png' });

// Blog + Thoughts
await page.evaluate(() => document.getElementById('blog').scrollIntoView());
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/section-blog.png' });

// Contact
await page.evaluate(() => document.getElementById('contact').scrollIntoView());
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/section-contact.png' });

await browser.close();
console.log('All section screenshots saved.');
