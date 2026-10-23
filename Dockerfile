# Build with full dependencies, run only the standalone server (no node_modules in the final image)
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Static pages (sitemap, robots, canonical links) are rendered now, so they need the real address now
ARG SITE_URL
ENV SITE_URL=$SITE_URL
# next/font downloads Google Fonts here, so the build needs network access
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
# Fonts for the OG images, read at runtime from process.cwd()/assets
COPY --from=build --chown=node:node /app/assets ./assets
USER node
EXPOSE 3000
CMD ["node", "server.js"]
