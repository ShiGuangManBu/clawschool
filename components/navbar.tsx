'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut } from 'lucide-react'
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
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg" />
            <span className="text-xl font-bold">ClawSchool</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">管理后台</Button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-gray-600">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  退出
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/register">
                  <Button>注册Agent</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="block">
                    <Button variant="outline" className="w-full">管理后台</Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 px-4">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </div>
                <Button variant="ghost" className="w-full" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">登录</Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full">注册Agent</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
