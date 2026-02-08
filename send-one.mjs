import "dotenv/config";
import axios from "axios";

const token = process.env.FB_PAGE_ACCESS_TOKEN;
const recipientId = process.argv[2] || "123456";
const text = process.argv[3] || "Hello";

if (!token) {
  console.error("Missing FB_PAGE_ACCESS_TOKEN in .env");
  process.exit(1);
}

const res = await axios.post(
  `https://graph.facebook.com/v21.0/me/messages`,
  {
    recipient: { id: recipientId },
    message: { text },
    messaging_type: "RESPONSE",
  },
  {
    params: { access_token: token },
    headers: { "Content-Type": "application/json" },
  }
);
console.log("Sent. Message ID:", res.data.message_id);
