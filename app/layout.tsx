import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Header from '@/components/semantic/Header'
import Footer from '@/components/semantic/Footer'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--fnt',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HEK',
  description: 'HEK Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <main>
            {children}
          </main>
          <Footer/>
      </body>
    </html>
  )
}
