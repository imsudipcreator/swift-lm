import { db } from "@/db/db";
import { chats } from "@/db/schema";
import { ChatState, ChatType } from "@/types/chat-types";
import { eq } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";

export const useChatStore = create<ChatState>((set) => ({
    chats: [],
    setChats: (chats: ChatType[]) => set({ chats }),
    createChat: async (model_name: string) => {
        const chat: ChatType = {
            id: uuidv4(),
            slug: generateSlug(4, { format: "kebab" }),
            modelUsed: model_name,
            createdAt: new Date,
            updatedAt: new Date,
        }

        await db.insert(chats).values({
            id: chat.id,
            slug: chat.slug,
            modelUsed: chat.modelUsed,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        })

        set((state) => ({ chats: [...state.chats, chat] }))

        return {
            id: chat.id,
            slug: chat.slug
        }
    },
    removeChat: async (id: string) => {
        set((state) => ({ chats: state.chats.filter((chat) => chat.id !== id) }))
        await db.delete(chats).where(eq(chats.id, id))
    },
    renameChat: async (id: string, slug: string) => {
        set((state) => ({ chats: state.chats.map((chat) => chat.id === id ? { ...chat, slug } : chat) }))
        await db.update(chats).set({ slug }).where(eq(chats.id, id))
    }
}))