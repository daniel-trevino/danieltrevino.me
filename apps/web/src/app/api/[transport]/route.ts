import { getGithubUrl, getLinkedinUrl, getXUrl } from '@repo/tools';
import { createMcpHandler } from '@vercel/mcp-adapter';

const handler = createMcpHandler(
  server => {
    server.tool(
      getGithubUrl.id,
      getGithubUrl.description,
      {
        ...getGithubUrl.inputSchema,
      },
      async () => {
        return {
          content: [{ type: 'text', text: getGithubUrl.output.url as string }],
        };
      }
    )
    server.tool(
      getLinkedinUrl.id,
      getLinkedinUrl.description,
      {
        ...getLinkedinUrl.inputSchema,
      },
      async () => {
        return {
          content: [{ type: 'text', text: getLinkedinUrl.output.url as string }],
        };
      }
    )
    server.tool(
      getXUrl.id,
      getXUrl.description,
      {
        ...getXUrl.inputSchema,
      },
      async () => {
        return {
          content: [{ type: 'text', text: getXUrl.output.url as string }],
        };
      }
    )
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
