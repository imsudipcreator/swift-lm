export type ChatType = {
    id: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    chats: ChatType[];
    createChat: () => { id: string, slug: string };
}
