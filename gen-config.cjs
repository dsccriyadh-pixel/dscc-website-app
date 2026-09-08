// Generates api/config.php at deploy/build time from secret environment
// variables so admin and Meta CAPI secrets are never committed to the public
// repository and survive every redeploy. Runs during `npm run build`.
//
// Hostinger build environment variables:
//   ADMIN_TOKEN   - bearer token the dscc-admin dashboard authenticates with
//   META_CAPI_ACCESS_TOKEN - server-only Meta Conversions API token
// Optional:
//   ADMIN_NOTIFY_EMAIL - overrides the address that receives new-lead alerts
const fs = require("fs");
const path = require("path");

const token = process.env.ADMIN_TOKEN || process.env.DSCC_ADMIN_TOKEN || "";
const metaCapiToken = process.env.META_CAPI_ACCESS_TOKEN || "";
const metaPixelId = process.env.META_PIXEL_ID || "2767855866945056";
const metaTestEventCode = process.env.META_CAPI_TEST_EVENT_CODE || "";

if (!token && !metaCapiToken) {
  console.log("[gen-config] no server secrets set — skipping config.php (admin and Meta CAPI will be disabled)");
  process.exit(0);
}

const phpStr = (v) => "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";

const lines = ["<?php"];
if (token) {
  lines.push("define('ADMIN_TOKEN', " + phpStr(token) + ");");
}
if (process.env.ADMIN_USERNAME) {
  lines.push("define('ADMIN_USERNAME', " + phpStr(process.env.ADMIN_USERNAME) + ");");
}
if (process.env.ADMIN_PASSWORD) {
  lines.push("define('ADMIN_PASSWORD', " + phpStr(process.env.ADMIN_PASSWORD) + ");");
}
if (process.env.ADMIN_NOTIFY_EMAIL) {
  lines.push("define('ADMIN_NOTIFY_EMAIL', " + phpStr(process.env.ADMIN_NOTIFY_EMAIL) + ");");
}
if (process.env.OPENAI_API_KEY) {
  lines.push("define('OPENAI_API_KEY', " + phpStr(process.env.OPENAI_API_KEY) + ");");
}
if (metaCapiToken) {
  lines.push("define('META_CAPI_ACCESS_TOKEN', " + phpStr(metaCapiToken) + ");");
  lines.push("define('META_PIXEL_ID', " + phpStr(metaPixelId) + ");");
  if (metaTestEventCode) {
    lines.push("define('META_CAPI_TEST_EVENT_CODE', " + phpStr(metaTestEventCode) + ");");
  }
}
const content = lines.join("\n") + "\n";

const targets = ["dist/api", "artifacts/dscc-website/dist/public/api"];
for (const dir of targets) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "config.php"), content);
    console.log("[gen-config] wrote", path.join(dir, "config.php"));
  } catch (e) {
    console.log("[gen-config] skip", dir, "-", e.message);
  }
}
