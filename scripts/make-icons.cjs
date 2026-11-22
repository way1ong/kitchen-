// Рендерить public/icon.svg у PNG потрібних розмірів (потрібен Playwright).
const { chromium } = require('playwright');
const { readFileSync } = require('node:fs');
const path = require('node:path');

(async () => {
  const svg = readFileSync(path.join(__dirname, '../public/icon.svg'), 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [size, name] of [[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png']]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: path.join(__dirname, '../public', name) });
  }
  await browser.close();
  console.log('icons ok');
})();
