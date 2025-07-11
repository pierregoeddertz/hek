import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Header from '@/components/semantic/Header'
import Footer from '@/components/semantic/Footer'
import { DefaultSeo } from 'next-seo';
import { Analytics } from '@vercel/analytics/react';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--fnt',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HEK',
  description: 'HEK Application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head />
      <body>
        <DefaultSeo
          title="HEK - Nachhaltige Energielösungen"
          description="Innovative Produkte und News rund um erneuerbare Energien."
          openGraph={{
            type: 'website',
            locale: 'de_DE',
            url: 'https://hek.vercel.app',
            site_name: 'HEK',
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
