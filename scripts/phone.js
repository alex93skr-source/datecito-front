// Conecta el celular con el backend local: el teléfono ve localhost:8000 (API) y localhost:9000 (fotos) de esta PC.
//
//   npm run phone                                   enlaza los celulares conectados (USB o Wi-Fi)
//   npm run phone -- vincular 192.168.1.25:41235 123456   sólo la primera vez por Wi-Fi (código de vinculación)
//   npm run phone -- wifi 192.168.1.25:37891        conecta por Wi-Fi y enlaza
//   npm run phone -- instalar                       instala la última versión compilada y enlaza
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sdk = process.env.ANDROID_HOME || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
const adb = path.join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
const apk = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const run = (args, opts = {}) => execFileSync(adb, args, { encoding: 'utf8', ...opts });

const [command, address, code] = process.argv.slice(2);

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const devices = () =>
  run(['devices'])
    .split('\n')
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter(([serial]) => serial);

if (command === 'vincular') {
  if (!address || !code) fail('Uso: npm run phone -- vincular IP:PUERTO CÓDIGO  (los datos de "Vincular dispositivo con código")');
  try {
    console.log(run(['pair', address, code]).trim());
  } catch {
    fail('No se pudo vincular. Revisa que el celular y la PC estén en la misma red Wi-Fi y que el código no haya cambiado.');
  }
  console.log('\nVinculado. Ahora conecta con la dirección de la pantalla principal de "Depuración inalámbrica":\n  npm run phone -- wifi IP:PUERTO');
  process.exit(0);
}

if (command === 'wifi') {
  if (!address) fail('Uso: npm run phone -- wifi IP:PUERTO  (la "Dirección IP y puerto" de Depuración inalámbrica)');
  const out = run(['connect', address]).trim();
  console.log(out);
  if (!/connected/.test(out)) fail('No se pudo conectar. ¿Ya vinculaste el celular? ¿Siguen en la misma red Wi-Fi?');
}

const list = devices();
const ready = list.filter(([, state]) => state === 'device');
if (list.some(([, state]) => state === 'unauthorized')) console.warn('Un celular no ha autorizado esta PC: desbloquéalo y toca "Permitir" en el aviso de depuración.');
if (!ready.length) fail('No encontramos un celular conectado. Conéctalo por USB o Wi-Fi con la depuración activada y vuelve a intentar.');

for (const [serial] of ready) {
  if (command === 'instalar') {
    if (!fs.existsSync(apk)) fail('No hay una versión compilada. Compílala primero desde Android Studio.');
    console.log(`Instalando en ${serial}…`);
    run(['-s', serial, 'install', '-r', apk], { stdio: 'inherit' });
  }
  for (const port of ['8000', '9000']) {
    run(['-s', serial, 'reverse', `tcp:${port}`, `tcp:${port}`]);
  }
}
console.log(`Listo: ${ready.length === 1 ? 'el celular ya puede' : 'los celulares ya pueden'} usar la API local (puertos 8000 y 9000).`);
