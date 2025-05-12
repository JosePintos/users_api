# STAGE 1: Prepare
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./
COPY src ./src

# STAGE 2: Build
RUN npm install
RUN npm run build

# STAGE 3: Prod
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/main"]
