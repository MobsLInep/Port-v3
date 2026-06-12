import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:5173/";
const out = process.argv[3] || "clone";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push("PAGEERR: " + e.message));

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
// wait for loader to fully disappear
await page.waitForSelector(".loader", { state: "detached", timeout: 12000 }).catch(() => {});
await page.waitForTimeout(Number(process.argv[4] || 3000)); // 3D mount + reveals settle

await page.screenshot({ path: `/tmp/${out}-top.png` });

// scroll through and capture full page
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2500);
await page.screenshot({ path: `/tmp/${out}-full.png`, fullPage: true });

console.log("ERRORS:", errors.length ? errors.slice(0, 15).join("\n") : "none");
await browser.close();
