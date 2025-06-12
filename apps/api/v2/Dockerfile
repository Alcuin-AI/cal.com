# Multi-stage Dockerfile for Cal.com API v2

# Stage 1: Dependencies
FROM node:20-alpine AS base

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./
COPY apps/api/v2/package.json ./apps/api/v2/
COPY packages/*/package.json ./packages/*/
COPY turbo.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx turbo run @calcom/prisma#generate

# Build API v2
RUN npx turbo run @calcom/api-v2#build

# Production image
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy built application
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps ./apps
COPY --from=base /app/packages ./packages
COPY --from=base /app/package.json ./
COPY --from=base /app/turbo.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Use environment variable for port, default to 5555
ENV PORT=${API_PORT:-5555}
EXPOSE $PORT

CMD ["yarn", "workspace", "@calcom/api-v2", "start"]
