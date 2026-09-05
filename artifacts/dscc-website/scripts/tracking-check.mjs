import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function bootstrapScript(html) {
  const match = html.match(/<script>\s*(\/\* Consent Mode v2[\s\S]*?)<\/script>/);
  assert(match, "Consent bootstrap script is missing from index.html");
  return match[1]
    .replaceAll("__DSCC_GTM_CONTAINER_ID__", "GTM-TEST")
    .replaceAll("__DSCC_GA4_MEASUREMENT_ID__", "G-TEST")
    .replaceAll("__DSCC_GOOGLE_ADS_ID__", "AW-TEST")
    .replaceAll("__DSCC_TRACKING_TEST_MODE__", "false");
}

function runConsentScenario(script, consent) {
  const scripts = [];
  const dataLayer = [];
  const localStorage = {
    getItem(key) {
      return key === "dscc_google_consent_v2" && consent ? JSON.stringify(consent) : null;
    },
  };
  const location = {
    hostname: "dsccsaudia.com",
    pathname: "/",
    search: "",
    hash: "",
  };
  const window = {
    location,
    dataLayer,
    dispatchEvent() {},
  };
  const document = {
    head: { appendChild(node) { scripts.push(node.src); node.onload?.(); } },
    createElement() { return { async: false, src: "", onload: undefined }; },
  };
  const context = {
    window,
    document,
    localStorage,
    location,
    history: { state: null, replaceState() {} },
    URLSearchParams,
    CustomEvent: class CustomEvent { constructor(type) { this.type = type; } },
    Date,
    encodeURIComponent,
  };
  window.window = window;
  vm.runInNewContext(script, context);
  return { scripts, dataLayer };
}

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : target;
  }));
  return files.flat();
}

const denied = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};
const measurementOnly = { ...denied, analytics_storage: "granted" };
const fullConsent = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

const [html, tracking, leads, eventTracker] = await Promise.all([
  read("index.html"),
  read("src/lib/tracking.ts"),
  read("src/lib/leads.ts"),
  read("src/lib/eventTracker.ts"),
]);

const { createAdsConversionDispatcher } = await import(pathToFileURL(path.join(root, "src/lib/conversionDispatcher.js")).href);
let adsConsent = false;
const dispatched = [];
const dispatchConversion = createAdsConversionDispatcher(
  () => adsConsent,
  async (kind, event_id, options) => {
    dispatched.push({
      kind,
      event_id,
      options,
      transports: ["pagead", "ccm", "1p"],
    });
  },
);

await dispatchConversion("form", "lead-denied");
assert.equal(dispatched.length, 0, "No-consent mode must not dispatch an Ads conversion");
await dispatchConversion("form", "lead-measurement-only");
assert.equal(dispatched.length, 0, "Measurement-only mode must not dispatch an Ads conversion");

adsConsent = true;
await Promise.all([
  dispatchConversion("form", "lead-shared", { customer: { email: "customer@example.test", phone: "0500000000" } }),
  dispatchConversion("form", "lead-shared", { customer: { email: "customer@example.test", phone: "0500000000" } }),
]);
assert.equal(dispatched.filter(({ event_id }) => event_id === "lead-shared").length, 1, "Duplicate form paths with one event_id must dispatch one Google conversion");

await Promise.all([
  dispatchConversion("whatsapp", "whatsapp-shared"),
  dispatchConversion("whatsapp", "whatsapp-shared"),
  dispatchConversion("phone", "phone-shared"),
  dispatchConversion("phone", "phone-shared"),
]);
assert.equal(dispatched.filter(({ kind }) => kind === "whatsapp").length, 1, "WhatsApp must dispatch once for one event_id");
assert.equal(dispatched.filter(({ kind }) => kind === "phone").length, 1, "Phone must dispatch once for one event_id");
assert.equal(new Set(dispatched.flatMap(({ event_id, transports }) => transports.map(() => event_id))).size, 3, "Google transport fan-out must be deduplicated by event_id");

const script = bootstrapScript(html);
const noConsent = runConsentScenario(script, null);
assert.deepEqual(noConsent.scripts, [], "No-consent mode must not load Google, GTM, or Metricool");

const measurement = runConsentScenario(script, measurementOnly);
assert.equal(measurement.scripts.filter((url) => url.includes("/gtag/js")).length, 1, "Measurement-only mode must load gtag.js once");
assert.equal(measurement.scripts.filter((url) => url.includes("/gtm.js")).length, 0, "Measurement-only mode must not load GTM");
assert.equal(measurement.scripts.filter((url) => url.includes("snap")).length, 0, "Measurement-only mode must not load Snapchat");

const full = runConsentScenario(script, fullConsent);
assert.equal(full.scripts.filter((url) => url.includes("/gtag/js")).length, 1, "Full-consent mode must load gtag.js once");
assert.equal(full.scripts.filter((url) => url.includes("/gtm.js")).length, 1, "Full-consent mode must load GTM once");
assert.equal(new Set(full.scripts).size, full.scripts.length, "Tracking bootstrap must not load duplicate script URLs");

assert.equal(count(html, /googletagmanager\.com\/gtag\/js/g), 1, "index.html must contain one gtag.js loader");
assert.equal(count(html, /googletagmanager\.com\/gtm\.js/g), 1, "index.html must contain one GTM loader");
assert.match(tracking, /createAdsConversionDispatcher<AdsConversionOptions>\(hasAdsConsent/, "Production Ads conversions must use the behaviorally tested consent and deduplication dispatcher");
assert.match(leads, /if \(res\.ok\)[\s\S]*pushDataLayer\("dscc_form_submission_success"[\s\S]*sendAdsConversion\("form", event_id/, "A server-accepted lead must emit one success event and one Ads conversion with the same event_id");
assert.match(leads, /if \(result\.ok === false\) return \{ ok: false, ref \};/, "A rejected server result must not emit a conversion");
assert.match(leads, /return \{ ok: false, ref \};[\s\S]*catch \{[\s\S]*return \{ ok: false, ref \};/, "HTTP and network failures must not emit a conversion");
assert.doesNotMatch(leads, /pushDataLayer\([^)]*(payload\.data|customer|email|phone)/s, "Raw lead data must never be pushed to dataLayer");

for (const kind of ["whatsapp", "phone"]) {
  const block = eventTracker.match(new RegExp(`if \\(standardizedType === "${kind}_click"\\) \\{([\\s\\S]*?)\\n  \\}`))?.[1] || "";
  assert.match(block, new RegExp(`sendAdsConversion\\("${kind}", eventId`), `${kind} must send Ads with the click event_id`);
  assert.equal(count(block, /sendAdsConversion\(/g), 1, `${kind} must issue one logical Ads conversion`);
}

// Google may fan one conversion out over several transports. Shared event IDs
// represent one logical conversion and must not be counted as duplicates.
const builtMode = process.argv.includes("--built") || process.argv.includes("--deploy") || process.argv.includes("--root-built");
if (builtMode) {
  const outputRoot = process.argv.includes("--deploy")
    ? path.resolve(root, "..", "..", "_prebuilt")
    : process.argv.includes("--root-built")
      ? path.resolve(root, "..", "..", "dist")
      : path.join(root, "dist/public");
  const files = (await walkFiles(outputRoot)).filter((file) => file.endsWith(".html") || file.endsWith(".js"));
  const outputs = await Promise.all(files.map(async (file) => ({ file, content: await readFile(file, "utf8") })));
  const built = outputs.map(({ content }) => content).join("\n");
  assert.doesNotMatch(built, /__DSCC_[A-Z0-9_]+__/, "Built output contains an unresolved tracking placeholder");
  for (const { file, content } of outputs) {
    assert.ok(count(content, /googletagmanager\.com\/gtag\/js/g) <= 1, `${path.relative(outputRoot, file)} contains duplicate gtag.js loaders`);
    assert.ok(count(content, /googletagmanager\.com\/gtm\.js/g) <= 1, `${path.relative(outputRoot, file)} contains duplicate GTM loaders`);
  }
}

console.log(`Tracking checks passed${builtMode ? " for source and built output" : ""}.`);