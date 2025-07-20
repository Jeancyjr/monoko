# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --only=production && npm cache clean --force

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S monoko -u 1001

# Production stage
FROM node:18-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs && \
    chown -R monoko:nodejs /app

# Switch to non-root user
USER monoko

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Install dev dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy source code
COPY . .

# Create directories
RUN mkdir -p uploads logs

EXPOSE 3000

# Development command with hot reload
CMD ["nodemon", "server.js"]
