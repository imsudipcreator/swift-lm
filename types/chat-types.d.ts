export type ChatType = {
    id: string;
    slug: string;
    modelUsed: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    chats: ChatType[];
    createChat: (model: string) => { id: string, slug: string };
}
