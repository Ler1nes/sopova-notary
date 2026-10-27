import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222', { timeout: 60000 });
const context = browser.contexts()[0];
for (const p of context.pages()) await p.close().catch(() => {});
const page = await context.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px;
    background:
      radial-gradient(55% 70% at 88% 8%, rgba(201,162,94,0.22), transparent 62%),
      radial-gradient(45% 55% at 8% 96%, rgba(120,141,176,0.1), transparent 70%),
      #08090b;
    color: #f1ece2;
    font-family: Georgia, 'Times New Roman', serif;
    padding: 64px 72px 54px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .line { position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(236,228,212,.07) 1px, transparent 1px); background-size: 150px 100%; }
  .top { display: flex; align-items: center; gap: 18px; position: relative; }
  .mark { width: 54px; height: 54px; border: 1px solid rgba(201,162,94,.55); display: grid; place-items: center; color: #c9a25e; }
  .name { font-size: 27px; letter-spacing: 0.2em; }
  .sub { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.32em; color: #9c978c; margin-top: 8px; }
  .mid { position: relative; }
  .kicker { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #c9a25e; margin-bottom: 26px; }
  h1 { font-size: 76px; line-height: 1.02; font-weight: 400; letter-spacing: -0.015em; }
  h1 em { color: #e3c083; font-style: italic; }
  .bottom { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(236,228,212,.16); padding-top: 22px; position: relative; }
  .bottom p { font-family: Arial, sans-serif; font-size: 14px; letter-spacing: 0.08em; color: #d8d1c2; }
  .bottom span { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #9c978c; }
</style>
</head>
<body>
  <div class="line"></div>
  <div class="top">
    <div class="mark">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
        <path d="M16 7v18M10 25h12M5.5 11.5h21"/>
        <path d="M5.5 11.5 2 19h7l-3.5-7.5Z"/><path d="M26.5 11.5 23 19h7l-3.5-7.5Z"/>
        <circle cx="16" cy="5.4" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    </div>
    <div>
      <div class="name">СОПОВА А.В.</div>
      <div class="sub">НОТАРИАЛЬНАЯ КОНТОРА · АПШЕРОНСК</div>
    </div>
  </div>
  <div class="mid">
    <div class="kicker">Наследство · Недвижимость · Доверенности</div>
    <h1>Юридическая сила<br /><em>— с первого визита</em></h1>
  </div>
  <div class="bottom">
    <p>ул. Профсоюзная, 43, 1 этаж · Апшеронск</p>
    <span>+7 (918) 429-72-34</span>
  </div>
</body>
</html>
`);

await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 88 });
console.log('og image ready');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:4178/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4500);
await page.screenshot({ path: 'shots/y-390-hero.png' });

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://127.0.0.1:4178/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4200);
await page.evaluate(() => {
  const el = document.querySelector('#about');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'shots/y-about.png' });

await page.close();
await browser.close();
