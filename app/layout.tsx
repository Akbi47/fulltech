import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fulltech App',
  description: 'Bring all the technologies to you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
          {/* <ConfettiProvider />
          <ToastProvider /> */}
          {children}
        </body>
      </html>
  )
}
