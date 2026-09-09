// Add or replace only the Meta bootstrap. The existing Google Consent Mode
// bootstrap remains authoritative and must never be removed by this script.
const fs = require("fs");
const path = require("path");
const { html: trackingBootstrap, MARKER } = require("./artifacts/dscc-website/scripts/tracking-bootstrap.cjs");

const bootstrapPattern = /<script>\s*\/\* DSCC consent-gated tracking bootstrap \*\/[\s\S]*?<\/script>/g;

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
    const cleaned = html.replace(bootstrapPattern, "");
    const next = cleaned.includes("</head>")
      ? cleaned.replace(/<\/head>/i, `${trackingBootstrap()}\n</head>`)
      : `${cleaned}\n${trackingBootstrap()}\n`;
    if ((next.match(new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1) {
      throw new Error(`Tracking bootstrap must occur exactly once in ${file}`);
    }
    fs.writeFileSync(file, next);
    updated += 1;
  }
}
if (updated < 1) throw new Error("No HTML pages were updated");
console.log(`[tracking] synchronized ${updated} HTML pages`);