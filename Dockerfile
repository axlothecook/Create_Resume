# Create_Resume frontend — a STATIC Vite/React SPA.
# Unlike a SvelteKit/adapter-node app (which ships a Node server), a Vite SPA builds
# to plain static files (dist/) that are served by a tiny web server. So this is a
# multi-stage build: stage 1 compiles with the full Node toolchain, stage 2 serves
# the compiled dist/ with nginx — no Node in the final image.

# ---- Stage 1: BUILD ----
FROM node:22-slim AS build

WORKDIR /app

# Manifests first — layer-caching trick: if only source changes, Docker reuses the
# cached "npm ci" layer below.
COPY package.json package-lock.json ./

# Install ALL deps (incl. devDependencies) — the build needs Vite, the React plugin,
# @fontsource, @react-pdf/renderer, etc.
RUN npm ci

# Copy the rest of the source (.dockerignore excludes node_modules, dist, .env, .git).
COPY . .

# The API base URL is read via import.meta.env.VITE_API_URL, so Vite bakes its value
# into the build output at BUILD time. It is a RELATIVE path "/api" so the SPA calls
# the API on its OWN origin (resume.axlothecook.com/api), which nginx then proxies to
# the backend container. Same-origin → first-party session cookie (SameSite=Lax) that
# strict browsers don't block. (Was a separate resume-api.* subdomain → cross-site.)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Compile the SPA → produces /app/dist.
RUN npm run build

# ---- Stage 2: SERVE ----
# nginx serving the static dist/. No Node, no build tools — small, fast, minimal
# attack surface.
FROM nginx:1.27-alpine AS run

# SPA-aware nginx config (try_files fallback to index.html for client-side routing).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy just the compiled static output from stage 1 into nginx's web root.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx listens on 80 by default.
EXPOSE 80

# nginx's own default CMD (daemon off) from the base image runs the server.
