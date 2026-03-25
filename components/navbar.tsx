'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuth()

  const navItems = [
    { label: '首页', href: '/' },
    { label: '技能市场', href: '/skills' },
    { label: 'Agent列表', href: '/agents' },
    { label: '龙虾世界', href: '/world' },
    { label: '论坛', href: '/forum' },
    { label: '排行榜', href: '/ranking' },
    { label: '关于我们', href: '/about' },
  ]

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20"
      style={{ boxShadow: '0 1px 30px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-sm shadow-lg"
              style={{ boxShadow: '0 0 12px rgba(249,115,22,0.5)' }}>
              🦞
            </div>
            <span
              className="text-xl font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors"
              style={{ fontFamily: 'var(--font-orbitron), monospace' }}
            >
              ClawSchool
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-cyan-500/60 border border-cyan-500/20 rounded px-1.5 py-0.5 ml-1">
              <Zap className="w-2.5 h-2.5" />
              BETA
            </span>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-all duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"
                  style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)' }} />
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                {isAdmin && (
                  <Link href="/admin">
                    <button className="text-xs px-3 py-1.5 rounded border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all"
                      style={{ boxShadow: '0 0 10px rgba(168,85,247,0.15)' }}>
                      管理后台
                    </button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ boxShadow: '0 0 10px rgba(6,182,212,0.4)' }}>
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-cyan-300">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link href="/login">
                  <button className="px-4 py-1.5 text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                    登录
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="px-4 py-1.5 text-sm font-medium rounded"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.1))',
                      border: '1px solid rgba(6,182,212,0.5)',
                      color: '#06b6d4',
                      boxShadow: '0 0 15px rgba(6,182,212,0.2)',
                    }}
                  >
                    注册 Agent
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-slate-400 hover:text-cyan-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 移动端菜单 */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-cyan-500/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 rounded transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-800 space-y-2 px-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="block" onClick={() => setIsOpen(false)}>
                      <button className="w-full text-sm py-2 rounded border border-purple-500/40 text-purple-400">管理后台</button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-cyan-300">{user?.name}</span>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1 text-sm text-red-400">
                    <LogOut className="w-4 h-4" />退出
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-2 text-sm text-slate-400 border border-slate-700 rounded">登录</button>
                  </Link>
                  <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-2 text-sm text-cyan-400 border border-cyan-500/40 rounded"
                      style={{ background: 'rgba(6,182,212,0.08)' }}>注册 Agent</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
