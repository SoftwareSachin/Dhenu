import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import { generateChatResponse, generateStreamingChatResponse } from "./services/chat";
import { analyzeCropOrLivestockImage } from "./services/vision";
import { transcribeAudio } from "./services/voice";
import multer from "multer";
import { put } from "@vercel/blob";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";

// Configure multer to use memory storage for Vercel Blob
const storage = multer.memoryStorage();

// File filter to accept all image formats
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept all image formats
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await dbStorage.createConversation(data);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user conversations
  app.get("/api/conversations/user/:userId", async (req, res) => {
    try {
      const conversations = await dbStorage.getUserConversations(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get conversation messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await dbStorage.getConversationMessages(req.params.id);
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
      const userMessage = await dbStorage.createMessage({
        conversationId,
        role: "user",
        content,
      });

      // Get conversation history
      const messages = await dbStorage.getConversationMessages(conversationId);
      const chatHistory = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse(chatHistory, language);

      // Save AI message
      const assistantMessage = await dbStorage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse,
      });

      // Update conversation timestamp
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
  
  // Stream a chat response
  app.get("/api/chat/stream", async (req, res) => {
    try {
      const { conversationId, content, language = "en" } = req.query as { conversationId: string, content: string, language?: string };

      if (!conversationId || !content) {
        return res.status(400).json({ message: "Missing required parameters: conversationId and content" });
      }

      // Save user message
      const userMessage = await dbStorage.createMessage({
        conversationId,
        role: "user",
        content,
      });

      // Get conversation history
      const messages = await dbStorage.getConversationMessages(conversationId);
      const chatHistory = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      }));

      // Set up SSE headers
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });

      // Send initial connection established message
      res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

      let fullResponse = "";
      let hasError = false;
      
      try {
        // Generate streaming response
        await generateStreamingChatResponse(
          chatHistory,
          language,
          (chunk) => {
            fullResponse += chunk;
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
          }
        );
      } catch (streamError: any) {
        console.error("Error generating streaming response:", streamError);
        res.write(`data: ${JSON.stringify({ error: "Failed to generate response. Please try again." })}\n\n`);
        hasError = true;
      }

      if (!hasError && fullResponse) {
        try {
          // Save the complete response
          const assistantMessage = await dbStorage.createMessage({
            conversationId,
            role: "assistant",
            content: fullResponse,
          });

          // Update conversation timestamp
          const conversation = await dbStorage.getConversation(conversationId);
          if (conversation) {
            await dbStorage.updateConversation(conversationId, {
              updatedAt: new Date(),
            });
          }

          // Send the final message with the complete response
          res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMessage.id })}\n\n`);
        } catch (saveError: any) {
          console.error("Error saving response:", saveError);
          res.write(`data: ${JSON.stringify({ error: "Failed to save response. Please try again." })}\n\n`);
        }
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

  // Analyze image (crop disease or livestock health)
  app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { conversationId, context = "crop disease", language = "en" } = req.body;

      // Upload image to Vercel Blob
      const blob = await put(req.file.originalname, req.file.buffer, {
        access: 'public',
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      // Convert buffer to base64 for AI analysis
      const base64Image = req.file.buffer.toString("base64");

      // Analyze image
      const analysis = await analyzeCropOrLivestockImage(base64Image, context, language);

      // Save analysis as message with Blob URL
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

  // Transcribe voice input (disabled - uses browser Web Speech API instead)
  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: "Only image files are allowed!",
          transcription: "" 
        });
      }
      
      // Return a clear message that client should use Web Speech API
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

  const httpServer = createServer(app);

  return httpServer;
}
