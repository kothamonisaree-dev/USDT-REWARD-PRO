FROM node:20-alpine AS builder
WORKDIR /app

# Install full deps (including dev) for build
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build client + bundle server
COPY . ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm install --production --silent

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/server.cjs"]
