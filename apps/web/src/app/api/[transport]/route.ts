import { mcpServerTools } from '@repo/tools';
import { createMcpHandler } from '@vercel/mcp-adapter';

const handler = createMcpHandler(
  server => {
    mcpServerTools.forEach(tool => {
      server.tool(
        tool.id,
        tool.description,
        {
          ...tool.inputSchema,
        },
        async () => {
          return {
            content: [{ type: 'text', text: tool?.output?.url as string }],
          };
        }
      )
    });
  },
  {
    // Optional server options
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: '/api', // this needs to match where the [transport] is located.
    maxDuration: 60,
  }
);
export { handler as GET, handler as POST };

