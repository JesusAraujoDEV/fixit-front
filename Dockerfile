# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build the app
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built output and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.prod.mjs ./server.prod.mjs
COPY --from=builder /app/package.json ./package.json

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (will be overridden by env)
EXPOSE 3000

# Start the server
CMD ["node", "server.prod.mjs"]
