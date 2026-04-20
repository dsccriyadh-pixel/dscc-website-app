import type { Request, Response, NextFunction } from "express";

const IS_PROD = process.env["NODE_ENV"] === "production";
const ENV_TOKEN = process.env["ADMIN_TOKEN"];

if (IS_PROD && !ENV_TOKEN) {
  // Fail loud at startup in production rather than fall back to a known token.
  throw new Error(
    "ADMIN_TOKEN environment variable is required in production. Refusing to start with an insecure default.",
  );
}

const ADMIN_TOKEN = ENV_TOKEN || "dscc-dev-token";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers["authorization"] || "";
  const headerToken =
    typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const altHeader = req.headers["x-admin-token"];
  const altToken = typeof altHeader === "string" ? altHeader : "";
  const token = headerToken || altToken;
  if (!token || !timingSafeEqual(token, ADMIN_TOKEN)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function adminTokenInfo(): { configured: boolean } {
  return { configured: !!ENV_TOKEN };
}
