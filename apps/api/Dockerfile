FROM node:23.3.0-slim AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.9.0

# Install wget and curl - wget used for health check, curl for uv installation
RUN apt-get update && apt-get install -y wget curl

# Install tzdata and set timezone to Europe/Amsterdam
RUN apt-get install -y tzdata
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install uv package manager
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

FROM base AS builder

# Copy only the files needed for dependency installation
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Build the app
RUN pnpm --filter ./apps/api... run build

FROM base AS prod

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages
COPY apps/api ./apps/api

# Install only production dependencies for the app
RUN pnpm install --frozen-lockfile --prod --filter ./apps/api...

# Copy built output from builder
COPY --from=builder /app/apps/api/.mastra /app/apps/api/.mastra

# Explicitly copy the data directory to ensure CV file is available
COPY apps/api/src/data ./src/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose the port the server runs on
EXPOSE 4000

# Start the application
CMD ["node", "apps/api/.mastra/output/index.mjs"] 
