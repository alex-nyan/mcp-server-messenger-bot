import "dotenv/config";
import express, { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { getReply } from "./counselor.js";

const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || "";
const FB_GRAPH_API = "https://graph.facebook.com/v21.0";

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;

// Verify token: you choose this string. If not set, we generate one and print it.
let VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || "";
if (!VERIFY_TOKEN) {
  VERIFY_TOKEN = crypto.randomBytes(16).toString("hex");
  console.log("\n⚠️  No FB_VERIFY_TOKEN in .env — use this token for webhook verification:");
  console.log(`   FB_VERIFY_TOKEN=${VERIFY_TOKEN}`);
  console.log("   Add it to .env and enter the same value in your Facebook App → Webhooks.\n");
}

const APP_SECRET = process.env.FB_APP_SECRET || "";

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.type("text/html").send(
    `<h1>Messenger webhook server</h1>
     <p><a href="/webhook">/webhook</a> – Facebook callback &amp; verification</p>
     <p><a href="/health">/health</a> – Health check</p>`
  );
});

/**
 * Verify the webhook signature from Facebook
 */
function verifyRequestSignature(req: Request): boolean {
  if (!APP_SECRET) {
    console.warn("⚠️  FB_APP_SECRET not set – skipping signature verification (ok for local dev)");
    return true;
  }
  const signature = req.headers["x-hub-signature-256"] as string;
  
  if (!signature) {
    console.error("No signature found in request");
    return false;
  }

  const elements = signature.split("=");
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac("sha256", APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return signatureHash === expectedHash;
}

/**
 * Webhook verification endpoint
 * Facebook will call this to verify your webhook (GET with hub.mode, hub.verify_token, hub.challenge).
 * Browser visits get a friendly message instead of 403.
 */
app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = typeof req.query["hub.verify_token"] === "string"
    ? req.query["hub.verify_token"].trim()
    : undefined;
  const challenge = req.query["hub.challenge"];
  const ourToken = VERIFY_TOKEN.trim();

  // Log every verification attempt so you can debug
  console.log("[Webhook GET]", { mode, token: token ? "***" : undefined, hasChallenge: !!challenge, tokenMatch: token === ourToken });

  if (mode === "subscribe" && token === ourToken) {
    console.log("Webhook verified successfully");
    res.status(200).send(challenge);
  } else if (mode === undefined && token === undefined) {
    // Plain browser visit – show that the endpoint is up
    res.status(200).type("text/plain").send(
      "Webhook endpoint is running.\n\n" +
        "Facebook verification: GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE\n" +
        "Events: POST /webhook (with x-hub-signature-256)"
    );
  } else {
    console.error("Webhook verification failed – check mode, token, and that Facebook can reach this URL. Expected token length:", ourToken.length);
    res.sendStatus(403);
  }
});

/**
 * Webhook endpoint to receive messages and events
 */
app.post("/webhook", (req: Request, res: Response) => {
  console.log("\n🔔 POST /webhook received from Facebook");
  if (!verifyRequestSignature(req)) {
    console.error("Invalid signature – check FB_APP_SECRET in .env");
    return res.sendStatus(403);
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    console.log("  (empty or invalid body)");
    return res.status(200).send("EVENT_RECEIVED");
  }
  console.log("  object:", body.object, "| entries:", body.entry?.length ?? 0);

  if (body.object === "page") {
    const entries = Array.isArray(body.entry) ? body.entry : [];
    for (const entry of entries) {
      const messaging = entry.messaging;
      if (!Array.isArray(messaging)) continue;
      for (const webhookEvent of messaging) {
        console.log("Webhook event:", JSON.stringify(webhookEvent, null, 2));
        const senderId = webhookEvent.sender?.id;
        if (!senderId) continue;
        if (webhookEvent.message) {
          handleMessage(senderId, webhookEvent.message);
        } else if (webhookEvent.postback) {
          handlePostback(senderId, webhookEvent.postback);
        } else if (webhookEvent.delivery) {
          console.log(`\n✓ Delivery ack for ${senderId}`);
        } else if (webhookEvent.read) {
          console.log(`\n👁 Read ack for ${senderId}`);
        }
      }
    }

    // Return a '200 OK' response
    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.log("  Not a page event, ignoring. body.object =", body.object);
    res.sendStatus(404);
  }
});

/**
 * Send a text message to a user via Messenger API
 */
async function sendMessageToUser(recipientId: string, text: string): Promise<void> {
  if (!FB_PAGE_ACCESS_TOKEN) {
    console.error("Cannot reply: FB_PAGE_ACCESS_TOKEN not set in .env");
    return;
  }
  await axios.post(
    `${FB_GRAPH_API}/me/messages`,
    {
      recipient: { id: recipientId },
      message: { text },
      messaging_type: "RESPONSE",
    },
    {
      params: { access_token: FB_PAGE_ACCESS_TOKEN },
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Get counselor reply and send it back (runs in background so webhook can return 200 quickly)
 */
function respondToUser(senderId: string, userText: string): void {
  (async () => {
    try {
      const reply = await getReply(userText);
      await sendMessageToUser(senderId, reply);
      console.log(`  ✅ Replied to ${senderId}`);
    } catch (err) {
      console.error("  ❌ Reply error:", (err as Error).message);
    }
  })();
}

/**
 * Handle incoming messages
 */
function handleMessage(senderId: string, message: any) {
  console.log(`\n📨 Message from ${senderId}:`);
  console.log(`   → PSID (use for sending replies): ${senderId}`);

  if (message.text) {
    console.log(`  Text: ${message.text}`);
    const t = message.text.trim().toLowerCase();
    if (t === "my psid" || t === "what's my id" || t === "what is my id" || t === "my id") {
      sendMessageToUser(senderId, `Your PSID is: ${senderId}\n\nUse this when testing with send-one.mjs or the MCP send_message tool.`);
      return;
    }
    respondToUser(senderId, message.text);
  }

  if (message.attachments) {
    message.attachments.forEach((attachment: any) => {
      console.log(`  Attachment type: ${attachment.type}`);
      console.log(`  URL: ${attachment.payload.url}`);
    });
    // Optional: reply to attachments with a short message
    if (!message.text) {
      respondToUser(
        senderId,
        "I received your attachment. I’m best at answering questions about scholarships, OSSD, GED, A-Levels, IGCSE, and foundation programs. Send me a text question!"
      );
    }
  }

  storeMessage(senderId, message);
}

/**
 * Handle postback events (button clicks)
 */
function handlePostback(senderId: string, postback: any) {
  console.log(`\n🔘 Postback from ${senderId}:`);
  console.log(`  Title: ${postback.title}`);
  console.log(`  Payload: ${postback.payload}`);

  // Handle the postback
  // You could trigger specific actions based on the payload
}

/**
 * Store message in database or message queue
 * This is where you'd implement your storage logic
 */
function storeMessage(senderId: string, message: any) {
  // Example: Store in database
  const messageData = {
    sender_id: senderId,
    text: message.text || null,
    attachments: message.attachments || [],
    timestamp: new Date().toISOString(),
  };

  console.log("📝 Storing message:", messageData);

  // TODO: Implement your storage logic here
  // Examples:
  // - await db.messages.insert(messageData)
  // - await redis.lpush('messages', JSON.stringify(messageData))
  // - await eventQueue.publish('new-message', messageData)
}

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Prove the server is reachable from the internet (use your TUNNEL URL + /ping)
app.get("/ping", (req: Request, res: Response) => {
  console.log("\n✅ PING received – your tunnel is working and Facebook can reach this server.");
  res.status(200).type("text/plain").send("pong – server is reachable");
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Webhook server is running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}/webhook`);
  console.log(`\n📋 To receive messages you MUST:`);
  console.log(`   1. Run a tunnel in another terminal: npm run tunnel  (or ssh -R 80:localhost:3000 nokey@localhost.run)`);
  console.log(`   2. In Facebook App → Webhooks: set Callback URL to https://YOUR-TUNNEL-URL/webhook`);
  console.log(`   3. Subscribe the Page to "messages" and select your Page`);
  console.log(`   4. In Messenger, open your PAGE (not your profile) and send a message`);
  console.log(`\n   Test tunnel: open https://YOUR-TUNNEL-URL/ping in a browser – you should see "✅ PING received" here.`);
  console.log(`\n📚 Education counselor: auto-replies on scholarships, OSSD, GED, A-Levels, IGCSE, foundation. Add OPENAI_API_KEY in .env for AI replies.\n`);
});

export default app;