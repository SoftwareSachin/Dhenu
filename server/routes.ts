import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/chat";
import { analyzeCropOrLivestockImage } from "./services/vision";
import { transcribeAudio } from "./services/voice";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user conversations
  app.get("/api/conversations/user/:userId", async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get conversation messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getConversationMessages(req.params.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send a chat message
  app.post("/api/chat", async (req, res) => {
    try {
      const { conversationId, content, language = "en" } = req.body;

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content,
      });

      // Get conversation history
      const messages = await storage.getConversationMessages(conversationId);
      const chatHistory = messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse(chatHistory, language);

      // Save AI message
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse,
      });

      // Update conversation timestamp
      const conversation = await storage.getConversation(conversationId);
      if (conversation) {
        await storage.updateConversation(conversationId, {
          updatedAt: new Date(),
        });
      }

      res.json({ userMessage, assistantMessage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analyze image (crop disease or livestock health)
  app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { conversationId, context = "crop disease", language = "en" } = req.body;

      // Read image as base64
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString("base64");

      // Analyze image
      const analysis = await analyzeCropOrLivestockImage(base64Image, context, language);

      // Save analysis as message
      const message = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: `**AI Vision Analysis**\n\n**Diagnosis:** ${analysis.diagnosis}\n**Confidence:** ${analysis.confidence}%\n\n**Treatment:**\n${analysis.treatment.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n**Prevention:**\n${analysis.prevention.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n**Description:** ${analysis.description}`,
        imageUrl: `/uploads/${req.file.filename}`,
        metadata: analysis,
      });

      // Clean up uploaded file after processing
      // Note: In production, you'd want to save this to cloud storage
      
      res.json({ message, analysis });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Transcribe voice input
  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      const transcription = await transcribeAudio(req.file.path);

      // Clean up audio file
      fs.unlinkSync(req.file.path);

      res.json({ transcription });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(process.cwd(), "uploads", req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
