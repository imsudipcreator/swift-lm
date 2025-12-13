import { DemoChat } from "@/data/demo-chat";
import { ChatState, ChatType } from "@/types/chat-types";
import { generateSlug } from "random-word-slugs";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";

export const useChatStore = create<ChatState>((set) => ({
    chats: DemoChat,
    createChat: (model: string) => {
        const chat: ChatType = {
            id: uuidv4(),
            slug: generateSlug(4, { format: "kebab" }),
            modelUsed: model,
            createdAt: new Date,
            updatedAt: new Date,
        }

        set((state) => ({ chats: [...state.chats, chat] }))

        return {
            id: chat.id,
            slug: chat.slug
        }
    }
}))