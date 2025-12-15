import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),

  slug: text("slug").notNull(),
  modelUsed: text("modelUsed").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),

  role: text("role", {
    enum: ["user", "assistant"],
  }).notNull(),

  type: text("type", {
    enum: ["result", "error"],
  }).notNull(),

  content: text("content").notNull(),

  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
});


export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
