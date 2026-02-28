#!/usr/bin/env node
/**
 * Test the Messenger MCP server (stdio). Run from project root.
 *
 * Prereq: npm run build
 *
 * Usage:
 *   node test-mcp.mjs                    # list tools (no token needed)
 *   node test-mcp.mjs send <PSID> "Hi"   # send message (needs .env)
 *   node test-mcp.mjs user <PSID>        # get user info (needs .env)
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;

const args = process.argv.slice(2);
const command = args[0] || "list";

function write(proc, msg) {
  const line = JSON.stringify(msg) + "\n";
  proc.stdin.write(line);
}

function waitForResponse(proc, id, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk;
      const idx = buffer.indexOf("\n");
      if (idx === -1) return;
      const line = buffer.slice(0, idx).replace(/\r$/, "");
      buffer = buffer.slice(idx + 1);
      try {
        const msg = JSON.parse(line);
        if (msg.id === id && (msg.result !== undefined || msg.error !== undefined)) {
          proc.stdout.off("data", onData);
          clearTimeout(t);
          resolve(msg);
        }
      } catch (_) {}
    };
    proc.stdout.on("data", onData);
    const t = setTimeout(() => {
      proc.stdout.off("data", onData);
      reject(new Error("timeout"));
    }, timeoutMs);
  });
}

async function main() {
  const proc = spawn("node", ["build/mcp-server.js"], {
    cwd: projectRoot,
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env },
  });

  proc.stdout.setEncoding("utf8");

  // Give server a moment to start listening on stdin
  await new Promise((r) => setTimeout(r, 200));

  // 1. Initialize
  const initId = 1;
  write(proc, {
    jsonrpc: "2.0",
    id: initId,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-mcp", version: "1.0.0" },
    },
  });
  const initRes = await waitForResponse(proc, initId);
  if (initRes.error) {
    console.error("Initialize failed:", initRes.error);
    proc.kill();
    process.exit(1);
  }

  // 2. Initialized notification (no id)
  write(proc, {
    jsonrpc: "2.0",
    method: "notifications/initialized",
  });

  let result;
  if (command === "list") {
    const listId = 2;
    write(proc, { jsonrpc: "2.0", id: listId, method: "tools/list", params: {} });
    result = await waitForResponse(proc, listId);
    if (result.error) {
      console.error("tools/list error:", result.error);
    } else {
      const tools = result.result?.tools ?? [];
      console.log("Tools:", tools.length);
      tools.forEach((t) => console.log(" -", t.name, ":", t.description));
    }
  } else if (command === "send" && args[1] && args[2]) {
    const callId = 3;
    write(proc, {
      jsonrpc: "2.0",
      id: callId,
      method: "tools/call",
      params: {
        name: "send_message",
        arguments: { recipient_id: args[1], message_text: args[2] },
      },
    });
    result = await waitForResponse(proc, callId);
    console.log(JSON.stringify(result, null, 2));
  } else if (command === "user" && args[1]) {
    const callId = 4;
    write(proc, {
      jsonrpc: "2.0",
      id: callId,
      method: "tools/call",
      params: { name: "get_user_info", arguments: { user_id: args[1] } },
    });
    result = await waitForResponse(proc, callId);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Usage: node test-mcp.mjs [list | send <PSID> <text> | user <PSID>]");
    proc.kill();
    process.exit(1);
  }

  proc.kill();
  process.exit(result?.error ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
