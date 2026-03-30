'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, Download, Search, Filter, ChevronDown, Loader2, Eye } from 'lucide-react'
import { skillsApi, Skill } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SkillsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('downloads')
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>(['全部'])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSkills = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await skillsApi.getList({
        search: searchQuery,
        category: selectedCategory !== '全部' ? selectedCategory : undefined,
        sort: sortBy === 'name' ? 'name' : sortBy === 'rating' ? 'rating' : 'downloads',
        order: 'desc',
        limit: 50,
      })
      setSkills(response.items)
    } catch (err: any) {
      console.error('Failed to fetch skills:', err)
      setError(err.message || '获取技能列表失败')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, sortBy])

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await skillsApi.getCategories()
      setCategories(['全部', ...cats.map(c => c.name)])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const handleSkillClick = (skillId: string) => {
    router.push(`/skills/${skillId}`)
  }

  const handleSubmitSkill = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/skills')
      return
    }
    router.push('/skills/create')
  }

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white neon-text-cyan">技能市场</h1>
          <p className="text-xl text-cyan-100/70">发现、分享、使用高质量的 AI Agent 技能</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-cyan-500/20 bg-[#020818]/95 backdrop-blur sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/60" />
              <Input
                placeholder="搜索技能名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 focus:border-cyan-400"
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
                  className={selectedCategory === cat 
                    ? 'bg-cyan-500 text-black hover:bg-cyan-400 border-0' 
                    : 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 bg-transparent'}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-500/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0d1425] border border-cyan-500/30 text-cyan-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-400"
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
            <p className="text-cyan-100/60">
              共 <span className="font-semibold text-cyan-400">{skills.length}</span> 个技能
            </p>
            <Button 
              className="bg-cyan-500 text-black hover:bg-cyan-400 border-0"
              onClick={handleSubmitSkill}
            >
              提交新技能
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchSkills}>重试</Button>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cyan-100/40 text-lg">没有找到匹配的技能</p>
              <Button 
                variant="outline" 
                className="mt-4 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => {setSearchQuery(''); setSelectedCategory('全部')}}
              >
                清除筛选
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <Card 
                  key={skill.id} 
                  className="cyber-card hover:shadow-cyan-500/15 transition-all group cursor-pointer"
                  onClick={() => handleSkillClick(skill.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        {skill.verified && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">已验证</Badge>
                        )}
                        <Badge variant="outline" className="border-purple-500/40 text-purple-400">{skill.category}</Badge>
                      </div>
                      {skill.riskLevel && (
                        <Badge 
                          variant="outline" 
                          className={skill.riskLevel === 'LOW' ? 'border-green-500/40 text-green-400' : 
                            skill.riskLevel === 'MEDIUM' ? 'border-yellow-500/40 text-yellow-400' : 
                            'border-red-500/40 text-red-400'}
                        >
                          {skill.riskLevel === 'LOW' ? '低风险' : skill.riskLevel === 'MEDIUM' ? '中风险' : '高风险'}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-white group-hover:text-cyan-400 transition-colors">
                      {skill.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-100/60 mb-4 line-clamp-2">{skill.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skill.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-cyan-100/50 pt-4 border-t border-cyan-500/20">
                      <span>by {skill.author.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                          <span className="text-yellow-400">{skill.rating.toFixed(1)}</span>
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
