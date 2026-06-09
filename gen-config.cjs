// Generates api/config.php at deploy/build time from secret environment
// variables so the admin token is never committed to the (public) repo and
// survives every redeploy. Runs as the last step of `npm run build`.
//
// Required Hostinger build env var:
//   ADMIN_TOKEN   - bearer token the dscc-admin dashboard authenticates with
// Optional:
//   ADMIN_NOTIFY_EMAIL - overrides the address that receives new-lead alerts
const fs = require("fs");
const path = require("path");

const token = process.env.ADMIN_TOKEN || process.env.DSCC_ADMIN_TOKEN || "";

if (!token) {
  console.log("[gen-config] ADMIN_TOKEN not set — skipping config.php (admin will be disabled)");
  process.exit(0);
}

const phpStr = (v) => "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";

const lines = ["<?php", "define('ADMIN_TOKEN', " + phpStr(token) + ");"];
if (process.env.ADMIN_NOTIFY_EMAIL) {
  lines.push("define('ADMIN_NOTIFY_EMAIL', " + phpStr(process.env.ADMIN_NOTIFY_EMAIL) + ");");
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
