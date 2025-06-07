/**
 * Transforms Mastra messages into a format suitable for rendering in the assistant UI.
 * This function specifically handles tool calls and their results, merging them together
 * to create a coherent conversation flow that can be displayed in the UI.
 * 
 * @param messages - Array of Mastra messages to transform
 * @returns Transformed messages ready for assistant UI rendering
 */
export function transformMastraMessagesToAssistantUI(messages: any[]) {
  const mergedMessages: any[] = [];
  const resultByToolCallId: Record<string, any> = {};

  // First pass: extract tool-results and store by toolCallId
  for (const msg of messages) {
    if (msg.type === "tool-result" && Array.isArray(msg.content)) {
      for (const contentItem of msg.content) {
        if (contentItem.type === "tool-result" && contentItem.toolCallId) {
          resultByToolCallId[contentItem.toolCallId] = contentItem.result;
        }
      }
    }
  }

  // Second pass: build final messages
  for (const msg of messages) {
    if (msg.type === "tool-call" && Array.isArray(msg.content)) {
      const newContent = msg.content.map((item: any) => {
        if (item.type === "tool-call" && item.toolCallId) {
          const result = resultByToolCallId[item.toolCallId];
          return result ? { ...item, result } : item;
        }
        return item;
      });
      mergedMessages.push({ ...msg, content: newContent });
    } else if (msg.type !== "tool-result") {
      // Keep all other messages except standalone tool-results
      mergedMessages.push(msg);
    }
  }

  // Finally, apply the original tool -> assistant role transform
  return mergedMessages.map((msg) => {
    if (msg.role === "tool") {
      return { ...msg, role: "assistant" };
    }
    return msg;
  });
}
