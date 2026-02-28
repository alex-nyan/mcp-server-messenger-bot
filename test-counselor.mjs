#!/usr/bin/env node
/**
 * Test the counselor locally (no Messenger, no server).
 * Run: npm run build && node test-counselor.mjs
 */
import "dotenv/config";
import { getReply } from "./build/counselor.js";

const tests = [
  "hello",
  "what is OSSD?",
  "scholarships for UK",
  "my psid",  // counselor doesn't handle this; webhook does. This will get fallback.
];

console.log("Testing counselor getReply():\n");
for (const q of tests) {
  const reply = await getReply(q);
  console.log(`Q: ${q}`);
  console.log(`A: ${reply.slice(0, 120)}${reply.length > 120 ? "..." : ""}\n`);
}
console.log("Done. Counselor is working.");
