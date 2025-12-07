export function parseMessageContent(raw: string) {
  const thinkMatch = raw.match(/<think>([\s\S]*?)<\/think>/);
  
  return {
    think: thinkMatch ? thinkMatch[1].trim() : null,
    content: raw.replace(/<think>[\s\S]*?<\/think>/, "").trim(),
  };
}