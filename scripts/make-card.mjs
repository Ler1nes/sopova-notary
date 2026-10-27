import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = process.cwd();
const outDir = path.join(root, 'business-card');
fs.mkdirSync(outDir, { recursive: true });

const fontFile = (pkg, name) =>
  path.join(root, 'node_modules', '@fontsource', pkg, 'files', name);

const b64 = (file) => fs.readFileSync(file).toString('base64');

const cyrillic =
  'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const latin =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const face = (family, weight, file, range) => `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: block;
  src: url(data:font/woff2;base64,${b64(file)}) format('woff2');
  unicode-range: ${range};
}`;

const fonts = [
  face('Cormorant Garamond', 500, fontFile('cormorant-garamond', 'cormorant-garamond-cyrillic-500-normal.woff2'), cyrillic),
  face('Cormorant Garamond', 500, fontFile('cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff2'), latin),
  face('Manrope', 400, fontFile('manrope', 'manrope-cyrillic-400-normal.woff2'), cyrillic),
  face('Manrope', 400, fontFile('manrope', 'manrope-latin-400-normal.woff2'), latin),
  face('Manrope', 600, fontFile('manrope', 'manrope-cyrillic-600-normal.woff2'), cyrillic),
  face('Manrope', 600, fontFile('manrope', 'manrope-latin-600-normal.woff2'), latin),
].join('\n');

const scales = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M16 7v18M10 25h12M5.5 11.5h21"/>
  <path d="M5.5 11.5 2 19h7l-3.5-7.5Z"/>
  <path d="M26.5 11.5 23 19h7l-3.5-7.5Z"/>
  <circle cx="16" cy="5.4" r="1.5" fill="currentColor" stroke="none"/>
</svg>`;

const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<title>Визитка — Сопова А.В.</title>
<style>
${fonts}

:root {
  --ink: #08090b;
  --paper: #f1ece2;
  --paper-2: #d8d1c2;
  --muted: #9c978c;
  --muted-2: #6f6b63;
  --brass: #c9a25e;
  --brass-2: #e3c083;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

@page { size: 96mm 56mm; margin: 0; }

html, body {
  background: #08090b;
  color: var(--paper);
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.sheet {
  position: relative;
  width: 96mm;
  height: 56mm;
  overflow: hidden;
  background:
    radial-gradient(75% 95% at 50% -12%, rgba(201, 162, 94, 0.22), transparent 62%),
    radial-gradient(55% 70% at 105% 110%, rgba(116, 136, 168, 0.07), transparent 70%),
    linear-gradient(155deg, #0d1014 0%, #08090b 48%, #050607 100%);
  page-break-after: always;
  break-after: page;
}

.sheet:last-of-type { page-break-after: auto; break-after: auto; }

.sheet::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: ${noise};
  opacity: 0.045;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.trim {
  position: absolute;
  left: 3mm;
  top: 3mm;
  width: 90mm;
  height: 50mm;
  overflow: hidden;
}

.frame {
  position: absolute;
  inset: 5mm;
  border: 0.25pt solid rgba(201, 162, 94, 0.34);
}

.content {
  position: absolute;
  inset: 7mm 7mm 7mm 7mm;
}

/* ---------- front ---------- */

.front .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mark {
  width: 11mm;
  height: 11mm;
  border: 0.3pt solid rgba(201, 162, 94, 0.55);
  display: grid;
  place-items: center;
  color: var(--brass);
  margin-bottom: 3.2mm;
}

.mark svg { width: 6.6mm; height: 6.6mm; }

.brand {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: 16pt;
  line-height: 1;
  letter-spacing: 0.18em;
  text-indent: 0.18em;
  color: var(--paper);
}

.tagline {
  margin-top: 2.4mm;
  font-size: 4.1pt;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-indent: 0.34em;
  text-transform: uppercase;
  color: var(--muted);
}

.rule {
  width: 15mm;
  height: 0.3pt;
  background: var(--brass);
  opacity: 0.75;
  margin: 3.4mm 0 2.6mm;
}

.city {
  font-size: 3.7pt;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  text-transform: uppercase;
  color: var(--brass);
}

/* ---------- back ---------- */

.back .content {
  display: flex;
  flex-direction: column;
  height: 36mm;
}

.back-top {
  display: flex;
  align-items: center;
  gap: 2.2mm;
}

.mark--sm {
  width: 5.4mm;
  height: 5.4mm;
  margin: 0;
  border-width: 0.25pt;
}

.mark--sm svg { width: 3.4mm; height: 3.4mm; }

.top-role {
  font-size: 3.6pt;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--brass);
}

.top-city {
  margin-left: auto;
  font-size: 3.4pt;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.divider {
  height: 0.25pt;
  background: rgba(236, 228, 212, 0.16);
  margin: 2.2mm 0 2.4mm;
}

.person {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: 9.6pt;
  line-height: 1.05;
  letter-spacing: 0.015em;
}

.phone {
  margin-top: 1.8mm;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 11.6pt;
  line-height: 1;
  letter-spacing: 0.035em;
  color: var(--brass-2);
  font-variant-numeric: lining-nums tabular-nums;
}

.addr {
  margin-top: 1.8mm;
  font-size: 5pt;
  line-height: 1.45;
  letter-spacing: 0.01em;
  color: var(--muted);
}

.bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1.1mm;
}

.line {
  font-size: 4.7pt;
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--paper-2);
}

.line .accent {
  color: var(--brass);
  font-weight: 600;
}

.license {
  margin-top: 0.6mm;
  font-size: 3.3pt;
  letter-spacing: 0.04em;
  color: var(--muted-2);
}

.license b { font-weight: 600; color: var(--muted); }
</style>
</head>
<body>

  <section class="sheet front">
    <div class="trim">
      <div class="frame"></div>
      <div class="content">
        <div class="mark">${scales}</div>
        <div class="brand">СОПОВА А.В.</div>
        <div class="tagline">Нотариальная контора</div>
        <div class="rule"></div>
        <div class="city">Апшеронск · Краснодарский край</div>
      </div>
    </div>
  </section>

  <section class="sheet back">
    <div class="trim">
      <div class="frame"></div>
      <div class="content">
        <div class="back-top">
          <span class="mark mark--sm">${scales}</span>
          <span class="top-role">Нотариус</span>
          <span class="top-city">Апшеронск</span>
        </div>

        <div class="divider"></div>

        <div class="person">Сопова Альвина Вагинаковна</div>
        <div class="phone">+7 (918) 429-72-34</div>
        <div class="addr">ул. Профсоюзная, 43, 1 этаж<br />352690, Апшеронск, Краснодарский край</div>

        <div class="bottom">
          <div class="line">Вт–Пт 09:00–17:00 · Сб 10:00–15:00</div>
          <div class="line"><span class="accent">Telegram</span> · t.me/+79184297234</div>
          <div class="license"><b>Лицензия</b> № 638 от 29.10.2014</div>
        </div>
      </div>
    </div>
  </section>

</body>
</html>`;

const htmlPath = path.join(outDir, 'card.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = await context.newPage();

await page.setViewportSize({ width: 420, height: 620 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

await page.pdf({
  path: path.join(outDir, 'sopova-card.pdf'),
  width: '96mm',
  height: '56mm',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

// 300 dpi: 96 CSS px на дюйм → zoom 3.125
await page.evaluate(() => {
  document.documentElement.style.zoom = '3.125';
});
await page.waitForTimeout(250);

for (const side of ['front', 'back']) {
  const trim = page.locator(`.${side} .trim`);
  await trim.scrollIntoViewIfNeeded();
  await trim.screenshot({ path: path.join(outDir, `preview-${side}.png`) });
}

console.log('card: pdf + png ready');
process.exit(0);
