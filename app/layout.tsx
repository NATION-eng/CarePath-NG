import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'CarePath NG — Family Healthcare Continuity Platform',
  description: 'A family-centred healthcare continuity companion for Nigerian care journeys.',
  manifest: '/manifest.json',
  applicationName: 'CarePath NG',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CarePath NG',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#174C45',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-surface-base text-surface-dark select-none sm:select-auto">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
