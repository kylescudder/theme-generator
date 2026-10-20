# Theme Generator on the host

## Shared deployment service

This app is registered as `theme-generator` in the central deployment registry
`/Users/kyle/platform/deploy-core/apps.json`. LaunchAgent
`com.kylescudder.deploy-core` runs the single installed engine. Application hooks
are `deploy/hooks.py`; the receiver, credentials, queues,
state and database contracts below remain app-specific. Manual deployment uses
`./deploy/host-deploy.sh sha256:<digest>`.

Engine updates, application registration, failure inspection and service rollback
are documented in [deploy-core](https://github.com/kylescudder/deploy-core).
There are no vendored engine files, lock files or sync PRs. Do not install an
app-specific LaunchAgent. Apply future engine changes once through the central service.

This follows Office Tracker's release pattern: GitHub-hosted native AMD64/ARM64
builds, an immutable GHCR digest with provenance, Cloudflare Access Service Auth,
a restricted queue receiver, and an event-driven LaunchAgent running as Colima's
owner. The app serves a static Next.js export at `theme-generator:8080` on the
existing `platform-web` network. It needs no database, runtime secrets, host
ports, self-hosted Actions runner, or Docker socket in the receiver.

## Deployer

Application-specific behavior is in `hooks.py`; deployment definitions are central.

## CI and releases

- **CI** runs on branch pushes and pull requests, and is reused by Release. It
  checks TypeScript, formatting, the frozen Bun lockfile build, real webhook HTTP
  behavior, deployment provenance/queue/rollback behavior, and the restricted
  production container's revision, assets, caching and missing-route responses.
- **Release** runs on pushes to `main` or manual dispatch. Only `main` may publish.
  Separate native runners build AMD64/ARM64 images. Their manifest is pushed as
  `ghcr.io/kylescudder/theme-generator:sha-<commit>`, attested, then tagged `main`.
- When `DEPLOY_ENABLED=true`, Release checks the Access boundary, signs an exact
  digest/revision request, and waits for public `/healthz` to report that commit
  in `X-Theme-Generator-Revision`. Health responses use `Cache-Control: no-store`.
  A branch dispatch can run checks but cannot publish or deploy.

All application and receiver builds/tests use Bun 1.4.2, matching `.bun-version`,
`packageManager`, Dockerfile and receiver Compose. Action references match the
pinned versions in Office Tracker. The public repository can use GitHub's
[official container provenance action](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations).
No signing key or extra package-manager lockfile is needed.

The host independently verifies the GHCR bundle against this repository,
`.github/workflows/release.yml`, `refs/heads/main`, GitHub-hosted runners, and the
requested source commit before pulling or starting an image. A manual digest
rollback also verifies that the image label matches its attested source commit.
Queued requests coalesce to the newest request; deployments hold a host lock.
A failed health check restores the previous image. Failed first deployments are
stopped without pinning the broken candidate. Success pins `.env` and records
`state/deployment.json` and `state/history.log`; failures record
`state/last-failure.json` without command stderr or secrets.

## One-time host setup

The branch supplies the CI/CD implementation. Actual host installation, public
hostname selection and Netlify cutover still require authenticated access to
The host and Netlify; those operations have not been performed.

From a reviewed checkout at `/Users/kyle/platform/apps/theme-generator`, as
Colima's owner on **the host**, first inspect `/Users/kyle/platform/runbook.md`.
Keep the existing Netlify custom domain so browser local storage remains on the
same origin. Colors saved on an old `netlify.app` origin cannot migrate with DNS.

Choose the public HTTPS origin to retain and a dedicated deploy hostname, then:

```sh
python3 -B deploy/bootstrap-host.py --host <host LocalHostName> \
  --base-url https://YOUR_PUBLIC_HOSTNAME \
  --deploy-url https://YOUR_DEPLOY_HOSTNAME/hooks/theme-generator
```

Bootstrap checks the host/checkout, pauses deployments, creates protected private
files without overwriting existing ones, installs the receiver; register the app centrally,
configures a `main` branch policy for GitHub's `production` environment, uploads
`DEPLOY_WEBHOOK_SECRET` through stdin, and sets the two URL variables. GitHub and
GHCR credentials must already work for the host's user. Repeated bootstrap leaves
`DEPLOY_ENABLED=false` until the operator finishes verification. Existing
production environment policies should be inspected before running this setup.

## Cloudflare and enabling deployment

Before exposing the hook, create a dedicated Access application protecting the
**whole deploy hostname**, with one **Service Auth** policy allowing only a new
service token named `github-theme-generator-deploy`. Store its returned values
in protected host files, then send them to the repository's `production`
environment secrets `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` through
stdin. Record the application/policy/token IDs and expiry in
`state/cloudflare-resources.json`, following the platform convention. Public app
access does not need an Access login wall.

After that policy exists, use the existing platform hostname helper. Substitute
the chosen hostnames, inspect each dry run, then repeat without `--dry-run`:

```sh
cd /Users/kyle/platform
python3 scripts/hostname.py add theme-generator-deploy YOUR_DEPLOY_HOSTNAME \
  --upstream theme-generator-deploy-hook:9000 --path /hooks/theme-generator --dry-run
python3 scripts/hostname.py add theme-generator YOUR_PUBLIC_HOSTNAME \
  --upstream theme-generator:8080 --dry-run
```

Reuse the shared tunnel and Caddy; preserve unrelated routes. Caddy/Tunnel must
expose **only** `/hooks/theme-generator` on the deploy hostname. The internal
receiver's `/healthz` is for Docker health checks and must not be public there.
The workflow checks anonymous requests are blocked by Access, authenticated
unrelated paths return 404, and an invalid HMAC reaches the receiver but gets 401.

Required GitHub configuration:

| Scope               | Name                         | Value                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------ |
| Repository variable | `DEPLOY_ENABLED`             | `true` after setup; unset/`false` skips deployment     |
| Repository variable | `THEME_GENERATOR_BASE_URL`   | Retained public HTTPS origin, without trailing slash   |
| Repository variable | `THEME_GENERATOR_DEPLOY_URL` | Exact HTTPS deploy URL ending `/hooks/theme-generator` |
| Production secret   | `DEPLOY_WEBHOOK_SECRET`      | Host-generated signing secret                          |
| Production secret   | `CF_ACCESS_CLIENT_ID`        | Dedicated Access service-token ID                      |
| Production secret   | `CF_ACCESS_CLIENT_SECRET`    | Dedicated Access service-token secret                  |

With the reviewed changes merged to `main` and host setup complete:

```sh
gh variable set DEPLOY_ENABLED --body true --repo kylescudder/theme-generator
gh workflow run release.yml --ref main --repo kylescudder/theme-generator
```

Check public HTTPS and run `python3 -B deploy/verify-runtime.py https://YOUR_PUBLIC_HOSTNAME <commit-sha>`.
In a real browser, verify color changes, live preview, reload persistence and the
actual JSON download at desktop/mobile widths. Only after the host deployment
passes, delete the matching Netlify project and verify it is absent, then recheck
the public hostname. Do not delete the old project while the new route is unproven.

## Operation and rollback

```sh
cd /Users/kyle/platform/apps/theme-generator
docker compose --env-file .env ps
launchctl print gui/501/com.kylescudder.deploy-core
tail -n 100 state/deploy.log
./deploy/host-deploy.sh sha256:PREVIOUS_ATTESTED_MAIN_DIGEST
```

Manual rollback accepts an exact digest, verifies its provenance, waits for
health, and pins it exactly like an automatic release. Retain previous images.
No data migrations or server data backups are needed for this static app.
Include private deployment configuration, queue and state in the host's established
encrypted NAS backup. Stop automatic releases with:

```sh
gh variable set DEPLOY_ENABLED --body false --repo kylescudder/theme-generator
```

Host `deploy/` or Compose changes need an update of the reviewed host checkout;
recreate the receiver or reinstall the LaunchAgent when relevant. Routine image
releases do not run host scripts downloaded from the image. Colima and Kyle's
login session must be running; reboot recovery follows the platform runbook.
