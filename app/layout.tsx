import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'xedu · Student Self-Assessment',
  description: 'A situational assessment that builds your portrait through the choices you make in a real school day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
