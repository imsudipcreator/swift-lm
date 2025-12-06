export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export enum ResponseType {
  RESULT = "result",
  ERROR = "error",
}

export type MessagesCallback = (prev: MessageType[]) => MessageType[];

export type MessageType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  type: string;
  content: string;
  chatId: string;
};

export type Loading = {
  state: boolean;
  message: string;

  // TODO::EXTENDED_MESSAGE
} | null;

export interface MessageState {
  messages: MessageType[];
  loading: Loading;
  setLoading: (loading: Loading) => void;
  mountMessage: (message: MessageType) => void;
  createMessage: (role: string, type: string, content: string, chatId: string) => void;
  updateLatestMessage: (callback: MessagesCallback) => void;
}
