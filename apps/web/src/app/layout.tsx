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
        <link
          rel="stylesheet"
          href="/fontawesome/releases/v6.3.0/css/pro.min.css?token=2c15cc0cc7"
        />
        {/* Apply the saved theme before paint to avoid a light/dark flash */}
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
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <DesktopInstall />
      </body>
    </html>
  );
}
