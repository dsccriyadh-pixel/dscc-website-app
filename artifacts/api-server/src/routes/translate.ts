import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

const client =
  baseURL && apiKey ? new Anthropic({ baseURL, apiKey }) : null;

const MAX_LEN = 4000;
const cache = new Map<string, { value: string; ts: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function detectLang(text: string): "ar" | "en" | "other" {
  const arabic = /[\u0600-\u06FF]/.test(text);
  const latin = /[A-Za-z]/.test(text);
  if (arabic && !latin) return "ar";
  if (latin && !arabic) return "en";
  if (arabic) return "ar";
  if (latin) return "en";
  return "other";
}

function cacheKey(text: string, target: string): string {
  return `${target}::${text}`;
}

router.post("/translate", async (req, res): Promise<void> => {
  try {
    const rawText = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    const target = req.body?.target === "ar" ? "ar" : "en";
    if (!rawText) {
      res.json({ ok: true, text: "", translated: "" });
      return;
    }
    const text = rawText.slice(0, MAX_LEN);
    const detected = detectLang(text);

    if (detected === target || detected === "other") {
      res.json({ ok: true, text, translated: text, skipped: true });
      return;
    }

    const key = cacheKey(text, target);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
      res.json({ ok: true, text, translated: hit.value, cached: true });
      return;
    }

    if (!client) {
      res.json({ ok: true, text, translated: text, skipped: true });
      return;
    }

    const targetName = target === "en" ? "English" : "Arabic";
    const completion = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system:
        `You are a precise translator for a Saudi Arabia cleaning & facility services company (DSCC). ` +
        `Translate the user's text to ${targetName}. ` +
        `Rules: ` +
        `1) Output ONLY the translation, no preamble, no quotes, no notes. ` +
        `2) Preserve numbers, phone numbers, emails, URLs, and proper names exactly. ` +
        `3) Keep the same meaning, tone, and line breaks. ` +
        `4) If text is already in ${targetName}, return it unchanged. ` +
        `5) Use natural professional ${targetName}.`,
      messages: [{ role: "user", content: text }],
    });

    const block = completion.content[0];
    const out = block && block.type === "text" ? block.text.trim() : text;
    cache.set(key, { value: out, ts: Date.now() });
    res.json({ ok: true, text, translated: out });
  } catch (err) {
    req.log?.error?.({ err }, "translate failed");
    res.status(500).json({ ok: false, error: "Translation failed" });
  }
});

export default router;
