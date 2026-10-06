/** Public address of the GiDi web app. Not a secret. */
export const SERVER_URL =
  process.env.EXPO_PUBLIC_BASE_URL || 'https://gidi-pharmacy.vercel.app';

export const AUTH_URL = process.env.EXPO_PUBLIC_PROXY_BASE_URL || SERVER_URL;
