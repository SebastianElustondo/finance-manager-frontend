import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Manager',
  description:
    'A comprehensive financial portfolio management application for tracking investments across different asset classes.',
  keywords: [
    'finance',
    'portfolio',
    'investment',
    'stocks',
    'cryptocurrency',
    'bonds',
  ],
  authors: [{ name: 'Finance Manager Team' }],
  creator: 'Finance Manager Team',
  publisher: 'Finance Manager',
  robots: 'index, follow',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Finance Manager',
    description:
      'Track your investments across stocks, crypto, bonds, and more in one unified platform.',
    url: 'http://localhost:3000',
    siteName: 'Finance Manager',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Finance Manager - Portfolio Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Manager',
    description:
      'Track your investments across stocks, crypto, bonds, and more in one unified platform.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Finance Manager" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finance Manager" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="http://localhost:3000" />
        <meta name="twitter:title" content="Finance Manager" />
        <meta
          name="twitter:description"
          content="Track your investments across stocks, crypto, bonds, and more in one unified platform."
        />
        <meta name="twitter:image" content="/og-image.jpg" />
        <meta name="twitter:creator" content="@financemanager" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Finance Manager" />
        <meta
          property="og:description"
          content="Track your investments across stocks, crypto, bonds, and more in one unified platform."
        />
        <meta property="og:site_name" content="Finance Manager" />
        <meta property="og:url" content="http://localhost:3000" />
        <meta property="og:image" content="/og-image.jpg" />
      </head>
      <body className={inter.className}>
        <div id="root" className="min-h-screen bg-background">
          {children}
        </div>

        {/* PWA Service Worker Registration - Disabled for now */}
        {/* 
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        */}
      </body>
    </html>
  )
}
