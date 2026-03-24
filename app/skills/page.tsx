'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, Download, Search, Filter, ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const categories = ['全部', 'Core', 'Productivity', 'Integration', 'Automation', 'Optimization', 'Security']

const allSkills = [
  {
    id: '1',
    name: 'Agent Memory',
    description: '六层记忆架构系统，支持长期记忆存储与检索，让AI拥有真正的记忆能力',
    author: 'Sanwan',
    rating: 4.9,
    downloads: 443,
    category: 'Core',
    verified: true,
    tags: ['记忆', '存储', '核心'],
  },
  {
    id: '2',
    name: 'Task Decomposer',
    description: '智能任务拆解器，安全内化版先审查风险再执行，复杂任务轻松分解',
    author: 'LobsterTeam',
    rating: 4.8,
    downloads: 133,
    category: 'Productivity',
    verified: true,
    tags: ['任务', '拆解', '规划'],
  },
  {
    id: '3',
    name: 'Token Saver',
    description: '心跳合并策略，可节省80-90% API调用成本，大幅降低运营开支',
    author: 'EfficiencyLab',
    rating: 4.7,
    downloads: 892,
    category: 'Optimization',
    verified: true,
    tags: ['优化', '成本', 'Token'],
  },
  {
    id: '4',
    name: 'Feishu Bitable',
    description: '飞书多维表格集成，支持读写操作，无缝对接企业协作平台',
    author: 'IntegrationPro',
    rating: 4.6,
    downloads: 358,
    category: 'Integration',
    verified: true,
    tags: ['飞书', '表格', '集成'],
  },
  {
    id: '5',
    name: 'Auto Daily Report',
    description: '自动生成日报，支持多数据源汇总，让汇报工作自动化',
    author: 'AutomationX',
    rating: 4.5,
    downloads: 692,
    category: 'Automation',
    verified: true,
    tags: ['日报', '自动化', '报告'],
  },
  {
    id: '6',
    name: 'Feishu Rich Text',
    description: '飞书富文本编辑器，支持复杂格式，专业文档轻松创建',
    author: 'DocMaster',
    rating: 4.4,
    downloads: 74,
    category: 'Integration',
    verified: true,
    tags: ['飞书', '文档', '富文本'],
  },
  {
    id: '7',
    name: 'GitHub AI Trends',
    description: '自动追踪GitHub热门AI项目，生成趋势报告和排行榜',
    author: 'TrendWatcher',
    rating: 4.6,
    downloads: 256,
    category: 'Automation',
    verified: true,
    tags: ['GitHub', '趋势', 'AI'],
  },
  {
    id: '8',
    name: 'Security Scanner',
    description: '代码安全扫描工具，自动检测潜在风险和漏洞',
    author: 'SecurityFirst',
    rating: 4.8,
    downloads: 189,
    category: 'Security',
    verified: true,
    tags: ['安全', '扫描', '代码'],
  },
  {
    id: '9',
    name: 'Email Assistant',
    description: '智能邮件处理助手，自动分类、回复建议和日程提醒',
    author: 'MailMaster',
    rating: 4.3,
    downloads: 421,
    category: 'Productivity',
    verified: true,
    tags: ['邮件', '效率', '助手'],
  },
]

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('downloads')

  const filteredSkills = allSkills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === '全部' || skill.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">技能市场</h1>
          <p className="text-xl opacity-90">发现、分享、使用高质量的 AI Agent 技能</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜索技能名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="downloads">下载量</option>
                <option value="rating">评分</option>
                <option value="name">名称</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              共 <span className="font-semibold">{filteredSkills.length}</span> 个技能
            </p>
            <Button>提交新技能</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {skill.verified && (
                        <Badge className="bg-green-500">已验证</Badge>
                      )}
                      <Badge variant="outline">{skill.category}</Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-4 group-hover:text-orange-500 transition-colors cursor-pointer">
                    {skill.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <span>by {skill.author}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                        {skill.rating}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {skill.downloads}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">没有找到匹配的技能</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {setSearchQuery(''); setSelectedCategory('全部')}}
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
