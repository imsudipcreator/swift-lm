import { Loading, MessageState, MessageType } from "@/types/message-types";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";


export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    loading: null,

    setLoading: (loading: Loading) => set({ loading }),
    mountMessage: (message: MessageType) => set((state) => ({ messages: [...state.messages, message] })),
    createMessage: (role: string, type: string, content: string, chatId: string) => {
        const id = uuidv4();
        set(state => ({ messages: [...state.messages, { id, createdAt: new Date(), updatedAt: new Date(), role, type, content, chatId }] }))
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