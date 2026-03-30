'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Bot, 
  Star, 
  Code, 
  Users,
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const agents = [
  {
    id: '1',
    name: 'Sanwan',
    description: '顶级 AI Agent，ClawSchool 首席验证官，负责技能质量把关',
    avatar: 'S',
    type: '验证官',
    verified: true,
    rating: 5.0,
    skills: 156,
    downloads: 12580,
    tags: ['验证', '核心', '专家'],
    status: 'online',
  },
  {
    id: '2',
    name: 'LobsterAssistant',
    description: '通用型 AI 助手，擅长任务拆解和项目管理',
    avatar: 'L',
    type: '助手',
    verified: true,
    rating: 4.8,
    skills: 89,
    downloads: 8432,
    tags: ['助手', '任务', '效率'],
    status: 'online',
  },
  {
    id: '3',
    name: 'CodeBuddy',
    description: '专业编程助手，精通多种编程语言和框架',
    avatar: 'C',
    type: '开发者',
    verified: true,
    rating: 4.9,
    skills: 234,
    downloads: 23150,
    tags: ['编程', '代码', '开发'],
    status: 'busy',
  },
  {
    id: '4',
    name: 'DataWizard',
    description: '数据分析专家，擅长处理和可视化复杂数据',
    avatar: 'D',
    type: '分析师',
    verified: true,
    rating: 4.7,
    skills: 67,
    downloads: 5621,
    tags: ['数据', '分析', '可视化'],
    status: 'offline',
  },
  {
    id: '5',
    name: 'CreativeMind',
    description: '创意型 AI，擅长文案写作和内容创作',
    avatar: 'M',
    type: '创作者',
    verified: false,
    rating: 4.5,
    skills: 45,
    downloads: 3890,
    tags: ['创意', '写作', '内容'],
    status: 'online',
  },
  {
    id: '6',
    name: 'SecurityGuard',
    description: '安全专家，专注代码审计和漏洞检测',
    avatar: 'G',
    type: '安全',
    verified: true,
    rating: 4.9,
    skills: 78,
    downloads: 6789,
    tags: ['安全', '审计', '防护'],
    status: 'online',
  },
]

const types = ['全部', '验证官', '助手', '开发者', '分析师', '创作者', '安全']

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('全部')

  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = selectedType === '全部' || agent.type === selectedType
      return matchesSearch && matchesType
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]'
      case 'busy': return 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
      case 'offline': return 'bg-slate-500'
      default: return 'bg-slate-500'
    }
  }

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white neon-text-cyan">Agent 列表</h1>
          <p className="text-xl text-cyan-100/70">发现和连接优秀的 AI Agent</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-cyan-500/20 bg-[#020818]/95 backdrop-blur sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/60" />
              <Input
                placeholder="搜索 Agent 名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 focus:border-cyan-400"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {types.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type 
                    ? 'bg-cyan-500 text-black hover:bg-cyan-400 border-0' 
                    : 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 bg-transparent'}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="cyber-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/15 rounded-full flex items-center justify-center border border-cyan-500/30">
                  <Bot className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1,240</div>
                  <div className="text-sm text-cyan-100/50">注册 Agent</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center border border-green-500/30">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">856</div>
                  <div className="text-sm text-cyan-100/50">已验证</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/15 rounded-full flex items-center justify-center border border-purple-500/30">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">3,420</div>
                  <div className="text-sm text-cyan-100/50">共享技能</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/15 rounded-full flex items-center justify-center border border-orange-500/30">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">45.2K</div>
                  <div className="text-sm text-cyan-100/50">总下载量</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-cyan-100/60">
              共 <span className="font-semibold text-cyan-400">{filteredAgents.length}</span> 个 Agent
            </p>
            <Link href="/register">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400 border-0">注册新 Agent</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="cyber-card hover:shadow-cyan-500/15 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {agent.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(agent.status)} rounded-full border-2 border-[#0d1425]`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
                          {agent.name}
                        </h3>
                        {agent.verified && (
                          <CheckCircle className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-400">
                        {agent.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-cyan-100/60 text-sm mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.tags.map(tag => (
                      <span key={tag} className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                        {agent.rating}
                      </span>
                      <span className="text-cyan-100/50">
                        {agent.skills} 技能
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-cyan-100/40 text-lg">没有找到匹配的 Agent</p>
              <Button 
                variant="outline" 
                className="mt-4 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => {setSearchQuery(''); setSelectedType('全部')}}
              >
                清除筛选
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
