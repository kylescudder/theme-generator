#!/usr/bin/env python3
"""Install app-specific deploy pieces from a reviewed checkout on the host."""
import argparse
import json
import os
from pathlib import Path
import secrets
import subprocess
from urllib.parse import urlsplit

APP = Path(__file__).resolve().parents[1]
REPO = 'kylescudder/theme-generator'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', required=True, help='Existing public HTTPS origin to retain')
    parser.add_argument('--deploy-url', required=True, help='HTTPS URL ending /hooks/theme-generator')
    parser.add_argument('--host', required=True, help="This host's LocalHostName; anything else is refused")
    args = parser.parse_args()
    for value, expected_path in [(args.base_url, ''), (args.deploy_url, '/hooks/theme-generator')]:
        url = urlsplit(value)
        if (url.scheme != 'https' or not url.hostname or url.username or url.password
                or url.path != expected_path or url.query or url.fragment):
            parser.error('Use HTTPS origins without credentials; deploy URL must end /hooks/theme-generator.')
    hostname = subprocess.check_output(['/usr/sbin/scutil', '--get', 'LocalHostName']).decode().strip()
    if hostname != args.host or APP != Path('/Users/kyle/platform/apps/theme-generator'):
        raise SystemExit('Run on the host from /Users/kyle/platform/apps/theme-generator as the Colima owner.')
    os.umask(0o077)
    subprocess.run(['docker', 'network', 'inspect', 'platform-web'], stdout=subprocess.DEVNULL, check=True)
    # Pause deployment while setup is incomplete, including on a repeated bootstrap.
    subprocess.run(['gh', 'variable', 'set', 'DEPLOY_ENABLED', '--body', 'false', '--repo', REPO], check=True)
    for name in ('state', 'secrets', 'deploy-spool/requests'):
        directory = APP / name
        if directory.is_symlink():
            raise SystemExit(f'{name} must not be a symlink.')
        directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    secret = APP / 'secrets/deploy-webhook-secret'
    if not secret.exists() and not secret.is_symlink():
        with secret.open('x') as stream:
            stream.write(secrets.token_hex(32) + '\n')
    if secret.is_symlink() or not secret.is_file() or secret.stat().st_mode & 0o077:
        raise SystemExit('Signing secret must be a protected regular file (0600).')
    if len(secret.read_text().strip()) < 32:
        raise SystemExit('Signing secret must contain at least 32 characters.')
    files = {
        '.env': '',
        '.env.deploy-hook': (
            f'DEPLOY_HOOK_USER={os.getuid()}:{os.getgid()}\n'
            f'DEPLOY_SPOOL_DIR={APP}/deploy-spool\n'
            f'DEPLOY_WEBHOOK_SECRET_FILE={secret}\nPLATFORM_WEB_NETWORK=platform-web\n'
        )
    }
    for name, value in files.items():
        path = APP / name
        if not path.exists() and not path.is_symlink():
            with path.open('x') as stream:
                stream.write(value)
        if path.is_symlink() or not path.is_file() or path.stat().st_mode & 0o077:
            raise SystemExit(f'{name} must be a protected regular file (0600).')
    environment = f'repos/{REPO}/environments/production'
    subprocess.run(['gh', 'api', '--method', 'PUT', environment, '--input', '-'],
                   input=json.dumps({'deployment_branch_policy': {
                       'protected_branches': False, 'custom_branch_policies': True
                   }}).encode(), stdout=subprocess.DEVNULL, check=True)
    policies = json.loads(subprocess.check_output(['gh', 'api', environment + '/deployment-branch-policies']))
    if not any(item['name'] == 'main' and item.get('type') == 'branch'
               for item in policies.get('branch_policies', [])):
        subprocess.run(['gh', 'api', '--method', 'POST', environment + '/deployment-branch-policies',
                        '-f', 'name=main', '-f', 'type=branch'], stdout=subprocess.DEVNULL, check=True)
    with secret.open('rb') as stream:
        subprocess.run(['gh', 'secret', 'set', 'DEPLOY_WEBHOOK_SECRET', '--repo', REPO,
                        '--env', 'production'], stdin=stream, check=True)
    for name, value in [('THEME_GENERATOR_BASE_URL', args.base_url),
                        ('THEME_GENERATOR_DEPLOY_URL', args.deploy_url)]:
        subprocess.run(['gh', 'variable', 'set', name, '--body', value, '--repo', REPO], check=True)
    subprocess.run(['docker', 'compose', '-f', 'deploy/compose.deploy-hook.yaml',
                    '--env-file', '.env.deploy-hook', 'up', '-d', '--wait'], cwd=APP, check=True)
    print('Register this app in /Users/kyle/platform/deploy-core/apps.json before enabling releases.')
    print('Receiver installed; automatic deployment remains paused.')
    print('Complete Cloudflare Access/hostname setup in deploy/README.md before enabling deployment.')


if __name__ == '__main__':
    main()
