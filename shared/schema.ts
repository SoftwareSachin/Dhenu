import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  language: text("language").notNull().default("en"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  language: text("language").notNull().default("en"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  conversationId: text("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  metadata: text("metadata", { mode: "json" }), // for storing analysis results, confidence scores, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
  messages: many(messages),
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  language: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
  language: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  role: true,
  content: true,
  imageUrl: true,
  audioUrl: true,
  metadata: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
