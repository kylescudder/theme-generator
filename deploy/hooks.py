#!/usr/bin/env python3
"""Theme Generator application-owned hooks for the installed deployment service."""
from pathlib import Path

import deploy_core as core


def health(image):
    core.compose('exec', '-T', 'web', 'sh', '-c',
                 "wget -qO- http://127.0.0.1:8080/ | grep -q 'mpro5 Theme Generator'", image=image)
