"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import {
  ensureChat,
  getChatMessages,
  sendChatMessage,
} from "@/services/chatService";

const SUPPORT_USER_ID = "support";

type ChatSupportProps = {
  userId?: string;
  userName?: string;
};

type Message = {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  createdAt: string;
};

const ChatSupport = ({ userId, userName }: ChatSupportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat when opening
  useEffect(() => {
    if (isOpen && userId && !currentChatId) {
      initializeChat();
    }
  }, [isOpen, userId]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getAuthToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];
  };

  const initializeChat = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error("Not authenticated");

      const chat = await ensureChat(authToken, SUPPORT_USER_ID);
      setCurrentChatId(chat._id);

      const existingMessages = await getChatMessages(authToken, chat._id);
      setMessages(existingMessages);

      connectWebSocket(chat._id);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (chatId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/socket?userId=${userId}&chatId=${chatId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      // Join the chat
      ws.send(
        JSON.stringify({
          type: "join",
          chatId: chatId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "connected":
            console.log("Connected to chat");
            break;

          case "message":
          case "message_sent":
            const newMessage: Message = {
              _id: `temp-${Date.now()}`,
              chat: chatId,
              sender: {
                _id: data.sender,
                name: data.sender === userId ? userName || "Vous" : "Support",
                email: "",
              },
              text: data.text,
              createdAt: data.timestamp || new Date().toISOString(),
            };

            setMessages((prev) => {
              if (prev.some((m) => m._id === newMessage._id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
            break;

          case "error":
            console.error("WebSocket error:", data.message);
            break;

          case "pong":
            // Keep-alive
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      if (isOpen && chatId) {
        setTimeout(() => {
          connectWebSocket(chatId);
        }, 3000);
      }
    };

    wsRef.current = ws;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentChatId || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) throw new Error("Not authenticated");

      const message = await sendChatMessage(authToken, currentChatId, text);
      setMessages((prev) => [...prev, message]);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            chatId: currentChatId,
            text: text,
          })
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setInputText(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!userId) {
    return null; // Don't show chat if user is not logged in
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-gray-800 active:scale-95"
        aria-label="Ouvrir le chat support"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isConnected && isOpen && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[500px] w-96 flex-col rounded-lg bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-black px-4 py-3 text-white">
            <div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-xs text-gray-300">
                {isConnected ? "En ligne" : "Connexion..."}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-sm p-1 transition hover:bg-gray-800"
              aria-label="Fermer le chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-gray-500">
                <p>Aucun message. Commencez la conversation !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => {
                  const isOwn = message.sender._id === userId;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          isOwn
                            ? "bg-black text-white"
                            : "bg-gray-100 text-black"
                        }`}
                      >
                        {!isOwn && (
                          <p className="mb-1 text-xs font-semibold">
                            {message.sender.name}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p className="mt-1 text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                disabled={!isConnected || isSending}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || !isConnected || isSending}
                className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Envoyer le message"
              >
                {isSending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSupport;

