import { resumeMarkdown } from '@repo/resume';
import { getGithubUrl, getLinkedinUrl, getResumeUrl, getXUrl } from '@repo/tools';
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
          content: [{ type: 'text', text: getGithubUrl?.output?.url as string }],
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
          content: [{ type: 'text', text: getLinkedinUrl?.output?.url as string }],
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
          content: [{ type: 'text', text: getXUrl?.output?.url as string }],
        };
      }
    )
    server.tool(
      getResumeUrl.id,
      getResumeUrl.description,
      {
        ...getResumeUrl.inputSchema,
      },
      async () => {
        return {
          content: [{ type: 'text', text: getResumeUrl?.output?.url as string }],
        };
      }
    )
    server.tool(
      "resume_markdown_resource",
      "Returns the markdown content of Daniel's resume",
      {},
      async () => {
        return {
          content: [{ type: 'text', text: resumeMarkdown }],
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
