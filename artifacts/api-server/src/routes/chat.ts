import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { DSCC_SYSTEM_PROMPT } from "../lib/dsccKnowledge";

const router: IRouter = Router();

const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;

const client =
  baseURL && apiKey
    ? new Anthropic({ baseURL, apiKey })
    : null;

interface IncomingMsg {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 20;
const MAX_LEN = 4000;

function sanitizeHistory(input: unknown): IncomingMsg[] {
  if (!Array.isArray(input)) return [];
  const out: IncomingMsg[] = [];
  for (const m of input.slice(-MAX_HISTORY)) {
    if (!m || typeof m !== "object") continue;
    const role = (m as any).role;
    const content = (m as any).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed.slice(0, MAX_LEN) });
  }
  return out;
}

router.post("/chat", async (req, res): Promise<void> => {
  if (!client) {
    res.status(503).json({ ok: false, error: "AI assistant not configured." });
    return;
  }
  try {
    const messages = sanitizeHistory(req.body?.messages);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      res.status(400).json({ ok: false, error: "Last message must be from user." });
      return;
    }

    const completion = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: DSCC_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const block = completion.content[0];
    const text = block && block.type === "text" ? block.text : "";

    res.json({ ok: true, reply: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown";
    (req as unknown as { log?: { error?: (o: object, m: string) => void } }).log?.error?.({ err: msg }, "chat error");
    res.status(500).json({ ok: false, error: "Chat failed." });
  }
});

export default router;
