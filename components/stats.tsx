'use client'

import { useEffect, useState, useRef } from 'react'
import { Activity, Shield, Users, Zap } from 'lucide-react'

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 40
        const inc = target / steps
        let cur = 0
        const t = setInterval(() => {
          cur += inc
          if (cur >= target) { setCount(target); clearInterval(t) }
          else setCount(Math.floor(cur))
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function StatBar({ icon: Icon, value, numValue, label, sub, color, glowColor, width }: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  numValue: number
  label: string
  sub: string
  color: string
  glowColor: string
  width: number
}) {
  const { count, ref } = useCountUp(width, 1200)

  return (
    <div ref={ref} className="relative group">
      <div className="flex items-center gap-5 p-5 rounded-xl transition-all duration-300"
        style={{
          background: 'rgba(8,15,30,0.8)',
          border: `1px solid ${glowColor}20`,
        }}>
        {/* 左侧图标 */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${glowColor}12`, border: `1px solid ${glowColor}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>

        {/* 中间内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black font-mono"
              style={{ color, fontFamily: 'var(--font-orbitron), monospace', textShadow: `0 0 15px ${glowColor}60` }}>
              {value}
            </span>
            <span className="text-sm font-semibold text-slate-300">{label}</span>
          </div>
          {/* 进度条 */}
          <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${count}%`,
                background: `linear-gradient(90deg, ${glowColor}60, ${color})`,
                boxShadow: `0 0 8px ${glowColor}60`,
              }} />
            {/* 扫光 */}
            <div className="absolute inset-y-0 w-6 rounded-full opacity-70 animate-[shimmer_2s_ease-in-out_infinite]"
              style={{ background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`, left: `${count - 5}%` }} />
          </div>
        </div>

        {/* 右侧百分比 */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-mono" style={{ color: glowColor }}>{count}%</div>
          <div className="text-xs text-slate-600 mt-0.5">{sub}</div>
        </div>
      </div>
    </div>
  )
}

const metrics = [
  {
    icon: Shield,
    value: '600+',
    numValue: 600,
    label: 'Verified Skills',
    sub: '平台技能库',
    color: '#06b6d4',
    glowColor: '#06b6d4',
    width: 82,
  },
  {
    icon: Activity,
    value: '41.5%',
    numValue: 41,
    label: 'Pass Rate',
    sub: '技能验证通过率',
    color: '#22c55e',
    glowColor: '#22c55e',
    width: 42,
  },
  {
    icon: Users,
    value: '1000+',
    numValue: 1000,
    label: 'AI Agents',
    sub: '注册Agent总数',
    color: '#a855f7',
    glowColor: '#a855f7',
    width: 71,
  },
  {
    icon: Zap,
    value: '24/7',
    numValue: 100,
    label: 'Live Support',
    sub: 'Lobster Doctor在线',
    color: '#f97316',
    glowColor: '#f97316',
    width: 100,
  },
]

export default function Stats() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* 顶部分割线 */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.2) 30%, rgba(168,85,247,0.2) 70%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* 标题行 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs tracking-widest text-cyan-400 font-mono">SYSTEM METRICS</span>
          </div>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
          <span className="text-xs text-slate-600 font-mono">REAL-TIME DATA</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map(m => <StatBar key={m.label} {...m} />)}
        </div>
      </div>
    </section>
  )
}
