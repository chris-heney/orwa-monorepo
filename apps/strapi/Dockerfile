# Strapi 5 production image (self-contained app: apps/strapi has its own package-lock.json)
# Build from the monorepo root:  docker build -t ghcr.io/chris-heney/orwa-monorepo/strapi -f apps/strapi/Dockerfile apps/strapi

FROM node:22-alpine AS build
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git
WORKDIR /opt/app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund
COPY . .
# Compile local plugin server bundles, then the Strapi app + admin panel
RUN cd src/plugins/activity-feed && npx tsc -p tsconfig.server.json && \
    cd ../grant-management && npx tsc -p tsconfig.server.json
# The admin panel bakes its backend URL at build time; without this it
# defaults to http://localhost:1337 and the deployed admin UI breaks.
ARG STRAPI_ADMIN_BACKEND_URL=https://admin.orwa.org
ARG PUBLIC_URL=https://admin.orwa.org
ENV STRAPI_ADMIN_BACKEND_URL=${STRAPI_ADMIN_BACKEND_URL} \
    PUBLIC_URL=${PUBLIC_URL} \
    NODE_ENV=production
RUN npx strapi build

FROM node:22-alpine AS production
RUN apk add --no-cache vips-dev tzdata
ENV NODE_ENV=production
WORKDIR /opt/app
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/favicon.png ./favicon.png
COPY --from=build /opt/app/src ./src
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/types ./types
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/tsconfig.json ./tsconfig.json
RUN mkdir -p public/uploads && chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["npx", "strapi", "start"]
