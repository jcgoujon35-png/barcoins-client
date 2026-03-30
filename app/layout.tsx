import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'BarCoins',
  description: 'Joue dans ton bar — Gagne des points et domine le classement',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'BarCoins' },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#C9922A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><link rel="apple-touch-icon" href="/icon-192.png" /></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
