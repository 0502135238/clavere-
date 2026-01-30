import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SettingsProvider } from '@/lib/settings'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'CLAVERE - Real-time Conversation Captions',
  description: 'CLAVERE: AI-powered real-time conversation captions for deaf and hard-of-hearing people. Features speaker diarization, overlap detection, and bionic reading.',
  keywords: ['captions', 'transcription', 'accessibility', 'deaf', 'hard of hearing', 'real-time', 'speech to text'],
  authors: [{ name: 'CLAVERE' }],
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#9333ea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="dark bg-dark-bg">
        <ErrorBoundary>
          <SettingsProvider>{children}</SettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
