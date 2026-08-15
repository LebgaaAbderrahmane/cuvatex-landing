FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .

FROM base AS dev
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

FROM base AS build
# Vite inlines every VITE_* value at build time, so they have to exist during
# `pnpm build` — not at container run time. ARG is per-stage: declaring these in
# `base` would NOT reach here. Without them a CI build ships a contact form that
# POSTs access_key="undefined" and rejects every message.
#   docker build --target prod --build-arg VITE_WEB3FORMS_KEY=... -t cuvatex .
# None is a secret: all three end up readable in the shipped JS bundle.
ARG VITE_WEB3FORMS_KEY
ARG VITE_UMAMI_SCRIPT_URL
ARG VITE_UMAMI_WEBSITE_ID
RUN pnpm build

FROM nginx:alpine AS prod
# Replaces the stock server block. The default one 404s every router path
# (/work, /work/<slug>) on reload or on a pasted link — see nginx.conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
