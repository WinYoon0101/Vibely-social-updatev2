# Sử dụng Node.js để build Next.js
FROM node:18 AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy file package.json & package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code frontend
COPY . .

# Build ứng dụng (cho production)
RUN npm run build

# Định nghĩa các ARG để nhận giá trị khi build
ARG NEXT_PUBLIC_BACKEND_URL

# Set các biến môi trường từ ARG
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Sử dụng lightweight server để chạy production
FROM node:18-alpine
WORKDIR /app

# Copy code đã build từ container trước
COPY --from=builder /app ./

ENV PORT=3001

EXPOSE 3001

CMD ["npm", "run", "dev"]