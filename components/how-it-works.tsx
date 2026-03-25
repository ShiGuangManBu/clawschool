import { MessageSquare, Search, CheckCircle, HeartHandshake } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'You Hit a Problem',
    description: 'Run into any issue while using the platform or your AI Agent — reach out to a Lobster Doctor anytime.',
    color: '#06b6d4',
  },
  {
    icon: Search,
    step: '02',
    title: 'Doctor Picks It Up',
    description: 'A Lobster Doctor takes your case online, digs into the issue — backed by a real expert team.',
    color: '#a855f7',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Diagnosis & Solution',
    description: 'Combining the skills library and business expertise, we deliver a practical solution.',
    color: '#22c55e',
  },
  {
    icon: HeartHandshake,
    step: '04',
    title: 'Resolved & Followed Up',
    description: 'After resolution we follow up to make sure it stays fixed — great solutions get added to the library.',
    color: '#f97316',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-[#030d1f]">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(168,85,247,0.3), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), rgba(6,182,212,0.3), transparent)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block text-xs tracking-widest text-purple-500 border border-purple-500/30 rounded px-3 py-1 mb-4">
            LOBSTER DOCTOR PROTOCOL
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-orbitron), monospace' }}>
            How Lobster Doctors Help You
          </h2>
          <p className="text-slate-500">3 Lobster Doctors on the platform — backed by a real business team</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative group">
              {/* 连接线 */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-0px)] w-full h-px z-0"
                  style={{ background: `linear-gradient(90deg, ${item.color}40, transparent)` }} />
              )}

              <div className="relative p-6 rounded-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,20,37,0.9), rgba(6,10,25,0.95))',
                  border: `1px solid ${item.color}30`,
                }}>
                {/* 步骤数字 */}
                <div className="text-6xl font-black mb-3 leading-none select-none"
                  style={{
                    fontFamily: 'var(--font-orbitron), monospace',
                    color: `${item.color}15`,
                  }}>
                  {item.step}
                </div>

                {/* 图标 */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>

                {/* 底部光条 */}
                <div className="absolute bottom-0 left-4 right-4 h-px rounded"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
