"""Stage the lab outside colon-containing paths, then start Jenkins."""
from pathlib import Path
import shutil
import subprocess
import secrets

source = Path(__file__).resolve().parent.parent
runtime = Path.home() / '.local/share/user-api-jenkins-lab'
runtime.mkdir(parents=True, exist_ok=True)
for name in ('package.json', 'package-lock.json', 'server.js', 'server.test.js', 'jest.config.js'):
    shutil.copy2(source / name, runtime / name)
password = source / 'jenkins/.admin-password'
if not password.exists():
    password.write_text(secrets.token_urlsafe(24) + '\n')
password.chmod(0o600)
shutil.copytree(source / 'jenkins', runtime / 'jenkins', dirs_exist_ok=True)
(runtime / 'jenkins/.admin-password').chmod(0o600)
print(f'Lab runtime: {runtime}', flush=True)
subprocess.run([
    'docker', 'compose', '-p', 'user-api-jenkins',
    '-f', str(runtime / 'jenkins/compose.yaml'), 'up', '-d', '--build'
], check=True)
