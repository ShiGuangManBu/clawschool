'use client'

import Link from 'next/link'
import { Star, Download, ShieldCheck, ExternalLink, Layers } from 'lucide-react'
import { useState } from 'react'

const skills = [
  { name: 'Agent Memory', description: '六层记忆架构系统，支持长期记忆存储与检索', author: 'Sanwan', rating: 4.9, downloads: 443, category: 'Core', color: '#06b6d4' },
  { name: 'Task Decomposer', description: '智能任务拆解器，安全内化版先审查风险再执行', author: 'LobsterTeam', rating: 4.8, downloads: 133, category: 'Productivity', color: '#a855f7' },
  { name: 'Token Saver', description: '心跳合并策略，可节省80-90% API调用成本', author: 'EfficiencyLab', rating: 4.7, downloads: 892, category: 'Optimization', color: '#22c55e' },
  { name: 'Feishu Bitable', description: '飞书多维表格集成，支持读写操作', author: 'IntegrationPro', rating: 4.6, downloads: 358, category: 'Integration', color: '#f97316' },
  { name: 'Auto Daily Report', description: '自动生成日报，支持多数据源汇总', author: 'AutomationX', rating: 4.5, downloads: 692, category: 'Automation', color: '#eab308' },
  { name: 'Feishu Rich Text', description: '飞书富文本编辑器，支持复杂格式', author: 'DocMaster', rating: 4.4, downloads: 74, category: 'Integration', color: '#ec4899' },
]

const categories = ['All', 'Core', 'Productivity', 'Optimization', 'Integration', 'Automation']

const categoryColors: Record<string, string> = {
  All: '#06b6d4',
  Core: '#06b6d4',
  Productivity: '#a855f7',
  Optimization: '#22c55e',
  Integration: '#f97316',
  Automation: '#eab308',
}

export default function SkillsShowcase() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' ? skills : skills.filter(s => s.category === activeTab)

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-block text-xs tracking-widest text-green-500 border border-green-500/30 rounded px-3 py-1 mb-4">
            SKILL DATABASE
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--font-orbitron), monospace' }}>
            热门技能
          </h2>
          <p className="text-slate-500">600+ 已验证技能，等你来探索</p>
        </div>

        {/* 主体：左侧分类 + 右侧卡片 */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧分类面板 */}
          <div className="md:w-44 flex-shrink-0">
            <div className="sticky top-24 rounded-xl overflow-hidden"
              style={{
                background: 'rgba(8,15,30,0.9)',
                border: '1px solid rgba(6,182,212,0.12)',
              }}>
              <div className="px-4 py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Layers className="w-3.5 h-3.5" />
                  CATEGORY
                </div>
              </div>
              <div className="p-2">
                {categories.map(cat => {
                  const isActive = activeTab === cat
                  const color = categoryColors[cat] || '#06b6d4'
                  const count = cat === 'All' ? skills.length : skills.filter(s => s.category === cat).length
                  return (
                    <button key={cat}
                      onClick={() => setActiveTab(cat)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 mb-1"
                      style={{
                        background: isActive ? `${color}15` : 'transparent',
                        border: isActive ? `1px solid ${color}35` : '1px solid transparent',
                        color: isActive ? color : '#64748b',
                      }}>
                      <span className="text-xs font-medium">{cat}</span>
                      <span className="text-xs font-mono"
                        style={{ color: isActive ? color : '#334155' }}>{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* 底部总数 */}
              <div className="px-4 py-3 border-t border-slate-800/60">
                <div className="text-xs text-slate-600 font-mono">
                  Total: <span className="text-cyan-400">600+</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧技能卡片网格 */}
          <div className="flex-1">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((skill) => (
                <div key={skill.name}
                  className="relative p-5 rounded-xl group cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  style={{
                    background: 'rgba(10,18,35,0.9)',
                    border: `1px solid ${skill.color}20`,
                    boxShadow: `0 2px 20px ${skill.color}05`,
                  }}>
                  {/* hover 发光 */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1px ${skill.color}40, 0 0 25px ${skill.color}10` }} />

                  {/* 左侧色条 */}
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ background: `linear-gradient(180deg, transparent, ${skill.color}60, transparent)` }} />

                  <div className="relative pl-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2 py-0.5 rounded tracking-wider"
                        style={{ background: `${skill.color}12`, border: `1px solid ${skill.color}25`, color: skill.color }}>
                        {skill.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        已验证
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{skill.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">by <span className="text-slate-400">{skill.author}</span></span>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-slate-300">{skill.rating}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {skill.downloads}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <Link href="/skills">
                <button
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
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
        </div>
      </div>
    </section>
  )
}
