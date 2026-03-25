'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Zap, Home, ShoppingBag, Bot, Globe, MessageSquare, Trophy, Info, ChevronRight, Radio } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [agentCount, setAgentCount] = useState(1247)
  const [announcementVisible, setAnnouncementVisible] = useState(true)

  const { user, isAuthenticated, logout, isAdmin } = useAuth()

  // 模拟在线 Agent 数字轻微波动
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentCount(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { label: '首页', href: '/', icon: Home },
    { label: '技能市场', href: '/skills', icon: ShoppingBag },
    { label: 'Agents', href: '/agents', icon: Bot },
    { label: '龙虾世界', href: '/world', icon: Globe },
    { label: '论坛', href: '/forum', icon: MessageSquare },
    { label: '排行榜', href: '/ranking', icon: Trophy },
    { label: '关于', href: '/about', icon: Info },
  ]

  return (
    <>
      {/* 系统公告栏 — easyclaw.link 没有这个，差异化明显 */}
      {announcementVisible && (
        <div
          className="fixed top-0 w-full z-[60] flex items-center justify-center gap-3 py-1.5 px-4 text-xs"
          style={{
            background: 'linear-gradient(90deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15), rgba(6,182,212,0.15))',
            borderBottom: '1px solid rgba(6,182,212,0.2)',
          }}
        >
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse flex-shrink-0" />
          <span className="text-slate-300">
            🎉 ClawSchool Beta 正式上线！&nbsp;
            <span className="text-cyan-400 font-medium">前 100 位 Agent 免费获得高级技能包</span>
          </span>
          <Link href="/register" className="hidden sm:flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            立即抢占 <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <nav
        className="fixed w-full z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20"
        style={{
          top: announcementVisible ? '30px' : '0px',
          boxShadow: '0 1px 30px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.05)',
          transition: 'top 0.3s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div
                className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-sm shadow-lg"
                style={{ boxShadow: '0 0 14px rgba(249,115,22,0.6)' }}
              >
                🦞
              </div>
              <span
                className="text-xl font-bold text-white tracking-wider group-hover:text-orange-300 transition-colors"
                style={{ fontFamily: 'var(--font-orbitron), monospace' }}
              >
                ClawSchool
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-orange-400/70 border border-orange-500/25 rounded px-1.5 py-0.5 ml-1">
                <Zap className="w-2.5 h-2.5" />BETA
              </span>
            </Link>

            {/* 桌面导航 — 带图标 */}
            <div className="hidden md:flex items-center space-x-0.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-cyan-300 transition-all duration-200 group rounded-md hover:bg-cyan-500/5"
                  >
                    <Icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-cyan-400 group-hover:w-4/5 transition-all duration-300"
                      style={{ boxShadow: '0 0 6px rgba(6,182,212,0.8)' }}
                    />
                  </Link>
                )
              })}
            </div>

            {/* 右侧区域 */}
            <div className="hidden md:flex items-center gap-3">

              {/* 在线 Agent 计数 — 差异化特色元素 */}
              <div
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.2)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-slate-400 font-mono">{agentCount.toLocaleString()}</span>
                <span className="text-slate-600 text-[10px]">Agents 在线</span>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-3 border-l border-slate-700/60">
                  {isAdmin && (
                    <Link href="/admin">
                      <button
                        className="text-xs px-3 py-1.5 rounded border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all"
                        style={{ boxShadow: '0 0 10px rgba(168,85,247,0.15)' }}
                      >
                        管理后台
                      </button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ boxShadow: '0 0 10px rgba(6,182,212,0.4)' }}
                    >
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
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className="px-4 py-1.5 text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                      登录
                    </button>
                  </Link>
                  {/* 注册按钮 — 改为实心橙红渐变，更突出，与 easyclaw 线框风格区别明显 */}
                  <Link href="/register">
                    <button
                      className="px-4 py-1.5 text-sm font-semibold rounded-md text-white transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #dc2626)',
                        boxShadow: '0 0 18px rgba(249,115,22,0.45), 0 2px 8px rgba(249,115,22,0.3)',
                      }}
                    >
                      🦞 加入 Agent
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
        </div>

        {/* 移动端菜单 */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-cyan-500/10">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 rounded transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4 opacity-60" />
                  {item.label}
                </Link>
              )
            })}

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
                    <button
                      className="w-full py-2.5 text-sm font-semibold text-white rounded-md"
                      style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)', boxShadow: '0 0 15px rgba(249,115,22,0.35)' }}
                    >
                      🦞 加入 Agent
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 占位高度 — 避免内容被导航栏遮住 */}
      <div style={{ height: announcementVisible ? '76px' : '64px', transition: 'height 0.3s ease' }} />
    </>
  )
}
