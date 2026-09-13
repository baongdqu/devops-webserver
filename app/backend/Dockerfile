# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci --only=production

# ==========================================
# Stage 2: Production Runtime (Minimal & Secure)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Tạo non-root user và group để bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies từ stage builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/

# Chuyển quyền sở hữu cho non-root user
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

# Health check tích hợp cho container
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "src/server.js"]
