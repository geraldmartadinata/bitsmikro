import fs from "node:fs";

const landing = fs.readFileSync(".next/static/chunks/1_mu78enkgkv9.js", "utf8");
console.log("landing imports framer chunk:", landing.includes("0jptq8-5kqh1o"));
console.log("landing has dynamic import():" , /\bimport\(/.test(landing));

const r = JSON.parse(fs.readFileSync("lighthouse-report.json", "utf8"));
const boot = r.audits["bootup-time"];
if (boot) {
  console.log("\n--- bootup-time ---");
  for (const i of boot.details.items) {
    console.log(i.url.split("/").pop().slice(0, 40).padEnd(42), "total", i.total.toFixed(0).padStart(5), "scripting", i.scripting.toFixed(0));
  }
}
