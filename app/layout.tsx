import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import Footer from '@/components/semantic/Footer';
import { Outfit } from 'next/font/google';
import Providers from './providers';
import MenuProvider from './MenuProvider';

export const metadata: Metadata = {
  title: {
    default: 'HEK - Nachhaltige Energielösungen',
    template: '%s | HEK',
  },
  description:
    'Innovative Produkte und News rund um erneuerbare Energien. Entdecken Sie Aeroleaf und Smartflower für eine nachhaltige Zukunft.',
  keywords: [
    'Energie',
    'Nachhaltigkeit',
    'Aeroleaf',
    'Smartflower',
    'Erneuerbare Energien',
    'Windenergie',
    'Solarenergie',
  ],
  authors: [{ name: 'HEK Team' }],
  creator: 'HEK',
  publisher: 'HEK',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hek.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://hek.vercel.app',
    title: 'HEK - Nachhaltige Energielösungen',
    description: 'Innovative Produkte und News rund um erneuerbare Energien.',
    siteName: 'HEK',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HEK - Nachhaltige Energielösungen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEK - Nachhaltige Energielösungen',
    description: 'Innovative Produkte und News rund um erneuerbare Energien.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--fnt',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={outfit.variable}>
      <body>
        <Providers>
          <MenuProvider>
            <main>{children}</main>
            <Footer />
            <Analytics />
          </MenuProvider>
        </Providers>
      </body>
    </html>
  );
}
