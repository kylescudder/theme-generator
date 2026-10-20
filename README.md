# mpro5 Theme Generator

Customize primary and secondary colors, preview the mpro5 interface, and download
the resulting theme as JSON. Theme settings persist in the browser's local storage;
the app does not require a database or application secrets.

## Development

Use Bun 1.4.2, matching `.bun-version` and the Docker build:

```sh
bun install --frozen-lockfile
bun run dev
```

`bun run build` and `bun run start` retain the regular Next.js server workflow.
The Docker build sets `NEXT_STATIC_EXPORT=1` to export the app as static files,
served by an unprivileged Nginx container.

## Host deployment

See [the deployment instructions](deploy/README.md) for building, routing,
CI checks, attested image releases, the host deploy service, rollback, and the
Netlify cutover. Pushes to this branch run CI; only `main` can publish or deploy.
Production activation still requires host and Cloudflare setup.
