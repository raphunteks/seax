import fs from "fs";
import path from "path";

console.log("=== RUNNING E2E OPEN GRAPH & SOCIAL PREVIEW AUDIT ===");

const distDir = path.resolve("./dist");
const indexHtmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexHtmlPath)) {
  console.error("FAIL: dist/index.html does not exist! Please build first.");
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, "utf-8");

// Helper to extract meta tag content
function getMeta(propertyOrName, val) {
  const reg1 = new RegExp(`<meta\\s+[^>]*${propertyOrName}=["']${val}["'][^>]*content=["']([^"']+)["']`, "i");
  const reg2 = new RegExp(`<meta\\s+[^>]*content=["']([^"']+)["'][^>]*${propertyOrName}=["']${val}["']`, "i");
  const m = html.match(reg1) || html.match(reg2);
  return m ? m[1] : null;
}

const tests = [
  { name: "og:title", val: getMeta("property", "og:title"), required: true },
  { name: "og:description", val: getMeta("property", "og:description"), required: true },
  { name: "og:url", val: getMeta("property", "og:url"), required: true },
  { name: "og:type", val: getMeta("property", "og:type"), required: true },
  { name: "og:site_name", val: getMeta("property", "og:site_name"), required: true },
  { name: "og:image (primary)", val: getMeta("property", "og:image"), required: true },
  { name: "og:image:type", val: getMeta("property", "og:image:type"), required: true },
  { name: "og:image:width", val: getMeta("property", "og:image:width"), required: true },
  { name: "og:image:height", val: getMeta("property", "og:image:height"), required: true },
  { name: "twitter:card", val: getMeta("name", "twitter:card"), required: true },
  { name: "twitter:title", val: getMeta("name", "twitter:title"), required: true },
  { name: "twitter:description", val: getMeta("name", "twitter:description"), required: true },
  { name: "twitter:image", val: getMeta("name", "twitter:image"), required: true },
  { name: "geo.region", val: getMeta("name", "geo.region"), required: true },
  { name: "geo.placename", val: getMeta("name", "geo.placename"), required: true },
  { name: "geo.position", val: getMeta("name", "geo.position"), required: true },
  { name: "ICBM", val: getMeta("name", "ICBM"), required: true },
];

let failed = false;
console.log("\n1. META TAGS CHECK:");
tests.forEach((t) => {
  if (!t.val && t.required) {
    console.error(`❌ [FAIL] Missing ${t.name}`);
    failed = true;
  } else {
    console.log(`✅ [PASS] ${t.name}: "${t.val}"`);
  }
});

// Check domain resolution check
console.log("\n2. DOMAIN RESOLUTION & URL INTEGRITY CHECK:");
const ogImage = getMeta("property", "og:image");
if (ogImage.includes("kopisea.com")) {
  console.error("❌ [FAIL] og:image still references non-existent 'kopisea.com'!");
  failed = true;
} else if (ogImage.startsWith("https://kopisea.vercel.app/")) {
  console.log(`✅ [PASS] og:image correctly points to live deployment: ${ogImage}`);
} else {
  console.warn(`⚠️ [WARN] Unexpected domain in og:image: ${ogImage}`);
}

// Check local assets on disk
console.log("\n3. IMAGE ASSETS INTEGRITY CHECK:");
const imageFiles = ["brand/og-image.jpg", "brand/og-image.png"];
imageFiles.forEach((rel) => {
  const p = path.join(distDir, rel);
  if (!fs.existsSync(p)) {
    console.error(`❌ [FAIL] Asset missing in dist: ${rel}`);
    failed = true;
  } else {
    const stats = fs.statSync(p);
    const kb = (stats.size / 1024).toFixed(1);
    console.log(`✅ [PASS] Asset exists: dist/${rel} (${kb} KB)`);
    if (stats.size > 300 * 1024) {
      console.warn(`⚠️ [WARN] Asset ${rel} is > 300 KB (${kb} KB) - might be rejected by WhatsApp!`);
    } else {
      console.log(`   └─ Size optimal for WhatsApp preview (< 300 KB threshold)`);
    }
  }
});

// Check JSON-LD
console.log("\n4. STRUCTURED DATA (JSON-LD) CHECK:");
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!jsonLdMatch) {
  console.error("❌ [FAIL] Missing application/ld+json");
  failed = true;
} else {
  try {
    const data = JSON.parse(jsonLdMatch[1]);
    console.log(`✅ [PASS] JSON-LD is valid syntax. Type: ${JSON.stringify(data["@type"])}, Name: ${data.name}`);
    if (data.image?.includes("kopisea.com")) {
      console.error("❌ [FAIL] JSON-LD image still references kopisea.com");
      failed = true;
    } else {
      console.log(`✅ [PASS] JSON-LD image points to: ${data.image}`);
    }
  } catch (err) {
    console.error("❌ [FAIL] JSON-LD invalid JSON:", err);
    failed = true;
  }
}

if (failed) {
  console.error("\n❌ E2E AUDIT FAILED!");
  process.exit(1);
} else {
  console.log("\n🎉 ALL E2E AUDITS PASSED WITH FLYING COLORS!");
}
