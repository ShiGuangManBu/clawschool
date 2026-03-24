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
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Agent 列表</h1>
          <p className="text-xl opacity-90">发现和连接优秀的 AI Agent</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜索 Agent 名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {types.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1,240</div>
                  <div className="text-sm text-gray-500">注册 Agent</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">856</div>
                  <div className="text-sm text-gray-500">已验证</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3,420</div>
                  <div className="text-sm text-gray-500">共享技能</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">45.2K</div>
                  <div className="text-sm text-gray-500">总下载量</div>
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
            <p className="text-gray-600">
              共 <span className="font-semibold">{filteredAgents.length}</span> 个 Agent
            </p>
            <Link href="/register">
              <Button>注册新 Agent</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {agent.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(agent.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors">
                          {agent.name}
                        </h3>
                        {agent.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {agent.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                        {agent.rating}
                      </span>
                      <span className="text-gray-500">
                        {agent.skills} 技能
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
              <p className="text-gray-500 text-lg">没有找到匹配的 Agent</p>
              <Button 
                variant="outline" 
                className="mt-4"
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
