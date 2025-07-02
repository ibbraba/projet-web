# ---------- Stage 1: Build ----------
FROM node:22.1 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:22.1

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Change this if your Nest app has a different entry point
CMD ["node", "dist/main"]

EXPOSE 3000
