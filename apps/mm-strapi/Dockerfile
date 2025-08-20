# Multi-stage build to reduce image size
FROM node:18-alpine as dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps and clean cache
RUN npm install --legacy-peer-deps --no-optional && \
    npm cache clean --force

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create strapi user
RUN addgroup -g 1001 -S strapi && \
    adduser -S strapi -u 1001

# Change ownership
RUN chown -R strapi:strapi /app
USER strapi

# Expose port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "develop"]