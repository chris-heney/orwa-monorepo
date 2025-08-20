# Multi-stage build for React application
FROM node:18-alpine as build

WORKDIR /workspace

# Copy root package files and workspace configuration
COPY ../../package*.json ./
COPY ../../nx.json ./
COPY ../../tsconfig.base.json ./

# Install all workspace dependencies
RUN npm install

# Copy the specific app
COPY . ./apps/grant-application/

# Build the application using NX
RUN npx nx build grant-application

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /workspace/dist/apps/grant-application /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]