import { chromium } from "playwright-core";

const url = process.env.ZENSE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
const h1Font = await page.evaluate(() => {
  const el = document.querySelector("h1");
  return el ? getComputedStyle(el).fontFamily : "NOT_FOUND";
});
const interLoaded = await page.evaluate(() => document.fonts.check("16px Inter"));
const serifLoaded = await page.evaluate(() =>
  document.fonts.check("48px 'Instrument Serif'"),
);

console.log(`body font-family:        ${bodyFont}`);
console.log(`h1 font-family:          ${h1Font}`);
console.log(`'Inter' actually loaded: ${interLoaded}`);
console.log(`'Instrument Serif' loaded: ${serifLoaded}`);

const ok =
  /inter/i.test(bodyFont) &&
  /instrument serif/i.test(h1Font) &&
  interLoaded &&
  serifLoaded;

console.log(ok ? "FONT_CHECK_OK" : "FONT_CHECK_FAIL");
await browser.close();
process.exit(ok ? 0 : 1);