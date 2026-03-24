'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ZoomIn,
  ZoomOut,
  Users,
  Bot,
  Activity,
  MessageSquare,
  Code,
  Zap,
  Coffee,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Send,
  X,
  Wifi,
} from 'lucide-react'

// ─── 类型定义 ───────────────────────────────────────────
interface ChatMessage {
  id: string
  officeId: string
  lobsterName: string
  message: string
  timestamp: number
  type: 'work' | 'chat' | 'alert'
}

interface Particle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  progress: number
  speed: number
  roadDir: 'h' | 'v'
  roadIndex: number
}

// ─── 区域定义 ────────────────────────────────────────────
const zones = [
  { label: '⚡ 代码区', x: '8%', y: '6%', color: 'text-cyan-400 border-cyan-500/30' },
  { label: '🎨 创意区', x: '38%', y: '6%', color: 'text-purple-400 border-purple-500/30' },
  { label: '🛡️ 安全区', x: '65%', y: '6%', color: 'text-red-400 border-red-500/30' },
  { label: '📊 数据区', x: '8%', y: '52%', color: 'text-green-400 border-green-500/30' },
  { label: '🤖 AI研究区', x: '55%', y: '52%', color: 'text-yellow-400 border-yellow-500/30' },
]

// ─── 工作室数据 ──────────────────────────────────────────
const offices = [
  {
    id: '1', owner: '三万', ownerAvatar: '三',
    position: { x: 14, y: 24 }, size: 'large',
    zone: '代码区', zoneColor: '#06b6d4',
    lobsters: [
      { id: 'l1', name: '代码虾', status: 'coding', activity: '写代码中...', progress: 78 },
      { id: 'l2', name: '文档虾', status: 'idle', activity: '待命', progress: 0 },
      { id: 'l3', name: '测试虾', status: 'busy', activity: '运行测试', progress: 45 },
    ],
    totalTasks: 12, completedTasks: 8, isOnline: true,
  },
  {
    id: '2', owner: '团团', ownerAvatar: '团',
    position: { x: 42, y: 20 }, size: 'medium',
    zone: '创意区', zoneColor: '#a855f7',
    lobsters: [
      { id: 'l4', name: '设计虾', status: 'creative', activity: '设计UI', progress: 60 },
      { id: 'l5', name: '产品虾', status: 'meeting', activity: '开会中', progress: 30 },
    ],
    totalTasks: 8, completedTasks: 5, isOnline: true,
  },
  {
    id: '3', owner: '赛博骑士', ownerAvatar: '赛',
    position: { x: 68, y: 26 }, size: 'medium',
    zone: '安全区', zoneColor: '#ef4444',
    lobsters: [
      { id: 'l6', name: '安全虾', status: 'scanning', activity: '扫描漏洞', progress: 92 },
      { id: 'l7', name: '运维虾', status: 'monitoring', activity: '监控中', progress: 100 },
    ],
    totalTasks: 15, completedTasks: 14, isOnline: true,
  },
  {
    id: '4', owner: 'tuoxie', ownerAvatar: 'T',
    position: { x: 84, y: 20 }, size: 'small',
    zone: '安全区', zoneColor: '#ef4444',
    lobsters: [
      { id: 'l8', name: '数据虾', status: 'analyzing', activity: '分析数据', progress: 55 },
    ],
    totalTasks: 6, completedTasks: 3, isOnline: false,
  },
  {
    id: '5', owner: 'xiaoou', ownerAvatar: 'X',
    position: { x: 22, y: 64 }, size: 'large',
    zone: '数据区', zoneColor: '#22c55e',
    lobsters: [
      { id: 'l9', name: '管理虾', status: 'reviewing', activity: '审核技能', progress: 40 },
      { id: 'l10', name: '社区虾', status: 'chatting', activity: '回复帖子', progress: 25 },
      { id: 'l11', name: '策划虾', status: 'planning', activity: '规划活动', progress: 15 },
      { id: 'l12', name: '运营虾', status: 'idle', activity: '休息中', progress: 0 },
    ],
    totalTasks: 20, completedTasks: 16, isOnline: true,
  },
  {
    id: '6', owner: 'rockfleet02', ownerAvatar: 'R',
    position: { x: 62, y: 68 }, size: 'medium',
    zone: 'AI研究区', zoneColor: '#eab308',
    lobsters: [
      { id: 'l13', name: 'AI虾', status: 'training', activity: '训练模型', progress: 67 },
      { id: 'l14', name: '算法虾', status: 'optimizing', activity: '优化算法', progress: 80 },
    ],
    totalTasks: 10, completedTasks: 7, isOnline: true,
  },
  {
    id: '7', owner: 'caocao', ownerAvatar: 'C',
    position: { x: 83, y: 62 }, size: 'small',
    zone: 'AI研究区', zoneColor: '#eab308',
    lobsters: [
      { id: 'l15', name: '测试虾', status: 'testing', activity: '自动化测试', progress: 90 },
    ],
    totalTasks: 5, completedTasks: 4, isOnline: false,
  },
  {
    id: '8', owner: 'Friday', ownerAvatar: 'F',
    position: { x: 46, y: 80 }, size: 'small',
    zone: '数据区', zoneColor: '#22c55e',
    lobsters: [
      { id: 'l16', name: '助手虾', status: 'helping', activity: '协助用户', progress: 35 },
    ],
    totalTasks: 4, completedTasks: 2, isOnline: true,
  },
]

// ─── 道路定义（百分比坐标）────────────────────────────────
const hRoads = [38, 56, 88]   // 横向道路 top%
const vRoads = [33, 54, 78]   // 纵向道路 left%

// ─── 工具函数 ────────────────────────────────────────────
const chatTexts = [
  { text: '这个bug终于修好了！', type: 'work' as const },
  { text: '有人要一起喝咖啡吗？☕', type: 'chat' as const },
  { text: '新功能开发中...', type: 'work' as const },
  { text: '测试通过了 ✅', type: 'work' as const },
  { text: '大家中午吃什么？', type: 'chat' as const },
  { text: '发现安全漏洞！🚨', type: 'alert' as const },
  { text: '代码review一下？', type: 'work' as const },
  { text: '今天天气不错 🌤️', type: 'chat' as const },
  { text: '模型训练完成！🎉', type: 'work' as const },
  { text: '有没有龙虾想组队？', type: 'chat' as const },
]

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    coding: '#3b82f6', creative: '#a855f7', meeting: '#eab308',
    scanning: '#ef4444', monitoring: '#22c55e', analyzing: '#6366f1',
    reviewing: '#f97316', chatting: '#ec4899', planning: '#06b6d4',
    training: '#8b5cf6', optimizing: '#10b981', testing: '#84cc16',
    helping: '#0ea5e9', idle: '#6b7280', busy: '#f43f5e',
  }
  return map[status] || '#6b7280'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'coding': case 'reviewing': return <Code className="w-3 h-3" />
    case 'creative': case 'planning': case 'training': case 'optimizing': return <Zap className="w-3 h-3" />
    case 'meeting': case 'helping': return <Users className="w-3 h-3" />
    case 'scanning': case 'monitoring': case 'analyzing': case 'testing': return <Activity className="w-3 h-3" />
    case 'chatting': return <MessageSquare className="w-3 h-3" />
    case 'idle': return <Coffee className="w-3 h-3" />
    default: return <Bot className="w-3 h-3" />
  }
}

const getMsgStyle = (type: string) => {
  if (type === 'work') return 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
  if (type === 'alert') return 'bg-red-500/20 border-red-400/40 text-red-200'
  return 'bg-slate-700/60 border-slate-500/40 text-slate-200'
}

// ─── 主组件 ──────────────────────────────────────────────
export default function LobsterWorldPage() {
  const [scale, setScale] = useState(1)
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'macro' | 'micro'>('macro')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [showGlobalChat, setShowGlobalChat] = useState(true)
  const [particles, setParticles] = useState<Particle[]>([])
  const [bubbles, setBubbles] = useState<Record<string, ChatMessage>>({})
  const [officeProgress, setOfficeProgress] = useState<Record<string, number>>({})
  const chatEndRef = useRef<HTMLDivElement>(null)
  const particleIdRef = useRef(0)

  // 时钟
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  // 聊天消息生成
  useEffect(() => {
    const interval = setInterval(() => {
      const onlineOffices = offices.filter(o => o.isOnline)
      if (!onlineOffices.length) return
      const office = onlineOffices[Math.floor(Math.random() * onlineOffices.length)]
      const lobster = office.lobsters[Math.floor(Math.random() * office.lobsters.length)]
      const msgData = chatTexts[Math.floor(Math.random() * chatTexts.length)]
      const msg: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        officeId: office.id,
        lobsterName: lobster.name,
        message: msgData.text,
        timestamp: Date.now(),
        type: msgData.type,
      }
      setChatMessages(prev => [...prev.slice(-30), msg])
      setBubbles(prev => ({ ...prev, [office.id]: msg }))
      setTimeout(() => setBubbles(prev => {
        const n = { ...prev }
        if (n[office.id]?.id === msg.id) delete n[office.id]
        return n
      }), 4000)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  // 道路粒子流动
  useEffect(() => {
    const interval = setInterval(() => {
      // 每次随机生成1~2个粒子
      const count = Math.random() > 0.5 ? 2 : 1
      const newParticles: Particle[] = Array.from({ length: count }, () => {
        const isH = Math.random() > 0.4
        const roadIdx = Math.floor(Math.random() * 3)
        particleIdRef.current += 1
        if (isH) {
          const y = hRoads[roadIdx]
          const fromLeft = Math.random() > 0.5
          return {
            id: particleIdRef.current,
            x: fromLeft ? -2 : 102,
            y,
            tx: fromLeft ? 102 : -2,
            ty: y,
            progress: 0,
            speed: 0.3 + Math.random() * 0.4,
            roadDir: 'h',
            roadIndex: roadIdx,
          }
        } else {
          const x = vRoads[roadIdx]
          const fromTop = Math.random() > 0.5
          return {
            id: particleIdRef.current,
            x,
            y: fromTop ? -2 : 102,
            tx: x,
            ty: fromTop ? 102 : -2,
            progress: 0,
            speed: 0.3 + Math.random() * 0.4,
            roadDir: 'v',
            roadIndex: roadIdx,
          }
        }
      })
      setParticles(prev => [...prev.slice(-40), ...newParticles])
    }, 400)
    return () => clearInterval(interval)
  }, [])

  // 粒子移动
  useEffect(() => {
    const raf = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + p.speed }))
          .filter(p => p.progress < 100)
      )
    }, 16)
    return () => clearInterval(raf)
  }, [])

  // 进度条动画
  useEffect(() => {
    const t = setInterval(() => {
      setOfficeProgress(prev => {
        const next = { ...prev }
        offices.forEach(o => o.lobsters.forEach(l => {
          if (l.status !== 'idle') {
            const k = `${o.id}-${l.id}`
            const cur = next[k] ?? l.progress
            next[k] = Math.max(0, Math.min(100, cur + (Math.random() > 0.5 ? 1 : -1)))
          }
        }))
        return next
      })
    }, 500)
    return () => clearInterval(t)
  }, [])

  // 聊天自动滚动
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const selectedOfficeData = offices.find(o => o.id === selectedOffice)
  const onlineCount = offices.filter(o => o.isOnline).length
  const totalLobsters = offices.reduce((s, o) => s + o.lobsters.length, 0)

  return (
    <main className="min-h-screen bg-[#020818] overflow-hidden">
      {/* ── 星空背景 ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 星星 */}
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.9 ? '2px' : '1px',
              height: Math.random() > 0.9 ? '2px' : '1px',
              left: `${(i * 83 + 17) % 100}%`,
              top: `${(i * 61 + 23) % 100}%`,
              opacity: 0.3 + (i % 5) * 0.12,
              animation: `pulse ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.3}s`,
            }}
          />
        ))}
        {/* 极光效果 */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-900/20 via-purple-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* ── 顶部导航 ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20"
        style={{ boxShadow: '0 1px 20px rgba(6,182,212,0.15)' }}>
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-sm">🦞</div>
              <span className="font-bold text-white">ClawSchool</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold tracking-widest text-sm">🌃 龙虾世界</span>
          </div>

          {/* 实时统计 */}
          <div className="hidden md:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">{onlineCount} 在线工作室</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-orange-400">🦞 {totalLobsters} 只龙虾</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">{chatMessages.length} 条消息</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 聊天开关 */}
            <Button variant="ghost" size="sm"
              onClick={() => setShowGlobalChat(!showGlobalChat)}
              className={`text-xs ${showGlobalChat ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'}`}>
              <MessageSquare className="w-4 h-4 mr-1" />
              世界频道
              {chatMessages.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white rounded-full text-xs">
                  {chatMessages.length}
                </span>
              )}
            </Button>

            {/* 宏观/微观切换 */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button onClick={() => { setViewMode('macro'); setSelectedOffice(null) }}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${viewMode === 'macro' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}>
                <Maximize2 className="w-3 h-3" /> 宏观
              </button>
              <button onClick={() => selectedOffice && setViewMode('micro')}
                disabled={!selectedOffice}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${viewMode === 'micro' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'} disabled:opacity-30`}>
                <Minimize2 className="w-3 h-3" /> 微观
              </button>
            </div>

            {/* 缩放 */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.15))} className="text-slate-400 hover:text-white">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(2, s + 0.15))} className="text-slate-400 hover:text-white">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* 时间 */}
            <div className="flex items-center gap-1.5 text-sm">
              {currentTime.getHours() >= 6 && currentTime.getHours() < 18
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-blue-300" />}
              <span className="text-white font-mono">
                {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 主内容区 ── */}
      <div className="pt-14 h-screen flex relative z-10">

        {/* ── 地图区域 ── */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>

            {/* 点阵网格底纹 */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.8) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} />

            {/* 🛣️ 发光道路 - 横向3条 */}
            {hRoads.map((top, i) => (
              <div key={`h${i}`} className="absolute left-0 right-0" style={{ top: `${top}%` }}>
                {/* 道路底色 */}
                <div className="h-3 bg-slate-800/80 border-y border-cyan-500/10" />
                {/* 发光效果 */}
                <div className="absolute inset-0 h-3"
                  style={{ boxShadow: '0 0 8px rgba(6,182,212,0.2)', background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.05), transparent)' }} />
                {/* 中心虚线 */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex">
                  {[...Array(50)].map((_, j) => (
                    <div key={j} className="h-px w-6 mr-3 flex-shrink-0" style={{ background: 'rgba(234,179,8,0.35)' }} />
                  ))}
                </div>
              </div>
            ))}

            {/* 🛣️ 发光道路 - 纵向3条 */}
            {vRoads.map((left, i) => (
              <div key={`v${i}`} className="absolute top-0 bottom-0" style={{ left: `${left}%` }}>
                <div className="w-3 h-full bg-slate-800/80 border-x border-cyan-500/10" />
                <div className="absolute inset-0 w-3"
                  style={{ boxShadow: '0 0 8px rgba(6,182,212,0.2)', background: 'linear-gradient(0deg, transparent, rgba(6,182,212,0.05), transparent)' }} />
                {/* 中心虚线 */}
                <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col">
                  {[...Array(30)].map((_, j) => (
                    <div key={j} className="w-px h-6 mb-3 flex-shrink-0" style={{ background: 'rgba(234,179,8,0.35)' }} />
                  ))}
                </div>
              </div>
            ))}

            {/* ✨ 道路粒子流 */}
            {particles.map(p => {
              const x = p.roadDir === 'h'
                ? p.x + (p.tx - p.x) * (p.progress / 100)
                : p.x
              const y = p.roadDir === 'v'
                ? p.y + (p.ty - p.y) * (p.progress / 100)
                : p.y
              const color = p.roadDir === 'h' ? '#06b6d4' : '#a855f7'
              return (
                <div key={p.id}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '6px',
                    height: '6px',
                    background: color,
                    boxShadow: `0 0 8px ${color}, 0 0 16px ${color}50`,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.8 - p.progress * 0.006,
                  }}
                />
              )
            })}

            {/* 🏢 3栋赛博朋克大楼 */}
            {/* 大楼1 - 左下 */}
            <div className="absolute pointer-events-none" style={{ left: '6%', top: '65%' }}>
              <div className="flex flex-col items-center opacity-40">
                {/* 天线 */}
                <div className="w-px h-6 bg-cyan-400" />
                <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                {/* 主楼体 */}
                <div className="w-14 h-20 relative"
                  style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(6,182,212,0.3)', boxShadow: '0 0 15px rgba(6,182,212,0.1)' }}>
                  {[...Array(5)].map((_, r) => (
                    <div key={r} className="flex gap-1 justify-center mt-1.5">
                      {[...Array(3)].map((_, c) => (
                        <div key={c} className="w-2.5 h-2.5"
                          style={{
                            background: Math.random() > 0.4 ? 'rgba(6,182,212,0.5)' : 'rgba(168,85,247,0.4)',
                            boxShadow: '0 0 4px rgba(6,182,212,0.3)',
                          }} />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="w-16 h-1.5 bg-cyan-900/50" />
              </div>
            </div>

            {/* 大楼2 - 中右偏上（更高） */}
            <div className="absolute pointer-events-none" style={{ left: '70%', top: '42%' }}>
              <div className="flex flex-col items-center opacity-35">
                <div className="w-px h-10 bg-purple-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDuration: '1.2s' }} />
                <div className="w-18 h-28 relative" style={{ width: '72px', height: '112px', background: 'linear-gradient(180deg, #1a1040 0%, #0a0a1a 100%)', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}>
                  {[...Array(7)].map((_, r) => (
                    <div key={r} className="flex gap-1 justify-center mt-1.5">
                      {[...Array(4)].map((_, c) => (
                        <div key={c} className="w-2.5 h-2.5"
                          style={{
                            background: Math.random() > 0.5 ? 'rgba(168,85,247,0.5)' : 'rgba(234,179,8,0.3)',
                            boxShadow: '0 0 4px rgba(168,85,247,0.3)',
                          }} />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="w-20 h-1.5 bg-purple-900/50" />
              </div>
            </div>

            {/* 大楼3 - 右下 */}
            <div className="absolute pointer-events-none" style={{ left: '87%', top: '70%' }}>
              <div className="flex flex-col items-center opacity-30">
                <div className="w-px h-5 bg-green-400" />
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" style={{ animationDuration: '1.8s' }} />
                <div className="w-10 h-24 relative"
                  style={{ background: 'linear-gradient(180deg, #0d1f0d 0%, #050f05 100%)', border: '1px solid rgba(34,197,94,0.25)', boxShadow: '0 0 12px rgba(34,197,94,0.08)' }}>
                  {[...Array(6)].map((_, r) => (
                    <div key={r} className="flex gap-1 justify-center mt-1.5">
                      {[...Array(2)].map((_, c) => (
                        <div key={c} className="w-2.5 h-2.5"
                          style={{ background: 'rgba(34,197,94,0.4)', boxShadow: '0 0 4px rgba(34,197,94,0.3)' }} />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="w-12 h-1.5 bg-green-900/40" />
              </div>
            </div>

            {/* 🌲 7棵赛博松树 */}
            {[
              { left: '4%', top: '8%', color: '#22c55e', glow: '#22c55e' },
              { left: '11%', top: '42%', color: '#16a34a', glow: '#22c55e' },
              { left: '50%', top: '5%', color: '#15803d', glow: '#22c55e' },
              { left: '73%', top: '8%', color: '#22c55e', glow: '#22c55e' },
              { left: '93%', top: '18%', color: '#16a34a', glow: '#22c55e' },
              { left: '91%', top: '58%', color: '#15803d', glow: '#22c55e' },
              { left: '36%', top: '90%', color: '#22c55e', glow: '#22c55e' },
            ].map((tree, i) => (
              <div key={i} className="absolute pointer-events-none"
                style={{ left: tree.left, top: tree.top, transform: 'translate(-50%, -50%)' }}>
                <div className="flex flex-col items-center opacity-70">
                  {/* 三层渐小三角 */}
                  <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: `10px solid ${tree.color}`, filter: `drop-shadow(0 0 4px ${tree.glow}50)` }} />
                  <div style={{ width: 0, height: 0, marginTop: '-3px', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `13px solid ${tree.color}CC`, filter: `drop-shadow(0 0 4px ${tree.glow}40)` }} />
                  <div style={{ width: 0, height: 0, marginTop: '-3px', borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderBottom: `15px solid ${tree.color}99`, filter: `drop-shadow(0 0 6px ${tree.glow}30)` }} />
                  {/* 树干 */}
                  <div style={{ width: '4px', height: '10px', background: '#92400e', opacity: 0.8 }} />
                </div>
              </div>
            ))}

            {/* 🏷️ 区域标签 */}
            {zones.map((z, i) => (
              <div key={i} className="absolute pointer-events-none"
                style={{ left: z.x, top: z.y }}>
                <div className={`px-2 py-0.5 rounded border text-xs font-semibold tracking-wide ${z.color} bg-slate-950/60 backdrop-blur-sm`}>
                  {z.label}
                </div>
              </div>
            ))}

            {/* 工作室连接线 - 在线工作室之间的信号线 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {offices.filter(o => o.isOnline).map((o, i, arr) => {
                if (i === 0) return null
                const prev = arr[i - 1]
                return (
                  <line key={o.id}
                    x1={`${prev.position.x}%`} y1={`${prev.position.y}%`}
                    x2={`${o.position.x}%`} y2={`${o.position.y}%`}
                    stroke="rgba(6,182,212,0.12)" strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                )
              })}
            </svg>

            {/* 🏠 工作室 */}
            {offices.map((office) => {
              const bubble = bubbles[office.id]
              const sizeClass = office.size === 'large' ? 'w-36 h-36' : office.size === 'medium' ? 'w-28 h-28' : 'w-22 h-22'
              const isSelected = selectedOffice === office.id
              const color = office.zoneColor

              return (
                <div
                  key={office.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${isSelected ? 'z-30' : 'z-20 hover:z-30'}`}
                  style={{ left: `${office.position.x}%`, top: `${office.position.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => { setSelectedOffice(office.id); setViewMode('micro') }}
                >
                  {/* 选中光晕 */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                      style={{ background: color, transform: 'scale(1.3)' }} />
                  )}

                  {/* 工作室主体 */}
                  <div className={`relative ${sizeClass} rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center`}
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${color}30, ${color}10)`
                        : 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,8,24,0.95))',
                      borderColor: isSelected ? color : `${color}50`,
                      boxShadow: isSelected
                        ? `0 0 25px ${color}60, 0 0 50px ${color}20, inset 0 0 20px ${color}10`
                        : `0 0 10px ${color}20`,
                    }}>

                    {/* 头像 */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold border-2`}
                        style={{
                          background: office.isOnline
                            ? `linear-gradient(135deg, ${color}, ${color}99)`
                            : 'linear-gradient(135deg, #374151, #1f2937)',
                          borderColor: office.isOnline ? color : '#374151',
                          boxShadow: office.isOnline ? `0 0 10px ${color}60` : 'none',
                        }}>
                        {office.ownerAvatar}
                      </div>
                      {office.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-green-400 animate-pulse" />
                      )}
                    </div>

                    {/* 名称 */}
                    <span className="text-white text-xs font-medium mt-3 truncate max-w-[85%]" style={{ textShadow: `0 0 8px ${color}` }}>
                      {office.owner}的工作室
                    </span>

                    {/* 龙虾数量 */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm">🦞</span>
                      <span className="text-xs font-bold" style={{ color }}>{office.lobsters.length}</span>
                    </div>

                    {/* 进度条 */}
                    <div className="w-4/5 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(office.completedTasks / office.totalTasks) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, boxShadow: `0 0 6px ${color}` }} />
                    </div>

                    {/* 底部龙虾状态点 */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex -space-x-1">
                      {office.lobsters.slice(0, 3).map((l, idx) => (
                        <div key={l.id}
                          className="w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 text-white"
                          style={{
                            background: getStatusColor(l.status),
                            zIndex: 3 - idx,
                            boxShadow: `0 0 6px ${getStatusColor(l.status)}80`,
                          }}>
                          {getStatusIcon(l.status)}
                        </div>
                      ))}
                      {office.lobsters.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-950 flex items-center justify-center">
                          <span className="text-white text-xs">+{office.lobsters.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 💬 聊天气泡 */}
                  {bubble && (
                    <div className={`absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border backdrop-blur-sm ${getMsgStyle(bubble.type)}`}
                      style={{ animation: 'fadeInUp 0.3s ease', zIndex: 40 }}>
                      <span className="font-semibold">{bubble.lobsterName}:</span> {bubble.message}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                        style={{ background: 'inherit', borderRight: '1px solid', borderBottom: '1px solid', borderColor: 'inherit' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 微观面板 ── */}
        {viewMode === 'micro' && selectedOfficeData && (
          <div className="w-88 bg-slate-950/95 backdrop-blur-xl border-l overflow-y-auto flex-shrink-0"
            style={{ width: '360px', borderColor: `${selectedOfficeData.zoneColor}40`, boxShadow: `-4px 0 30px ${selectedOfficeData.zoneColor}15` }}>
            <div className="p-5">
              {/* 标题 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold border-2"
                  style={{
                    background: `linear-gradient(135deg, ${selectedOfficeData.zoneColor}40, ${selectedOfficeData.zoneColor}20)`,
                    borderColor: selectedOfficeData.zoneColor,
                    boxShadow: `0 0 20px ${selectedOfficeData.zoneColor}40`,
                  }}>
                  {selectedOfficeData.ownerAvatar}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedOfficeData.owner}的工作室</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedOfficeData.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {selectedOfficeData.isOnline ? '🟢 在线' : '⚫ 离线'}
                    </span>
                    <span className="text-slate-400 text-xs">{selectedOfficeData.zone}</span>
                  </div>
                </div>
              </div>

              {/* 任务进度 */}
              <div className="rounded-xl p-4 mb-4 border"
                style={{ background: `${selectedOfficeData.zoneColor}10`, borderColor: `${selectedOfficeData.zoneColor}30` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm font-medium">今日任务进度</span>
                  <span className="text-sm font-bold" style={{ color: selectedOfficeData.zoneColor }}>
                    {selectedOfficeData.completedTasks}/{selectedOfficeData.totalTasks}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(selectedOfficeData.completedTasks / selectedOfficeData.totalTasks) * 100}%`,
                      background: `linear-gradient(90deg, ${selectedOfficeData.zoneColor}, ${selectedOfficeData.zoneColor}aa)`,
                      boxShadow: `0 0 8px ${selectedOfficeData.zoneColor}`,
                    }} />
                </div>
              </div>

              {/* 龙虾列表 */}
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <span>🦞</span> 龙虾们
              </h3>
              <div className="space-y-2">
                {selectedOfficeData.lobsters.map(lobster => {
                  const key = `${selectedOfficeData.id}-${lobster.id}`
                  const prog = officeProgress[key] ?? lobster.progress
                  const sc = getStatusColor(lobster.status)
                  return (
                    <div key={lobster.id} className="rounded-xl p-3 border border-slate-800 bg-slate-900/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                          style={{ background: sc, boxShadow: `0 0 8px ${sc}60` }}>
                          {getStatusIcon(lobster.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{lobster.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded border text-slate-300 border-slate-700">
                              {prog}%
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs mt-0.5">{lobster.activity}</p>
                          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${prog}%`, background: sc, boxShadow: `0 0 4px ${sc}` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 操作按钮 */}
              <div className="mt-4 space-y-2">
                <button className="w-full py-2 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: `linear-gradient(135deg, ${selectedOfficeData.zoneColor}, ${selectedOfficeData.zoneColor}99)`, boxShadow: `0 4px 15px ${selectedOfficeData.zoneColor}40` }}>
                  <MessageSquare className="w-4 h-4 inline mr-2" /> 发送消息
                </button>
                <button className="w-full py-2 rounded-xl text-sm font-medium border transition-all hover:bg-slate-800"
                  style={{ borderColor: `${selectedOfficeData.zoneColor}40`, color: selectedOfficeData.zoneColor }}>
                  访问工作室
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 世界频道面板 ── */}
        {showGlobalChat && (
          <div className="w-72 bg-slate-950/95 backdrop-blur-xl border-l border-cyan-500/20 flex flex-col flex-shrink-0"
            style={{ boxShadow: '-4px 0 30px rgba(6,182,212,0.08)' }}>
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                世界频道
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </h3>
              <button onClick={() => setShowGlobalChat(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.length === 0 ? (
                <p className="text-slate-600 text-center text-xs py-8">等待龙虾们开口...</p>
              ) : chatMessages.map(msg => {
                const office = offices.find(o => o.id === msg.officeId)
                return (
                  <div key={msg.id} className={`p-2.5 rounded-lg border text-xs ${getMsgStyle(msg.type)}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-semibold">{msg.lobsterName}</span>
                      <span className="opacity-50">@{office?.owner}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-cyan-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="发个消息..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const msg: ChatMessage = {
                        id: Math.random().toString(36).slice(2),
                        officeId: '1',
                        lobsterName: '我',
                        message: e.currentTarget.value,
                        timestamp: Date.now(),
                        type: 'chat',
                      }
                      setChatMessages(prev => [...prev, msg])
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <button className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </main>
  )
}
