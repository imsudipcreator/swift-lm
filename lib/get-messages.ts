import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { useMessageStore } from "@/store/message-store";
import { eq } from "drizzle-orm";

export async function getMessages(id: string) {
  // unmount all prev messages
  useMessageStore.getState().unmountMessages();
  const dbMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, id))
    .execute();
  console.log("messages: ", dbMessages);
  useMessageStore.getState().setMessages(dbMessages);
}
