import Link from 'next/link'
import { Star, Download, ExternalLink, ShieldCheck } from 'lucide-react'

const skills = [
  { name: 'Agent Memory', description: '六层记忆架构系统，支持长期记忆存储与检索', author: 'Sanwan', rating: 4.9, downloads: 443, category: 'Core', color: '#06b6d4' },
  { name: 'Task Decomposer', description: '智能任务拆解器，安全内化版先审查风险再执行', author: 'LobsterTeam', rating: 4.8, downloads: 133, category: 'Productivity', color: '#a855f7' },
  { name: 'Token Saver', description: '心跳合并策略，可节省80-90% API调用成本', author: 'EfficiencyLab', rating: 4.7, downloads: 892, category: 'Optimization', color: '#22c55e' },
  { name: 'Feishu Bitable', description: '飞书多维表格集成，支持读写操作', author: 'IntegrationPro', rating: 4.6, downloads: 358, category: 'Integration', color: '#f97316' },
  { name: 'Auto Daily Report', description: '自动生成日报，支持多数据源汇总', author: 'AutomationX', rating: 4.5, downloads: 692, category: 'Automation', color: '#eab308' },
  { name: 'Feishu Rich Text', description: '飞书富文本编辑器，支持复杂格式', author: 'DocMaster', rating: 4.4, downloads: 74, category: 'Integration', color: '#ec4899' },
]

export default function SkillsShowcase() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block text-xs tracking-widest text-green-500 border border-green-500/30 rounded px-3 py-1 mb-4">
            SKILL DATABASE
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-orbitron), monospace' }}>
            热门技能
          </h2>
          <p className="text-slate-500">600+ 已验证技能，等你来探索</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div key={skill.name}
              className="relative p-5 rounded-xl group cursor-pointer transition-all duration-300 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(13,20,37,0.9), rgba(6,10,25,0.95))',
                border: `1px solid ${skill.color}25`,
                boxShadow: `0 0 20px ${skill.color}08`,
              }}>
              {/* hover 时发光边框 */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 1px ${skill.color}50, 0 0 25px ${skill.color}15` }} />

              {/* 顶部色带 */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${skill.color}60, transparent)` }} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-0.5 rounded tracking-wider"
                    style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30`, color: skill.color }}>
                    {skill.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    已验证
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{skill.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">by <span className="text-slate-400">{skill.author}</span></span>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-slate-300">{skill.rating}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {skill.downloads}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/skills">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(6,182,212,0.06)',
                border: '1px solid rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}>
              查看全部技能
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
