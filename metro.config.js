// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const folder = (...parts) => {
  const dir = path.resolve(__dirname, ...parts).replace(/[/\\]/g, '[/\\\\]');
  return new RegExp(`^${dir}[/\\\\].*`);
};

// El backend (Laravel) y el sitio web viven en el mismo repositorio. Metro no debe vigilarlos
// ni empaquetarlos; del sitio sólo se usan sus textos (web/src/content) para los documentos legales.
config.resolver.blockList = [folder('backend'), folder('web', 'node_modules'), folder('web', 'dist')];

module.exports = config;
