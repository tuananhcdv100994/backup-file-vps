import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGeminiChat,
  handleSaveConversation,
  handleGetChatbot,
} from "./routes/gemini";
import { handleTrackEvent, handleGetAnalytics } from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Gemini AI routes
  app.post("/api/gemini/chat", handleGeminiChat);
  app.post("/api/conversations/save", handleSaveConversation);
  app.get("/api/chatbots/:chatbotId", handleGetChatbot);

  // Analytics routes
  app.post("/api/analytics/track", handleTrackEvent);
  app.get("/api/analytics/:chatbotId", handleGetAnalytics);

  return app;
}
