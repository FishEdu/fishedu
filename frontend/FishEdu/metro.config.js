// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const ALIASES = {
  '@': './',
  '@components': './app/components',
  '@utils': './app/utils',
  '@images': './assets/images',
  '@hooks': './app/hooks',
  '@constants': './app/constants',
  '@services': './app/services',
  '@types': './app/types'
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Ensure you call the default resolver.
  return context.resolveRequest(
    context,
    // Use an alias if one exists.
    ALIASES[moduleName] ?? moduleName,
    platform
  );
};

module.exports = config;
