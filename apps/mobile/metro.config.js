const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const fs = require('node:fs');
const { FileStore } = require('metro-cache');
const { reportErrorToRemote } = require('./__create/report-error-to-remote');
const {
  handleResolveRequestError,
  VIRTUAL_ROOT,
  VIRTUAL_ROOT_UNRESOLVED,
} = require('./__create/handle-resolve-request-error');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.maxWorkers = 6;

const WEB_ALIASES = {
  'expo-secure-store': path.resolve(__dirname, './polyfills/web/secureStore.web.ts'),
  'react-native-webview': path.resolve(__dirname, './polyfills/web/webview.web.tsx'),
  'react-native-safe-area-context': path.resolve(
    __dirname,
    './polyfills/web/safeAreaContext.web.tsx'
  ),
  'react-native-maps': path.resolve(__dirname, './polyfills/web/maps.web.tsx'),
  'react-native-web/dist/exports/SafeAreaView': path.resolve(
    __dirname,
    './polyfills/web/SafeAreaView.web.tsx'
  ),
  'react-native-web/dist/exports/Alert': path.resolve(__dirname, './polyfills/web/alerts.web.tsx'),
  'react-native-web/dist/exports/RefreshControl': path.resolve(
    __dirname,
    './polyfills/web/refreshControl.web.tsx'
  ),
  'expo-status-bar': path.resolve(__dirname, './polyfills/web/statusBar.web.tsx'),
  './layouts/Tabs': path.resolve(__dirname, './polyfills/web/tabbar.web.tsx'),
  'expo-notifications': path.resolve(__dirname, './polyfills/web/notifications.web.tsx'),
  'expo-font': path.resolve(__dirname, './polyfills/web/expo-font.web.ts'),
  'react-native-web/dist/exports/ScrollView': path.resolve(
    __dirname,
    './polyfills/web/scrollview.web.tsx'
  ),
  'expo-haptics': path.resolve(__dirname, './polyfills/web/haptics.web.ts'),
  'expo-clipboard': path.resolve(__dirname, './polyfills/web/clipboard.web.ts'),
  'expo-image-picker': path.resolve(__dirname, './polyfills/web/imagePicker.web.ts'),
  'expo-linking': path.resolve(__dirname, './polyfills/web/linking.web.ts'),
  'expo-web-browser': path.resolve(__dirname, './polyfills/web/webBrowser.web.ts'),
  'expo-document-picker': path.resolve(__dirname, './polyfills/web/documentPicker.web.ts'),
};
// TextInput alias: the polyfill MUST deep-import the RN host via the package
// subpath (`react-native/Libraries/.../TextInput`), NOT the `react-native`
// barrel. A barrel import re-enters this relative-key alias and freezes / OOM
// Hermes on first TextInput mount in Expo Go. See textinput.native.tsx.
const NATIVE_ALIASES = {
  './Libraries/Components/TextInput/TextInput': path.resolve(
    __dirname,
    './polyfills/native/textinput.native.tsx'
  ),
};
// GiDi ships no in-app purchases and no advertising, so the RevenueCat and
// Google Mobile Ads packages (and their dev-only stubs) have been removed
// entirely. Nothing needs a dev-only native alias.
const DEV_ONLY_NATIVE_ALIASES = {};
const SHARED_ALIASES = {
  'expo-image': path.resolve(__dirname, './polyfills/shared/expo-image.tsx'),
};
fs.mkdirSync(VIRTUAL_ROOT_UNRESOLVED, { recursive: true });
config.watchFolders = [...config.watchFolders, VIRTUAL_ROOT, VIRTUAL_ROOT_UNRESOLVED];

// Add web-specific alias configuration through resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    // Polyfills are not resolved by Metro
    if (
      context.originModulePath.startsWith(`${__dirname}/polyfills/native`) ||
      context.originModulePath.startsWith(`${__dirname}/polyfills/web`) ||
      context.originModulePath.startsWith(`${__dirname}/polyfills/shared`)
    ) {
      return context.resolveRequest(context, moduleName, platform);
    }
    // Wildcard alias for Expo Google Fonts
    if (moduleName.startsWith('@expo-google-fonts/') && moduleName !== '@expo-google-fonts/dev') {
      return context.resolveRequest(context, '@expo-google-fonts/dev', platform);
    }
    // Resolve AnythingMenu to empty component in production
    if (moduleName === './src/__create/anything-menu') {
      const isProduction = process.env.EXPO_PUBLIC_CREATE_ENV === 'PRODUCTION';
      if (isProduction) {
        // Create empty component for production
        const emptyComponentPath = path.resolve(
          __dirname,
          './polyfills/shared/empty-component.tsx'
        );
        return context.resolveRequest(context, emptyComponentPath, platform);
      }
    }
    if (SHARED_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
      return context.resolveRequest(context, SHARED_ALIASES[moduleName], platform);
    }
    if (platform === 'web') {
      // Only apply aliases if the module is one of our polyfills
      if (WEB_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
        return context.resolveRequest(context, WEB_ALIASES[moduleName], platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    }

    if (NATIVE_ALIASES[moduleName] && !moduleName.startsWith('./polyfills/')) {
      return context.resolveRequest(context, NATIVE_ALIASES[moduleName], platform);
    }
    if (
      DEV_ONLY_NATIVE_ALIASES[moduleName] &&
      !moduleName.startsWith('./polyfills/') &&
      process.env.EXPO_PUBLIC_CREATE_ENV !== 'PRODUCTION'
    ) {
      return context.resolveRequest(context, DEV_ONLY_NATIVE_ALIASES[moduleName], platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    return handleResolveRequestError({ error, context, platform, moduleName });
  }
};

const cacheDir = path.join(__dirname, 'caches');

config.cacheStores = () => [
  new FileStore({
    root: path.join(cacheDir, '.metro-cache'),
  }),
];
config.resetCache = false;
config.fileMapCacheDirectory = cacheDir;
config.reporter = {
  ...config.reporter,
  update: (event) => {
    config.reporter?.update(event);
    const reportableErrors = [
      'error',
      'bundling_error',
      'cache_read_error',
      'hmr_client_error',
      'transformer_load_failed',
    ];
    for (const errorType of reportableErrors) {
      if (event.type === errorType) {
        reportErrorToRemote({ error: event.error }).catch((_reportError) => {
          // no-op
        });
      }
    }
    return event;
  },
};

const originalGetTransformOptions = config.transformer.getTransformOptions;

config.transformer = {
  ...config.transformer,
  getTransformOptions: async (entryPoints, options) => {
    if (options.dev === false) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      fs.mkdirSync(cacheDir);
    }
    return await originalGetTransformOptions(entryPoints, options);
  },
};

module.exports = config;
