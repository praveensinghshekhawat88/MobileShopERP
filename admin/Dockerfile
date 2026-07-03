# =============================================================================
# Mobile Shop ERP — Admin Panel production image
# React 19 / Vite 7 — served by nginx with API reverse proxy
# =============================================================================

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Relative API base — nginx proxies /api/ to the backend container (see nginx.conf).
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_APP_NAME=Mobile Shop ERP
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD curl -f http://localhost/ || exit 1
