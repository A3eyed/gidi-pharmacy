import type { MetadataRoute } from 'next';

/**
 * PWA / web app manifest for GiDi. Served automatically at /manifest.webmanifest
 * and referenced from the root layout metadata.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GiDi',
    short_name: 'GiDi',
    description: 'Smart Pharmacy Management',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
