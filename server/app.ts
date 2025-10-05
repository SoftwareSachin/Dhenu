import express, { type Request, Response, NextFunction } from "express";
import { storage as dbStorage } from "./storage";
import { generateChatResponse, generateStreamingChatResponse } from "./services/chat";
import { analyzeCropOrLivestockImage } from "./services/vision";
import multer from "multer";
import { put } from "@vercel/blob";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { serveStatic } from "./vite";
import dotenv from 'dotenv';

dotenv.config();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

const storage = multer.memoryStorage();
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only image files are allowed!'));
  }
};
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const app = express();

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Routes
app.post("/api/conversations", async (req, res) => {
  try {
    const data = insertConversationSchema.parse(req.body);
    const conversation = await dbStorage.createConversation(data);
    res.json(conversation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/conversations/user/:userId", async (req, res) => {
  try {
    const conversations = await dbStorage.getUserConversations(req.params.userId);
    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const messages = await dbStorage.getConversationMessages(req.params.id);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/conversations/:id/messages", async (req, res) => {
  try {
    const data = insertMessageSchema.parse({ ...req.body, conversationId: req.params.id });
    const message = await dbStorage.createMessage(data);
    res.json(message);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { conversationId, content, language = "en" } = req.body;

    const userMessage = await dbStorage.createMessage({
      conversationId,
      role: "user",
      content,
    });

    const messages = await dbStorage.getConversationMessages(conversationId);
    const chatHistory = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    }));

    const aiResponse = await generateChatResponse(chatHistory, language);

    const assistantMessage = await dbStorage.createMessage({
      conversationId,
      role: "assistant",
      content: aiResponse,
    });

    const conversation = await dbStorage.getConversation(conversationId);
    if (conversation) {
      await dbStorage.updateConversation(conversationId, {
        updatedAt: new Date(),
      });
    }

    res.json({ userMessage, assistantMessage });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/chat/stream", async (req, res) => {
  try {
    const { conversationId, content, language = "en" } = req.query as { conversationId: string, content: string, language?: string };

    if (!conversationId || !content) {
      return res.status(400).json({ message: "Missing required parameters: conversationId and content" });
    }

    const userMessage = await dbStorage.createMessage({
      conversationId,
      role: "user",
      content,
    });

    const messages = await dbStorage.getConversationMessages(conversationId);
    const chatHistory = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullResponse = "";

    await generateStreamingChatResponse(chatHistory, language, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    try {
      const assistantMessage = await dbStorage.createMessage({
        conversationId,
        role: "assistant",
        content: fullResponse,
      });

      const conversation = await dbStorage.getConversation(conversationId);
      if (conversation) {
        await dbStorage.updateConversation(conversationId, {
          updatedAt: new Date(),
        });
      }

      res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMessage.id })}\n\n`);
    } catch (saveError: any) {
      console.error("Error saving response:", saveError);
      res.write(`data: ${JSON.stringify({ error: "Failed to save response. Please try again." })}\n\n`);
    }

    res.end();
  } catch (error: any) {
    console.error("Streaming error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const { conversationId, context = "crop disease", language = "en" } = req.body;

    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const base64Image = req.file.buffer.toString("base64");
    const analysis = await analyzeCropOrLivestockImage(base64Image, context, language);

    const message = await dbStorage.createMessage({
      conversationId,
      role: "assistant",
      content: `**AI Vision Analysis**\n\n**Diagnosis:** ${analysis.diagnosis}\n**Confidence:** ${analysis.confidence}%\n\n**Treatment:**\n${analysis.treatment.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n**Prevention:**\n${analysis.prevention.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n**Description:** ${analysis.description}`,
      imageUrl: blob.url,
      metadata: analysis,
    });
    
    res.json({ message, analysis });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: "Only image files are allowed!",
        transcription: "" 
      });
    }
    
    return res.status(200).json({ 
      message: "Using browser speech recognition",
      transcription: "Please speak again using the microphone button" 
    });
  } catch (error: any) {
    console.error("Transcription error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to process audio",
      transcription: "" 
    });
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

if (!process.env.VERCEL) {
  serveStatic(app);
}

export default app;
