/**
 * Parses a streaming chat response from the Mastra API into Assistant UI compatible chunks.
 * 
 * @param reader - The ReadableStreamDefaultReader used to read the stream chunks
 * @param decoder - The TextDecoder instance used to decode the stream chunks
 * @yields Assistant UI compatible message chunks containing text content
 */
export async function* parseChatStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
  let text = "";
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Split by newlines in case multiple messages are in one chunk
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      // Handle lines like 0:"Hello"
      const match = line.match(/^0:(".*")$/);
      if (match) {
        try {
          // Parse the quoted string
          const partText = JSON.parse(match[1]);
          text += partText;
          yield {
            content: [
              { type: "text", text: text } as const
            ] as const,
          };
        } catch (e) {
          continue;
        }
        continue;
      }

      // Optionally handle JSON lines (f:, e:, d:)
      const jsonStart = line.indexOf("{");
      if (jsonStart !== -1) {
        const jsonString = line.slice(jsonStart);
        try {
          const part = JSON.parse(jsonString);
          // You can handle metadata here if needed
        } catch (e) {
          // do nothing just proceed
        }
      }
    }
  }
}