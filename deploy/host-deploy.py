#!/usr/bin/env python3
"""Theme Generator settings and hooks for the shared host deployer (deploy_core.py)."""
from pathlib import Path

import deploy_core as core


def health(image):
    core.compose('exec', '-T', 'web', 'sh', '-c',
                 "wget -qO- http://127.0.0.1:8080/ | grep -q 'mpro5 Theme Generator'", image=image)


APP = core.App(
    name='theme-generator', title='Theme Generator',
    image='ghcr.io/kylescudder/theme-generator', repo='kylescudder/theme-generator',
    image_var='THEME_GENERATOR_IMAGE', service='web', app_dir=Path(__file__).resolve().parents[1],
    health=health,
    bind_source_digest=True)

if __name__ == '__main__':
    core.cli(APP, __file__)
