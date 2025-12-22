# Giai đoạn build
FROM node:18 AS builder

WORKDIR /app

# Copy package files trước để tận dụng layer caching
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build ứng dụng (cho production)
RUN npm run build

# Giai đoạn production
FROM node:18-alpine AS production

WORKDIR /app

# Chỉ copy những gì cần thiết từ builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Biến môi trường (nhận từ docker run hoặc docker-compose)
ENV NODE_ENV=production
ARG URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV URL=${URL}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Chạy server production
CMD ["npm", "start"]

# Giai đoạn development (nếu cần)
FROM builder AS development

ENV NODE_ENV=development

# Thêm các biến môi trường development
ARG URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV URL=${URL}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

EXPOSE 3000

ENV PORT=3000

# Chạy server development
CMD ["npm", "run", "dev"]
