import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { Loading, MessageState, MessageType } from "@/types/message-types";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";


export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    loading: null,

    setLoading: (loading: Loading) => set({ loading }),
    setMessages: (message: MessageType) => set((state) => ({ messages: [...state.messages, message] })),
    createMessage: async (role: "user" | "assistant", type: "result" | "error", content: string, chatId: string) => {
        const id = uuidv4();
        const now = new Date();
        set(state => ({ messages: [...state.messages, { id, createdAt: now, updatedAt: now, role, type, content, chatId }] }))
        await db.insert(messages).values({ id, createdAt: now, updatedAt: now, role, type, content, chatId })
        return id
    },
    updateLatestMessage: (chunk: string) =>
        set((state) => {
            const messages = [...state.messages];
            const lastIndex = messages.length - 1;

            if (lastIndex < 0) return state;

            messages[lastIndex] = {
                ...messages[lastIndex],
                content: chunk ?? ""
            };

            return { messages };
        }),
}))