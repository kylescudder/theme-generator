# Theme Generator on Herman

This deployment follows Herman's existing `platform-web` Docker network and
Cloudflare Tunnel/Caddy routing. The container serves the static Next.js export
on `theme-generator:8080`, without publishing a host port or joining the database
network. It has a read-only filesystem, a writable temporary directory, bounded
logs, and a health check for the app's HTML.

## Release

Place the reviewed checkout at `/Users/kyle/platform/apps/theme-generator` on
Herman, then build from that directory. Retain the previous image and `.env`
for rollback. Use a distinct tag for every build, including rebuilds of the
same commit with different base images.

```sh
revision=$(git rev-parse HEAD)
release="theme-generator:${revision}-$(date -u +%Y%m%dT%H%M%SZ)"
docker build --build-arg THEME_GENERATOR_REVISION="$revision" -t "$release" .
image=$(docker image inspect --format '{{.Id}}' "$release")
test ! -e .env || cp .env .env.previous
printf 'THEME_GENERATOR_IMAGE=%s\n' "$image" > .env
docker compose config --quiet
docker compose up -d --wait --wait-timeout 90
docker compose exec -T web wget -qO- http://127.0.0.1:8080/
```

If health verification fails, follow the rollback steps below before continuing.
There are no database migrations or server secrets. Local storage belongs to the
browser origin; keeping the existing custom domain preserves users' saved colors.
Colors saved on the old `netlify.app` hostname will remain on that origin.

## Route and verify before removing Netlify

1. Inspect the existing Netlify project's custom domains and identify the domain
   to retain. Record its project ID, repository, and current deployment.
2. Inspect `/Users/kyle/platform/runbook.md` and the current hostname registry.
   Use the platform's `scripts/hostname.py` dry run to route the chosen hostname
   to `theme-generator:8080`, then apply it following that runbook. Reuse the
   existing tunnel and Caddy infrastructure.
3. Verify HTTPS through the public hostname, app HTML, JavaScript, CSS and fonts,
   and a missing path returning HTTP 404. Confirm the selected container image
   and source revision on Herman.
4. In a real browser, change a primary color, check the preview and generated
   shades, reload to verify persistence, and download `custom-theme.json`.
   Confirm the exported colors match. Check desktop and mobile viewports.
5. Only after these checks pass, delete the matching Netlify project. Confirm it
   is absent through Netlify, then recheck the public custom domain. Save a
   deployment evidence note with revision, image ID, hostname and verification.

No production hostname has been selected and no Netlify project has been deleted
by the preparation of these files. The actual cutover needs authenticated access
to both systems. Automatic deployments are not configured by this package.

## Rollback

If a previous release exists:

```sh
cp .env.previous .env
docker compose up -d --wait --wait-timeout 90
```

Recheck the public hostname and browser behavior. For a failed first deployment,
remove only this application with `docker compose down` and restore its previous
hostname/DNS configuration using the platform runbook. Do not remove the shared
network, tunnel, or Caddy service.
