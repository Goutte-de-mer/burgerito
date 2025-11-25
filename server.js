const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { WebSocketServer } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store WebSocket connections by userId
const connections = new Map();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server,
    path: "/api/socket"
  });

  // Store connections by chatId -> Set of WebSockets
  const chatConnections = new Map();

  wss.on("connection", (ws, req) => {
    let userId = null;
    let chatId = null;

    // Extract userId and chatId from query
    const url = new URL(req.url, `http://${req.headers.host}`);
    userId = url.searchParams.get("userId");
    chatId = url.searchParams.get("chatId");

    if (!userId) {
      ws.close(1008, "User ID required");
      return;
    }

    // Store user connection
    if (!connections.has(userId)) {
      connections.set(userId, new Set());
    }
    connections.get(userId).add(ws);
    ws.userId = userId;
    ws.chatId = chatId;

    // If chatId is provided, add to chat connections
    if (chatId) {
      if (!chatConnections.has(chatId)) {
        chatConnections.set(chatId, new Set());
      }
      chatConnections.get(chatId).add(ws);
    }

    console.log(`User ${userId} connected${chatId ? ` to chat ${chatId}` : ""}. Total connections: ${connections.size}`);

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join":
            chatId = message.chatId;
            ws.chatId = chatId;
            console.log(`User ${userId} joined chat ${chatId}`);
            break;

          case "message":
            const targetChatId = chatId || message.chatId;
            if (!targetChatId) {
              ws.send(JSON.stringify({
                type: "error",
                message: "Chat ID required",
              }));
              break;
            }

            // Update chatId if not set
            if (!chatId && message.chatId) {
              chatId = message.chatId;
              ws.chatId = chatId;
              if (!chatConnections.has(chatId)) {
                chatConnections.set(chatId, new Set());
              }
              chatConnections.get(chatId).add(ws);
            }

            // Broadcast message to all connections in the same chat
            const broadcastMessage = {
              type: "message",
              chatId: targetChatId,
              sender: userId,
              text: message.text,
              attachments: message.attachments || [],
              timestamp: new Date().toISOString(),
            };

            // Send to all connections in the chat
            const chatWsSet = chatConnections.get(targetChatId);
            if (chatWsSet) {
              chatWsSet.forEach((client) => {
                if (client !== ws && client.readyState === 1) {
                  client.send(JSON.stringify(broadcastMessage));
                }
              });
            }

            // Echo back to sender
            ws.send(JSON.stringify({
              ...broadcastMessage,
              type: "message_sent",
            }));
            break;

          case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            break;

          default:
            console.log("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message format",
        }));
      }
    });

    ws.on("close", () => {
      // Remove from user connections
      if (userId && connections.has(userId)) {
        connections.get(userId).delete(ws);
        if (connections.get(userId).size === 0) {
          connections.delete(userId);
        }
      }

      // Remove from chat connections
      if (chatId && chatConnections.has(chatId)) {
        chatConnections.get(chatId).delete(ws);
        if (chatConnections.get(chatId).size === 0) {
          chatConnections.delete(chatId);
        }
      }

      console.log(`User ${userId} disconnected. Total connections: ${connections.size}`);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: "connected",
      userId,
    }));
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket server ready on ws://${hostname}:${port}/api/socket`);
    });
});

