import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { TabIdentity } from '@/components/tab-identity'

export const metadata: Metadata = {
  title: 'GravityOS',
  metadataBase: new URL('https://gravityos.local'),
  description: '',
  generator: '',
  icons: {
    icon: '/gravity-browser-logo.png',
    apple: '/gravity-browser-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TabIdentity />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
