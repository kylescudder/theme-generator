FROM oven/bun:1.4.2 AS build
WORKDIR /app
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1 NEXT_STATIC_EXPORT=1
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run typecheck && bun run format:check && bun run build

FROM nginx:stable-alpine AS runtime
ARG THEME_GENERATOR_REVISION=development
LABEL org.opencontainers.image.source="https://github.com/kylescudder/theme-generator" \
      org.opencontainers.image.revision="${THEME_GENERATOR_REVISION}"
COPY deploy/nginx.conf /etc/nginx/nginx.conf
RUN printf '%s' "$THEME_GENERATOR_REVISION" | grep -Eq '^([0-9a-f]{40}|development)$' \
    && printf 'add_header X-Theme-Generator-Revision "%s" always;\n' "$THEME_GENERATOR_REVISION" > /etc/nginx/revision.conf
COPY --from=build /app/out /usr/share/nginx/html
USER nginx
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
