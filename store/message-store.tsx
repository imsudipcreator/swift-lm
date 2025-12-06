import { Loading, MessagesCallback, MessageState, MessageType } from "@/types/message-types";
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
    },
    // NEW: UPDATE the latest AI message for streaming
    updateLatestMessage: (callback: MessagesCallback) =>
        set((state) => ({
            messages: callback(state.messages),
        })),
}))