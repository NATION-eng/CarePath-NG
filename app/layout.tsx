import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CarePath NG — Family Healthcare Continuity Platform',
  description: 'A family-centred healthcare continuity companion for Nigerian care journeys.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CarePath NG',
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
        {children}
      </body>
    </html>
  );
}
