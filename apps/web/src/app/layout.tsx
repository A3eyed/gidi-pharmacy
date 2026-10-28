import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './global.css';
import { Providers } from './providers';
import DesktopInstall from '@/components/DesktopInstall';

export const metadata: Metadata = {
  title: 'GiDi - Smart Pharmacy Management',
  description: 'Smart Pharmacy Management',
  applicationName: 'GiDi',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'GiDi - Smart Pharmacy Management',
    description: 'Smart Pharmacy Management',
    siteName: 'GiDi',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'GiDi - Smart Pharmacy Management',
    description: 'Smart Pharmacy Management',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* No remote stylesheets or CDN fonts — icons use lucide-react; type uses system UI. */}
        <script>{`
          (function () {
            try {
              var stored = localStorage.getItem('gidi.preferences');
              var prefs = stored ? JSON.parse(stored) : {};
              var mode = prefs.theme || 'system';
              var isDark =
                mode === 'dark' ||
                (mode === 'system' &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches);
              if (isDark) {
                document.documentElement.classList.add('dark');
              }
              document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            } catch (e) {}
          })();
        `}</script>
      </head>
      <body
        suppressHydrationWarning
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <Providers>{children}</Providers>
        <DesktopInstall />
      </body>
    </html>
  );
}
