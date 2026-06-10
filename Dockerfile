# ---- Build stage: compile the Vite app into static assets ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Build the production bundle into /app/dist.
COPY . .
RUN npm run build

# ---- Runtime stage: serve the static assets with nginx ----
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (gzip + single-page fallback).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built site from the build stage.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
