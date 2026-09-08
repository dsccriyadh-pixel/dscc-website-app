// Keeps every pre-rendered SEO page on the same consent/tracking bootstrap as
// the canonical deployment index. The hosting release step promotes these
// pages after the normal build, so stale inline tracking must never survive.
const fs = require("fs");
const path = require("path");

const marker = "/* Consent Mode v2";
const bootstrapPattern = /<script>\s*(\/\* Consent Mode v2[\s\S]*?)<\/script>/;
const canonical = fs.readFileSync(path.resolve("_prebuilt/index.html"), "utf8");
const canonicalMatch = canonical.match(bootstrapPattern);
if (!canonicalMatch) throw new Error("Canonical consent bootstrap is missing");
const replacement = canonicalMatch[0];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

let updated = 0;
for (const root of process.argv.slice(2)) {
  if (!fs.existsSync(root)) throw new Error(`Build output does not exist: ${root}`);
  for (const file of walk(root)) {
    if (!file.endsWith(".html")) continue;
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes(marker)) continue;
    const next = html.replace(bootstrapPattern, replacement);
    if (next === html && !html.includes('metaPixel: "2767855866945056"')) {
      throw new Error(`Failed to update tracking bootstrap in ${file}`);
    }
    fs.writeFileSync(file, next);
    updated += 1;
  }
}

if (updated < 2) throw new Error("No pre-rendered tracking pages were updated");
console.log(`[tracking] synchronized ${updated} HTML pages`);
