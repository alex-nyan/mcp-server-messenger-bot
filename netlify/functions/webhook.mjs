import crypto from "crypto";
import { getReply } from "./counselor.js";

const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || "";
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || "";
const FB_APP_SECRET = process.env.FB_APP_SECRET || "";
const FB_GRAPH_API = "https://graph.facebook.com/v21.0";

function verifySignature(rawBody, signatureHeader) {
  if (!FB_APP_SECRET) return true;
  if (!signatureHeader) return false;
  const elements = signatureHeader.split("=");
  const signatureHash = elements[1];
  const expectedHash = crypto
    .createHmac("sha256", FB_APP_SECRET)
    .update(rawBody)
    .digest("hex");
  return signatureHash === expectedHash;
}

async function sendMessageToUser(recipientId, text) {
  if (!FB_PAGE_ACCESS_TOKEN) return;
  await fetch(`${FB_GRAPH_API}/me/messages?access_token=${encodeURIComponent(FB_PAGE_ACCESS_TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
      messaging_type: "RESPONSE",
    }),
  });
}

async function respondToUser(senderId, userText) {
  try {
    const reply = await getReply(userText);
    await sendMessageToUser(senderId, reply);
  } catch (err) {
    console.error("Reply error:", err?.message);
  }
}

async function handleMessage(senderId, message) {
  if (message.text) {
    const t = message.text.trim().toLowerCase();
    if (t === "my psid" || t === "what's my id" || t === "what is my id" || t === "my id") {
      await sendMessageToUser(senderId, `Your PSID is: ${senderId}\n\nUse this when testing with send-one.mjs or the MCP send_message tool.`);
      return;
    }
    await respondToUser(senderId, message.text);
  }
  if (message.attachments?.length && !message.text) {
    await respondToUser(
      senderId,
      "I received your attachment. I'm best at answering questions about scholarships, OSSD, GED, A-Levels, IGCSE, and foundation programs. Send me a text question!"
    );
  }
}

async function processBody(body) {
  if (!body || body.object !== "page") return;
  const entries = Array.isArray(body.entry) ? body.entry : [];
  for (const entry of entries) {
    const messaging = entry.messaging;
    if (!Array.isArray(messaging)) continue;
    for (const ev of messaging) {
      const senderId = ev.sender?.id;
      if (!senderId) continue;
      if (ev.message) await handleMessage(senderId, ev.message);
      // postback, delivery, read can be handled here if needed
    }
  }
}

export async function handler(event) {
  const method = event.httpMethod || event.request?.method || "GET";
  const rawBody = typeof event.body === "string" ? event.body : (event.body ? JSON.stringify(event.body) : "");

  // GET — webhook verification or info
  if (method === "GET") {
    // Netlify/Lambda: query params can be in queryStringParameters (or multiValue)
    const q = event.queryStringParameters || {};
    const multi = event.multiValueQueryStringParameters || {};
    const getParam = (key) => q[key] ?? (Array.isArray(multi[key]) ? multi[key][0] : undefined);
    const mode = getParam("hub.mode");
    const token = getParam("hub.verify_token");
    const challenge = getParam("hub.challenge");
    const ourToken = (FB_VERIFY_TOKEN || "").trim();

    if (mode === "subscribe" && token !== undefined && challenge !== undefined) {
      if (!ourToken) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
          body:
            "<h1>Webhook not configured</h1><p>Set <strong>FB_VERIFY_TOKEN</strong> in Netlify: Site settings → Environment variables. Use the same value as &quot;Verify token&quot; in Facebook App → Webhooks.</p>",
        };
      }
      if (token === ourToken) {
        return { statusCode: 200, body: String(challenge) };
      }
    }
    if (!mode && !token) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
        body:
          "<h1>Webhook endpoint</h1>" +
          "<p>Use this as <strong>Callback URL</strong> in Facebook App → Webhooks:</p>" +
          "<p><code>https://YOUR-SITE.netlify.app/.netlify/functions/webhook</code></p>" +
          "<p>Set <strong>FB_VERIFY_TOKEN</strong> in Netlify (same value as Verify token in Facebook).</p>",
      };
    }
    return { statusCode: 403, body: "Forbidden" };
  }

  // POST — incoming webhook events
  if (method === "POST") {
    const signature = event.headers?.["x-hub-signature-256"] || event.headers?.["X-Hub-Signature-256"];
    if (!verifySignature(rawBody, signature)) {
      return { statusCode: 403, body: "Invalid signature" };
    }
    let body;
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return { statusCode: 200, body: "EVENT_RECEIVED" };
    }
    await processBody(body);
    return { statusCode: 200, body: "EVENT_RECEIVED" };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
