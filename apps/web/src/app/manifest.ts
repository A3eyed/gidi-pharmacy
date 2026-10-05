import type { MetadataRoute } from 'next';

/**
 * PWA / web app manifest for GiDi. Served automatically at /manifest.webmanifest
 * and referenced from the root layout metadata.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GiDi Pharmacy',
    short_name: 'GiDi',
    description: 'Pharmacy inventory, sales and Azara. Works on desktop, web and mobile, online and offline.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    categories: ['business', 'medical'],
    id: '/',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
