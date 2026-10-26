# mpro5 Theme Generator

Customize primary and secondary colors, preview the mpro5 interface, and download
the resulting theme as JSON. Theme settings persist in the browser's local storage;
the app does not require a database or application secrets.

## Development

This is an Astro site. The generator is a React island rendered in the browser,
because the theme is read from local storage. Use Bun 1.4.4, matching
`.bun-version` and the Docker build:

```sh
bun install --frozen-lockfile
bun run dev
```

| Script              | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `bun run typecheck` | `astro check`                              |
| `bun run test`      | Colour contrast, shade and tint unit tests |
| `bun run test:e2e`  | Playwright journeys against `bun run dev`  |
| `bun run build`     | Static output in `dist/`                   |
| `bun run format`    | Prettier with the house style              |

`bun run build` writes static files to `dist/`. The Docker image serves them from
an unprivileged Caddy container, which also answers `/healthz` with
`{"ok":true,"revision":"<sha>"}` and sends `X-Theme-Generator-Revision` on every
response.

## Host deployment

See [the deployment instructions](deploy/README.md) for building, routing,
CI checks, attested image releases, the host deploy service, rollback, and the
Netlify cutover. Pushes to this branch run CI; only `main` can publish or deploy.
Production activation still requires host and Cloudflare setup.
