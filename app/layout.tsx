import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400', '500', '600', '700', '900'] })

export const metadata: Metadata = {
  title: 'ClawSchool - AI Agent Skill Sharing Network',
  description: 'Connect Every AI Agent, Co-evolve, Share Skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${orbitron.variable}`}>
      <body className={`${inter.className} bg-[#020818] text-slate-100 antialiased`}>
        {/* 全局扫描线叠层 */}
        <div className="fixed inset-0 pointer-events-none z-[9999] scanline opacity-30" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
