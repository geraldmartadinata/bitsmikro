import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const url = process.argv[2] ?? "http://localhost:4200/";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";

const thresholds = {
  performance: 0.8,
  accessibility: 0.9,
  "best-practices": 0.9,
  seo: 0.9,
};

const chrome = await launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

const budgets = JSON.parse(
  fs.readFileSync(path.join(ROOT, "lighthouse-budget.json"), "utf8"),
);

const results = await lighthouse(
  url,
  {
    port: chrome.port,
    output: "json",
    onlyCategories: Object.keys(thresholds),
    formFactor: "desktop",
    screenEmulation: { mobile: false, width: 1350, height: 940 },
  },
  {
    extends: "lighthouse:default",
    settings: { budgets },
  },
);
try {
  await chrome.kill();
} catch {
  try {
    process.kill(chrome.pid);
  } catch {
    /* already gone */
  }
}

if (!results || !results.lhr) {
  console.error("Lighthouse run produced no result.");
  process.exit(1);
}

const reportPath = path.join(ROOT, "lighthouse-report.json");
fs.writeFileSync(reportPath, JSON.stringify(results.lhr, null, 2));

const scores = {};
let failed = false;
for (const [cat, min] of Object.entries(thresholds)) {
  const score = results.lhr.categories[cat]?.score ?? 0;
  scores[cat] = score;
  const ok = score >= min;
  if (!ok) failed = true;
  console.log(`${ok ? "PASS" : "FAIL"}  ${cat}: ${(score * 100).toFixed(1)} (min ${min * 100})`);
}

const resources = results.lhr.audits?.["network-requests"]?.details?.items ?? [];
const budgetRules = JSON.parse(
  fs.readFileSync(path.join(ROOT, "lighthouse-budget.json"), "utf8"),
)[0];
const sums = { script: 0, stylesheet: 0, total: 0, font: 0, image: 0 };
for (const item of resources) {
  const size = item.transferSize ?? 0;
  sums.total += size;
  const type = (item.resourceType ?? "other").toLowerCase();
  if (type in sums) sums[type] += size;
}
for (const rule of budgetRules.resourceSizes ?? []) {
  const used = sums[rule.resourceType] ?? 0;
  const ok = used <= rule.budget;
  if (!ok) failed = true;
  console.log(
    `${ok ? "PASS" : "FAIL"}  budget ${rule.resourceType}: ${(used / 1024).toFixed(0)}KB (budget ${(rule.budget / 1024).toFixed(0)}KB)`,
  );
}
console.log(
  `INFO  transfer breakdown: script=${(sums.script / 1024).toFixed(0)}KB css=${(sums.stylesheet / 1024).toFixed(0)}KB image=${(sums.image / 1024).toFixed(0)}KB font=${(sums.font / 1024).toFixed(0)}KB total=${(sums.total / 1024).toFixed(0)}KB`,
);

console.log(`\nReport: ${reportPath}`);
process.exit(failed ? 1 : 0);
