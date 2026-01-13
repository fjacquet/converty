# Converty - Multi-stage Dockerfile for Next.js Static Export
# Optimized for production with minimal image size

# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies needed for node-gyp (if any native modules)
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the static export
RUN npm run build

# ============================================================================
# Stage 3: Runner (Production) - Using nginx for static files
# ============================================================================
FROM nginx:alpine AS runner

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# nginx runs as non-root by default in nginx:alpine
CMD ["nginx", "-g", "daemon off;"]
