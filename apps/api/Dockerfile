FROM node:24.2.0-slim AS base

WORKDIR /app

# Install pnpm, wget, curl, and tzdata in a single layer
RUN npm install -g pnpm@10.9.0 && \
    apt-get update && \
    apt-get install -y wget curl tzdata && \
    rm -rf /var/lib/apt/lists/*

# Set timezone
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install uv package manager
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# --- Builder Stage ---
FROM base AS builder

WORKDIR /app

# Copy dependency manifests for the workspace
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files for the api app and its workspace dependencies
COPY apps/api/package.json ./apps/api/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/tools/package.json ./packages/tools/package.json
COPY packages/config-typescript/package.json ./packages/config-typescript/package.json
COPY packages/jest-presets/package.json ./packages/jest-presets/package.json

# Install dependencies for the api app and its workspace dependencies
RUN pnpm add napi-postinstall -w
RUN pnpm install --frozen-lockfile --filter api...

# Copy the source code for the app and its dependencies
COPY apps/api ./apps/api
COPY packages/logger ./packages/logger
COPY packages/tools ./packages/tools
COPY packages/config-typescript ./packages/config-typescript
COPY packages/jest-presets ./packages/jest-presets

# Build the app
RUN pnpm --filter api... build

# --- Production Stage ---
FROM base AS prod

WORKDIR /app

# Copy dependency manifests for production install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/tools/package.json ./packages/tools/package.json

# Install only production dependencies for the api app
RUN pnpm install --frozen-lockfile --prod --filter api...

# Copy built output from the builder stage
COPY --from=builder /app/apps/api/.mastra /app/apps/api/.mastra

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose the port the server runs on
EXPOSE 4000

# Start the application
CMD ["node", "apps/api/.mastra/output/index.mjs"] 
