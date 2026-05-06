import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { QueryProvider } from '@/providers/query-provider'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: {
    default: 'ApexStore — Thiết bị Apple chính hãng',
    template: '%s | ApexStore',
  },
  description:
    'Mua iPhone, iPad, MacBook, AirPods chính hãng với giá tốt nhất. Trải nghiệm mua sắm công nghệ đỉnh cao tại ApexStore.',
  keywords: ['iPhone', 'iPad', 'MacBook', 'Apple', 'mua điện thoại', 'ApexStore'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'ApexStore',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
