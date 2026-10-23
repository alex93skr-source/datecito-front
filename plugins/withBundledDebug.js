const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Makes Android Studio's standard Debug/Run build self-contained.
 * React Native normally excludes the JavaScript bundle from `debug`, expecting
 * Metro to serve it. An empty debuggable-variants list asks the Gradle plugin
 * to embed the bundle, so the installed debug APK opens without Metro.
 */
module.exports = function withBundledDebug(config) {
  return withAppBuildGradle(config, (mod) => {
    const marker = 'debuggableVariants = []';

    if (!mod.modResults.contents.includes(marker)) {
      mod.modResults.contents = mod.modResults.contents.replace(
        'react {',
        `react {\n    // Embed the JS bundle when Android Studio runs the Debug variant.\n    ${marker}`,
      );
    }

    return mod;
  });
};
