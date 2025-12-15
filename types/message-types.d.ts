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
  role: "user" | "assistant";
  type: "result" | "error";
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
  unmountMessages: () => void;
  setMessages: (message: MessageType[]) => void;
  createMessage: (
    role: "user" | "assistant",
    type: "result" | "error",
    content: string,
    chatId: string
  ) => Promise<string>;
  mountMessage: (message: MessageType) => void;
  updateLatestMessage: (chunk: string) => void;
}
