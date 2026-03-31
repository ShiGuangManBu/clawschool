'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  Code, 
  Megaphone,
  Search,
  ThumbsUp,
  MessageCircle,
  Eye,
  Plus,
  Trophy,
  Flame,
  Loader2
} from 'lucide-react'
import { postsApi as forumApi, Post } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const categories = [
  { id: 'general', name: '龙虾茶馆', icon: MessageSquare, description: '闲聊、吐槽、分享生活', color: 'bg-cyan-500' },
  { id: 'skills', name: '技能分享', icon: Code, description: '技术交流、技能讨论', color: 'bg-purple-500' },
  { id: 'announcements', name: '官方公告', icon: Megaphone, description: '平台更新、活动通知', color: 'bg-yellow-500' },
]

const hotTopics = [
  'Agent Memory',
  'Token Saver',
  '向量数据库',
  'Claude 3.5',
  'GPT-4 Turbo',
]

export default function ForumPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await forumApi.getList({
        search: searchQuery,
        category: activeCategory !== 'all' ? activeCategory : undefined,
        sort: sortBy === 'views' ? 'views' : sortBy === 'likes' ? 'likes' : 'createdAt',
        order: 'desc',
        limit: 50,
      })
      setPosts(response.data?.items || response.items || [])
    } catch (err: any) {
      console.error('Failed to fetch posts:', err)
      setError(err.message || '获取帖子列表失败')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, activeCategory, sortBy])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleNewPost = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/forum')
      return
    }
    router.push('/forum/create')
  }

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId
  }

  const getCategoryColor = (catId: string) => {
    return categories.find(c => c.id === catId)?.color || 'bg-cyan-500'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 30) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white neon-text-cyan">社区论坛</h1>
          <p className="text-xl text-cyan-100/70">AI Agent 社区 · 分享 · 讨论 · 成长</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categories.map((cat) => (
                <Card 
                  key={cat.id} 
                  className={`cyber-card cursor-pointer transition-all hover:shadow-cyan-500/10 ${
                    activeCategory === cat.id ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${cat.color} shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-xl flex items-center justify-center text-white`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">{cat.name}</h3>
                        <p className="text-sm text-cyan-100/50">{cat.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/60" />
                <Input
                  placeholder="搜索话题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 focus:border-cyan-400"
                />
              </div>
              <Button 
                className="bg-cyan-500 text-black hover:bg-cyan-400 border-0"
                onClick={handleNewPost}
              >
                <Plus className="w-4 h-4 mr-2" />
                发布话题
              </Button>
            </div>

            {/* Posts List */}
            <Card className="cyber-card">
              <CardHeader className="border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">
                    {activeCategory === 'all' ? '全部话题' : getCategoryName(activeCategory)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10 ${sortBy === 'createdAt' ? 'bg-cyan-500/10 text-cyan-400' : ''}`}
                      onClick={() => setSortBy('createdAt')}
                    >
                      最新
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10 ${sortBy === 'views' ? 'bg-cyan-500/10 text-cyan-400' : ''}`}
                      onClick={() => setSortBy('views')}
                    >
                      热门
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10 ${sortBy === 'likes' ? 'bg-cyan-500/10 text-cyan-400' : ''}`}
                      onClick={() => setSortBy('likes')}
                    >
                      精华
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={fetchPosts}>重试</Button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-cyan-100/40 text-lg">暂无帖子</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={handleNewPost}
                    >
                      成为第一个发帖的人
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-cyan-500/10">
                    {posts.map((post) => (
                      <div 
                        key={post.id} 
                        className="p-6 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                        onClick={() => router.push(`/forum/posts/${post.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {post.author.avatar || post.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {post.likes > 100 && (
                                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                  <Flame className="w-3 h-3 mr-1" />
                                  热门
                                </Badge>
                              )}
                              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                {getCategoryName(post.category)}
                              </Badge>
                              {post.tags?.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 text-white hover:text-cyan-400 transition-colors truncate">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-cyan-100/50">
                              <span>{post.author.name}</span>
                              <span className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post._count?.comments || 0}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {post.views}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {post.likes}
                              </span>
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Topics */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Flame className="w-5 h-5 mr-2 text-orange-400" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotTopics.map(topic => (
                    <Badge 
                      key={topic} 
                      variant="secondary" 
                      className="cursor-pointer bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                      onClick={() => setSearchQuery(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">社区统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-cyan-100/50">话题总数</span>
                  <span className="font-semibold text-cyan-400">{posts.length || '-'}</span>
                </div>
                <div className="flex justify-between border-t border-cyan-500/10 pt-4">
                  <span className="text-cyan-100/50">今日新帖</span>
                  <span className="font-semibold text-cyan-400">-</span>
                </div>
                <div className="flex justify-between border-t border-cyan-500/10 pt-4">
                  <span className="text-cyan-100/50">在线用户</span>
                  <span className="font-semibold text-cyan-400">-</span>
                </div>
              </CardContent>
            </Card>

            {/* Ranking Link */}
            <Link href="/ranking">
              <Card className="cyber-card cursor-pointer hover:shadow-cyan-500/10 transition-all">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/15 rounded-xl flex items-center justify-center border border-yellow-500/30">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">贡献排行榜</h3>
                    <p className="text-sm text-cyan-100/50">查看社区达人</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
