import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Facebook Messenger API configuration
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || "";
const FB_API_VERSION = "v21.0";
const FB_GRAPH_API = `https://graph.facebook.com/${FB_API_VERSION}`;

interface MessengerMessage {
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
  messaging_type?: string;
}

class MessengerMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "messenger-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "send_message",
          description: "Send a message to a Facebook Messenger user",
          inputSchema: {
            type: "object",
            properties: {
              recipient_id: {
                type: "string",
                description: "The PSID (Page-Scoped ID) of the recipient",
              },
              message_text: {
                type: "string",
                description: "The text message to send",
              },
            },
            required: ["recipient_id", "message_text"],
          },
        },
        {
          name: "get_user_info",
          description: "Get information about a Messenger user",
          inputSchema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                description: "The PSID of the user",
              },
            },
            required: ["user_id"],
          },
        },
        {
          name: "send_typing_indicator",
          description: "Send typing indicator to show the bot is typing",
          inputSchema: {
            type: "object",
            properties: {
              recipient_id: {
                type: "string",
                description: "The PSID of the recipient",
              },
              action: {
                type: "string",
                enum: ["typing_on", "typing_off", "mark_seen"],
                description: "The typing action to perform",
              },
            },
            required: ["recipient_id", "action"],
          },
        },
      ],
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const a = args ?? {};

      try {
        switch (name) {
          case "send_message":
            return await this.sendMessage(
              a.recipient_id as string,
              a.message_text as string
            );

          case "get_user_info":
            return await this.getUserInfo(a.user_id as string);

          case "send_typing_indicator":
            return await this.sendTypingIndicator(
              a.recipient_id as string,
              a.action as string
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  private async sendMessage(recipientId: string, messageText: string) {
    const messageData: MessengerMessage = {
      recipient: { id: recipientId },
      message: { text: messageText },
      messaging_type: "RESPONSE",
    };

    const response = await axios.post(
      `${FB_GRAPH_API}/me/messages`,
      messageData,
      {
        params: { access_token: FB_PAGE_ACCESS_TOKEN },
        headers: { "Content-Type": "application/json" },
      }
    );

    return {
      content: [
        {
          type: "text",
          text: `Message sent successfully. Message ID: ${response.data.message_id}`,
        },
      ],
    };
  }

  private async getUserInfo(userId: string) {
    const response = await axios.get(`${FB_GRAPH_API}/${userId}`, {
      params: {
        fields: "first_name,last_name,profile_pic",
        access_token: FB_PAGE_ACCESS_TOKEN,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async sendTypingIndicator(recipientId: string, action: string) {
    await axios.post(
      `${FB_GRAPH_API}/me/messages`,
      {
        recipient: { id: recipientId },
        sender_action: action,
      },
      {
        params: { access_token: FB_PAGE_ACCESS_TOKEN },
        headers: { "Content-Type": "application/json" },
      }
    );

    return {
      content: [
        {
          type: "text",
          text: `Typing indicator '${action}' sent successfully`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Messenger MCP server running on stdio");
  }
}

// Start the server
const server = new MessengerMCPServer();
server.run().catch(console.error);