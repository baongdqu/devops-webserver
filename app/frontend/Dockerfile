# ==========================================
# Stage 1: Build React App
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve với Nginx siêu nhẹ
# ==========================================
FROM nginx:alpine AS runner

# Xóa default static files của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy built bundle từ Stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
