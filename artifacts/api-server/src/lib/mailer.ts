import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = process.env["SMTP_HOST"];
const SMTP_PORT = process.env["SMTP_PORT"] ? Number(process.env["SMTP_PORT"]) : 587;
const SMTP_USER = process.env["SMTP_USER"];
const SMTP_PASS = process.env["SMTP_PASS"];
const SMTP_SECURE = process.env["SMTP_SECURE"] === "true" || SMTP_PORT === 465;
const MAIL_FROM = process.env["MAIL_FROM"] || (SMTP_USER ? `DSCC <${SMTP_USER}>` : "DSCC <no-reply@dsccsaudia.com>");
export const ADMIN_NOTIFY_EMAIL = process.env["ADMIN_NOTIFY_EMAIL"] || "tahabeam@gmail.com";

let transporter: Transporter | null = null;
let warned = false;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (!warned) {
      logger.warn(
        "SMTP credentials not configured (SMTP_HOST/SMTP_USER/SMTP_PASS). Emails will be logged only.",
      );
      warned = true;
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface MailResult {
  ok: boolean;
  delivered: boolean;
  error?: string;
}

export async function sendMail(msg: MailMessage): Promise<MailResult> {
  const t = getTransporter();
  if (!t) {
    logger.info({ to: msg.to, subject: msg.subject }, "[mail-stub] would send email");
    return { ok: true, delivered: false };
  }
  try {
    await t.sendMail({
      from: MAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo,
    });
    logger.info({ to: msg.to, subject: msg.subject }, "email sent");
    return { ok: true, delivered: true };
  } catch (err) {
    const e = err as Error;
    logger.error({ err: e.message, to: msg.to }, "email send failed");
    return { ok: false, delivered: false, error: e.message };
  }
}

export function isMailerConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}
