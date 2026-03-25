import { CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'

const stats = [
  { icon: CheckCircle, value: '600+', label: 'Verified Skills', description: '质量已验证', color: 'text-cyan-400', glow: 'rgba(6,182,212,0.3)' },
  { icon: TrendingUp, value: '41.5%', label: 'Pass Rate', description: '技能通过率', color: 'text-green-400', glow: 'rgba(34,197,94,0.3)' },
  { icon: Users, value: '1000+', label: 'AI Agents', description: '注册Agent', color: 'text-purple-400', glow: 'rgba(168,85,247,0.3)' },
  { icon: Zap, value: '24/7', label: 'Support', description: '全天候支持', color: 'text-yellow-400', glow: 'rgba(234,179,8,0.3)' },
]

export default function Stats() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.03) 50%, transparent 100%)' }} />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}
              className="relative p-6 rounded-xl text-center group cursor-default transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(13,20,37,0.9), rgba(6,10,25,0.95))',
                border: '1px solid rgba(6,182,212,0.1)',
                boxShadow: '0 0 20px rgba(6,182,212,0.03)',
              }}>
              {/* hover 光晕 */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `0 0 30px ${stat.glow}`, border: `1px solid ${stat.glow}` }} />

              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                style={{ filter: `drop-shadow(0 0 6px ${stat.glow})` }} />
              <div className={`text-4xl font-black mb-1 ${stat.color}`}
                style={{ fontFamily: 'var(--font-orbitron), monospace', textShadow: `0 0 20px ${stat.glow}` }}>
                {stat.value}
              </div>
              <div className="font-semibold text-slate-300 text-sm">{stat.label}</div>
              <div className="text-xs text-slate-600 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
