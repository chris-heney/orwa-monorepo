# Development stage
FROM node:lts-alpine AS development
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
COPY tsconfig.base.json ./
COPY libs/ ./libs/
COPY apps/synapse/ ./apps/synapse/
RUN npm install --legacy-peer-deps
WORKDIR /app/apps/synapse
EXPOSE 8000
CMD ["npm", "run", "start"]

# Build stage
FROM node:lts-alpine AS build
WORKDIR /app

# Copy workspace files to maintain directory structure
COPY package*.json ./
COPY .npmrc ./
COPY tsconfig.base.json ./
COPY libs/ ./libs/
COPY apps/synapse/ ./apps/synapse/

# Install root dependencies (for build tools like vite)
RUN npm install --legacy-peer-deps

# Install app-specific dependencies
WORKDIR /app/apps/synapse
RUN npm install --legacy-peer-deps

# Build the application
ARG MODE=production
RUN npm run build -- --mode $MODE

# Production stage
FROM nginx:alpine AS production

# Copy nginx configuration
COPY apps/synapse/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/apps/synapse/build /usr/share/nginx/html

# Add script to generate runtime config
COPY apps/synapse/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=30 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["/docker-entrypoint.sh"]