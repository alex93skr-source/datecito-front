// Levanta el backend local (Docker). Si Docker Desktop está apagado, lo inicia;
// antes renombra los archivos de conexión que Docker deja trabados en Windows al
// reiniciar la PC (provocan que su motor no arranque).
const { execFileSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const compose = path.join(__dirname, '..', 'backend', 'docker-compose.yml');

const dockerReady = () => {
  try {
    execFileSync('docker', ['info', '--format', '{{.ServerVersion}}'], { stdio: 'ignore', timeout: 15000 });
    return true;
  } catch {
    return false;
  }
};

const dockerDesktopRunning = () => {
  try {
    return execFileSync('tasklist', { encoding: 'utf8' }).includes('Docker Desktop.exe');
  } catch {
    return false;
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!dockerReady()) {
    if (process.platform === 'win32' && !dockerDesktopRunning()) {
      const local = process.env.LOCALAPPDATA;
      const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
      for (const dir of [path.join(local, 'Docker', 'run'), path.join(local, 'docker-secrets-engine')]) {
        if (fs.existsSync(dir)) fs.renameSync(dir, `${dir}.stale-${stamp}`);
      }
      console.log('Iniciando Docker Desktop…');
      spawn('C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe', [], { detached: true, stdio: 'ignore' }).unref();
    }

    for (let i = 0; i < 48 && !dockerReady(); i++) await sleep(5000);
    if (!dockerReady()) {
      console.error('Docker no arrancó. Abre Docker Desktop manualmente y vuelve a intentar.');
      process.exit(1);
    }
  }

  execFileSync('docker', ['compose', '-f', compose, 'up', '-d'], { stdio: 'inherit' });
  console.log('\nBackend listo: http://localhost:8000/api/v1  ·  Correos: http://localhost:8025');
}

main();
