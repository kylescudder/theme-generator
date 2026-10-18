"""Deployment outcomes at the Docker/GitHub command boundary, without a host."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('deployer', Path(__file__).with_name('herman-deploy.py'))
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
DIGEST = 'sha256:' + 'a' * 64
REVISION = 'b' * 40
CANDIDATE = deploy.IMAGE + '@' + DIGEST


class Deployment(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.app = Path(self.directory.name)
        self.state = self.app / 'state'
        self.state.mkdir()
        self.env = self.app / '.env'
        self.env.write_text('THEME_GENERATOR_IMAGE=previous\n')
        self.env.chmod(0o600)
        self.commands = []
        self.running = 'previous'
        self.reject_verification = False
        self.unhealthy = set()
        self.started = []
        self.stopped = []
        self.revision = REVISION
        self.arrival_during_start = False
        for name, value in [('APP', self.app), ('STATE', self.state),
                            ('REQUESTS', self.app / 'deploy-spool/requests')]:
            p = patch.object(deploy, name, value)
            p.start()
            self.addCleanup(p.stop)
        p = patch.object(subprocess, 'run', self.command)
        p.start()
        self.addCleanup(p.stop)

    def command(self, args, **kwargs):
        self.commands.append(args)
        result = b''
        if args[0] == 'gh' and self.reject_verification:
            return subprocess.CompletedProcess(args, 1, b'', b'sensitive provider details')
        if args[:2] == ['docker', 'compose']:
            action = args[args.index('--env-file') + 2:]
            image = kwargs['env'].get('THEME_GENERATOR_IMAGE')
            if not image and 'THEME_GENERATOR_IMAGE=' not in self.env.read_text():
                return subprocess.CompletedProcess(args, 1, b'', b'image required')
            if action[0] == 'ps':
                result = b'container\n' if self.running else b''
            if action[0] == 'up':
                self.started.append(image)
                if self.arrival_during_start:
                    self.queue('arriving.json', 30, 'sha256:' + 'd' * 64)
            if action[0] == 'stop':
                self.stopped.append(image)
            if action[0] == 'up' and image in self.unhealthy:
                return subprocess.CompletedProcess(args, 1, b'', b'health failed')
        if args[:2] == ['docker', 'inspect']:
            result = '|'.join(json.dumps(value) for value in [
                self.running, {'Running': True, 'Health': {'Status': 'healthy'}},
                {'org.opencontainers.image.revision': REVISION}
            ]).encode()
        if args[:3] == ['docker', 'image', 'inspect']:
            result = json.dumps({'org.opencontainers.image.revision': self.revision}).encode()
        return subprocess.CompletedProcess(args, 0, result, b'')

    def test_manual_digest_is_bound_to_its_source_revision_before_starting(self):
        deploy.deploy(DIGEST)
        verifications = [a for a in self.commands if a[0] == 'gh']
        self.assertTrue(any('--source-digest' in a and a[a.index('--source-digest') + 1] == REVISION
                            for a in verifications))
        self.assertIn(CANDIDATE, self.env.read_text())

    def test_first_release_works_without_a_previous_image_pin(self):
        self.running = None
        self.env.write_text('')
        deploy.deploy(DIGEST, REVISION)
        self.assertIn(CANDIDATE, self.env.read_text())
        self.assertIsNone(json.loads((self.state / 'deployment.json').read_text())['previous_image'])

    def test_failed_verification_never_pulls_or_starts_an_image(self):
        self.reject_verification = True
        with self.assertRaisesRegex(deploy.Error, 'gh attestation operation failed'):
            deploy.deploy(DIGEST, REVISION)
        self.assertFalse(any(a[:2] == ['docker', 'pull'] for a in self.commands))
        self.assertEqual(self.started, [])
        self.assertEqual(self.env.read_text(), 'THEME_GENERATOR_IMAGE=previous\n')

    def test_revision_mismatch_never_starts_an_image(self):
        self.revision = 'c' * 40
        with self.assertRaisesRegex(deploy.Error, 'revision does not match'):
            deploy.deploy(DIGEST, REVISION)
        self.assertEqual(self.started, [])

    def test_unhealthy_candidate_restores_previous_and_records_no_success(self):
        self.unhealthy.add(CANDIDATE)
        with self.assertRaisesRegex(deploy.Error, 'Candidate was not healthy'):
            deploy.deploy(DIGEST, REVISION)
        self.assertEqual(self.started, [CANDIDATE, 'previous'])
        self.assertIn('THEME_GENERATOR_IMAGE=previous', self.env.read_text())
        self.assertFalse((self.state / 'deployment.json').exists())
        self.assertFalse((self.state / 'history.log').exists())

    def test_failed_first_candidate_is_stopped_without_pinning_it(self):
        self.running = None
        self.env.write_text('')
        self.unhealthy.add(CANDIDATE)
        with self.assertRaisesRegex(deploy.Error, 'Candidate was not healthy'):
            deploy.deploy(DIGEST, REVISION)
        self.assertEqual(self.stopped, [CANDIDATE])
        self.assertEqual(self.env.read_text(), '')

    def test_rollback_failure_is_reported_without_pinning_success(self):
        self.unhealthy.update([CANDIDATE, 'previous'])
        with self.assertRaisesRegex(deploy.Error, 'ROLLBACK FAILED'):
            deploy.deploy(DIGEST, REVISION)
        self.assertFalse((self.state / 'deployment.json').exists())
        self.assertIn('THEME_GENERATOR_IMAGE=previous', self.env.read_text())

    def test_success_restricts_provenance_and_pins_exact_digest(self):
        deploy.deploy(DIGEST, REVISION)
        verification = next(a for a in self.commands if a[0] == 'gh')
        for flag, expected in [('--repo', 'kylescudder/theme-generator'),
                               ('--signer-workflow', 'kylescudder/theme-generator/.github/workflows/release.yml'),
                               ('--source-ref', 'refs/heads/main'), ('--source-digest', REVISION)]:
            self.assertEqual(verification[verification.index(flag) + 1], expected)
        self.assertIn('--bundle-from-oci', verification)
        self.assertIn('--deny-self-hosted-runners', verification)
        self.assertEqual(json.loads((self.state / 'deployment.json').read_text())['image'], CANDIDATE)
        self.assertEqual(self.env.stat().st_mode & 0o777, 0o600)

    def test_healthy_duplicate_requires_matching_revision_and_does_not_restart(self):
        self.running = CANDIDATE
        with self.assertRaisesRegex(deploy.Error, 'revision does not match'):
            deploy.deploy(DIGEST, 'c' * 40)
        deploy.deploy(DIGEST, REVISION)
        self.assertEqual(self.started, [])
        self.assertIn(CANDIDATE, self.env.read_text())

    def queue(self, name, timestamp, digest=DIGEST):
        deploy.REQUESTS.mkdir(parents=True, exist_ok=True)
        (deploy.REQUESTS / name).write_text(json.dumps({
            'digest': digest, 'revision': REVISION, 'timestamp': timestamp
        }))

    def process_queue(self):
        with patch.object(sys, 'argv', ['herman-deploy.py']):
            deploy.main()

    def test_queue_consumes_newest_request_and_discards_malformed_entry(self):
        self.queue('old.json', 10, 'sha256:' + 'c' * 64)
        self.queue('new.json', 20)
        (deploy.REQUESTS / 'malformed.json').write_text('{')
        self.process_queue()
        self.assertEqual(list(deploy.REQUESTS.iterdir()), [])
        self.assertEqual(self.started, [CANDIDATE])
        self.assertEqual(json.loads((self.state / 'last-request.json').read_text())['timestamp'], 20)

    def test_queue_symlink_is_discarded_without_touching_its_target(self):
        self.queue('valid.json', 10)
        target = self.app / 'private'
        target.write_text('keep')
        (deploy.REQUESTS / 'link.json').symlink_to(target)
        self.process_queue()
        self.assertEqual(target.read_text(), 'keep')
        self.assertEqual(self.started, [CANDIDATE])

    def test_replaced_queue_directory_is_rejected(self):
        target = self.app / 'other'
        target.mkdir()
        (target / 'private.json').write_text('keep')
        deploy.REQUESTS.parent.mkdir()
        deploy.REQUESTS.symlink_to(target)
        with self.assertRaisesRegex(deploy.Error, 'must not be symlinks'):
            self.process_queue()
        self.assertEqual((target / 'private.json').read_text(), 'keep')
        self.assertEqual(self.started, [])

    def test_crashed_receiver_partial_is_cleaned_and_directory_is_quarantined(self):
        self.queue('valid.json', 10)
        (deploy.REQUESTS / 'bad.json').mkdir()
        partial = deploy.REQUESTS / '.stale.json.tmp'
        partial.write_text('partial')
        os.utime(partial, (0, 0))
        self.process_queue()
        self.assertEqual(list(deploy.REQUESTS.iterdir()), [])
        self.assertEqual(len(list(self.state.glob('rejected-directory-*'))), 1)

    def test_failed_queued_request_records_failure_without_secret_details(self):
        self.queue('request.json', 10)
        self.reject_verification = True
        with self.assertRaises(deploy.Error):
            self.process_queue()
        failure = (self.state / 'last-failure.json').read_text()
        self.assertIn(DIGEST, failure)
        self.assertNotIn('sensitive provider details', failure)

    def test_unprotected_runtime_configuration_is_rejected(self):
        self.env.chmod(0o644)
        with self.assertRaisesRegex(deploy.Error, 'protected regular file'):
            deploy.deploy(DIGEST, REVISION)
        self.assertEqual(self.commands, [])

    def test_request_arriving_during_deploy_remains_for_the_next_run(self):
        self.queue('first.json', 10)
        self.arrival_during_start = True
        self.process_queue()
        self.assertEqual(self.started, [CANDIDATE])
        self.assertTrue((deploy.REQUESTS / 'arriving.json').is_file())
        self.assertEqual(json.loads((deploy.REQUESTS / 'arriving.json').read_text())['timestamp'], 30)


if __name__ == '__main__':
    unittest.main()
