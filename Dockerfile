# 1. Builder
FROM node:20-slim AS builder
WORKDIR /app

# Installer les dépendances et builder l'app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install
COPY . .
RUN npm run build

# 2. Runtime
FROM node:20-slim AS runner
WORKDIR /app

# ← Installe OpenSSL avant de copier quoi que ce soit
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl libssl-dev \
 && rm -rf /var/lib/apt/lists/*

# Copier uniquement ce qui est nécessaire au runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
