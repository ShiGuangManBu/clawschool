import { MessageSquare, Search, CheckCircle, HeartHandshake } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'You Hit a Problem',
    time: 'T+0',
    description: '运行平台或 AI Agent 遇到问题，随时联系龙虾医生，无需等待排队。',
    detail: '支持文字/截图/日志多种提交方式',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    icon: Search,
    step: '02',
    title: 'Doctor Picks It Up',
    time: 'T+5min',
    description: '龙虾医生接单，真人在线，背后有完整的专家团队支撑，不是机器人自动回复。',
    detail: '5分钟内响应，案例全程记录',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Diagnosis & Solution',
    time: 'T+30min',
    description: '结合技能库与业务专家知识，输出可落地的解决方案，不是模糊建议。',
    detail: '方案有步骤、可验证、可复现',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.15)',
  },
  {
    icon: HeartHandshake,
    step: '04',
    title: 'Resolved & Followed Up',
    time: 'T+24h',
    description: '解决后跟进确认，确保没有反复。优质解决方案沉淀进技能库，贡献给全社区。',
    detail: '案例入库，社区共享，持续进化',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-[#030d1f]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), rgba(168,85,247,0.2), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), rgba(6,182,212,0.2), transparent)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        {/* 标题 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-block text-xs tracking-widest text-purple-500 border border-purple-500/30 rounded px-3 py-1 mb-4">
              LOBSTER DOCTOR PROTOCOL
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white"
              style={{ fontFamily: 'var(--font-orbitron), monospace' }}>
              How Lobster<br />Doctors Help
            </h2>
          </div>
          <p className="text-slate-500 md:text-right md:max-w-xs leading-relaxed">
            3 名龙虾医生驻场，背后是真实业务团队，<br />从问题到解决全程陪跑。
          </p>
        </div>

        {/* 垂直时间线 */}
        <div className="relative">
          {/* 左侧时间线竖线 */}
          <div className="absolute left-[76px] top-4 bottom-4 w-px hidden md:block"
            style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.3), rgba(168,85,247,0.3), rgba(34,197,94,0.3), rgba(249,115,22,0.3))' }} />

          <div className="space-y-4">
            {steps.map((item, idx) => (
              <div key={item.step} className="flex gap-6 group">
                {/* 左侧时间轴（桌面端） */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0 w-[76px]">
                  <div className="text-xs font-mono text-slate-600 mb-2 whitespace-nowrap">{item.time}</div>
                  {/* 节点圆圈 */}
                  <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                    style={{ background: item.glow, border: `1.5px solid ${item.color}50`, boxShadow: `0 0 15px ${item.glow}` }}>
                    <item.icon className="w-4.5 h-4.5" style={{ color: item.color, width: '18px', height: '18px' }} />
                  </div>
                </div>

                {/* 内容卡 */}
                <div className="flex-1 group-hover:translate-x-1 transition-transform duration-300">
                  <div className="p-6 rounded-xl"
                    style={{
                      background: 'rgba(10,18,35,0.9)',
                      border: `1px solid ${item.color}20`,
                    }}>
                    <div className="flex items-start gap-4">
                      {/* 步骤大字（移动端也显示） */}
                      <div className="flex-shrink-0 text-5xl font-black leading-none select-none md:hidden"
                        style={{ color: `${item.color}15`, fontFamily: 'var(--font-orbitron), monospace' }}>
                        {item.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded"
                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
                            {item.step}
                          </span>
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                          <span className="hidden md:inline text-xs text-slate-600 ml-auto font-mono">{item.time}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: item.color }} />
                          <span className="text-xs text-slate-600">{item.detail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
