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
# Vite inlines VITE_* at build time — pass these via --build-arg or the
# contact form ships broken. None is a secret (all end up in the JS bundle).
#   docker build --target prod --build-arg VITE_WEB3FORMS_KEY=... -t cuvatex .
ARG VITE_WEB3FORMS_KEY
ARG VITE_UMAMI_SCRIPT_URL
ARG VITE_UMAMI_WEBSITE_ID
RUN pnpm build

FROM nginx:alpine AS prod
# Replaces the stock server block — see nginx.conf for the SPA fallback.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
