export type ChatType = {
  id: string;
  slug: string;
  modelUsed: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ChatState {
  chats: ChatType[] | [];
  setChats: (chats: ChatType[]) => void;
  createChat: (model_name: string) => Promise<{ id: string; slug: string }>;
  removeChat: (id: string) => Promise<void>;
  renameChat: (id: string, slug: string) => Promise<void>;
}
