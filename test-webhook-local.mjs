#!/usr/bin/env node
/**
 * Send a fake webhook payload to your LOCAL webhook server.
 * Use this when you can't test from Messenger.
 *
 * 1. Start the webhook in one terminal:  npm run start
 * 2. Run this in another:               node test-webhook-local.mjs [message]
 *
 * Optional: set PSID in env to test real send, e.g. PSID=123456789 node test-webhook-local.mjs "hi"
 */
import "dotenv/config";

const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/webhook";
const FAKE_PSID = process.env.PSID || "LOCAL_TEST_PSID";
const messageText = process.argv[2] || "my psid";

const payload = {
  object: "page",
  entry: [
    {
      id: "PAGE_ID",
      time: Date.now(),
      messaging: [
        {
          sender: { id: FAKE_PSID },
          recipient: { id: "PAGE_ID" },
          timestamp: Date.now(),
          message: {
            mid: "mid.test",
            text: messageText,
          },
        },
      ],
    },
  ],
};

console.log(`POSTing to ${WEBHOOK_URL}`);
console.log(`Fake sender PSID: ${FAKE_PSID}`);
console.log(`Message: "${messageText}"\n`);

const res = await fetch(WEBHOOK_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

console.log(`Status: ${res.status} ${res.statusText}`);
console.log(`Body: ${await res.text()}`);

if (res.ok) {
  console.log("\n✓ Webhook accepted the event. Check the OTHER terminal (where npm run start is running) for logs.");
  if (FAKE_PSID === "LOCAL_TEST_PSID") {
    console.log("  Sending to a real user? Run: PSID=YOUR_PSID node test-webhook-local.mjs \"hi\"");
  }
} else {
  console.log("\n✗ If 403: set FB_APP_SECRET in .env or leave it unset for local testing.");
  process.exit(1);
}
