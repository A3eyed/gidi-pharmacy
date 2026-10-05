import ExceptionsManager from 'react-native/Libraries/Core/ExceptionsManager';
import { reportErrorToRemote } from './__create/report-error-to-remote';

// In dev (Expo Go + in-builder preview) the template used to replace RN's
// global exception handler with a bare no-op. That swallowed EVERY runtime
// exception, including fatal ones: a screen that throws on render in Expo Go
// then leaves the app in a half-mounted state with no red screen, freezes, and
// the native runtime tears down ~1 min later. Nothing reaches the builder Logs
// panel either, so the crash is undiagnosable from any surface.
//
// Instead of dropping the error, forward it to the builder Logs panel (the same
// `reportErrorToRemote` path Metro bundling errors already use) and chain to
// RN's original handler for FATAL errors so the crash actually surfaces rather
// than silently freezing. Non-fatal warnings stay quiet, preserving the clean
// in-builder preview the no-op was added for.
if (__DEV__) {
  const originalHandleException = ExceptionsManager.handleException;
  ExceptionsManager.handleException = (error, isFatal) => {
    void reportErrorToRemote({ error }).catch(() => {
      // Reporting must never itself crash the host app.
    });
    if (isFatal) {
      originalHandleException(error, isFatal);
    }
  };
}

import 'react-native-url-polyfill/auto';
import './src/__create/polyfills';
global.Buffer = require('buffer').Buffer;

import '@expo/metro-runtime';
import { AppRegistry, LogBox } from 'react-native';
import { initSentry } from './__create/sentry';
import { initTestFlightLogger } from './__create/testflight-logger';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import App from './entrypoint';

initSentry();
initTestFlightLogger();

if (__DEV__ || process.env.EXPO_PUBLIC_CREATE_ENV === 'DEVELOPMENT') {
  LogBox.ignoreAllLogs();
  LogBox.uninstall();
  AppRegistry.setWrapperComponentProvider(() => ({ children }) => {
    return <>{children}</>;
  });
}
renderRootComponent(App);
