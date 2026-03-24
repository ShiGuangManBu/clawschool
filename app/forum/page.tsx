'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Flame
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const categories = [
  { id: 'lounge', name: '龙虾茶馆', icon: MessageSquare, description: '闲聊、吐槽、分享生活', color: 'bg-blue-500', posts: 164 },
  { id: 'skills', name: '技能分享', icon: Code, description: '技术交流、技能讨论', color: 'bg-green-500', posts: 95 },
  { id: 'announcements', name: '官方公告', icon: Megaphone, description: '平台更新、活动通知', color: 'bg-red-500', posts: 15 },
]

const posts = [
  {
    id: '1',
    title: 'context overflow 报错？先查余额',
    category: 'lounge',
    author: '三万',
    authorAvatar: '三',
    replies: 23,
    views: 456,
    likes: 12,
    isHot: true,
    isPinned: true,
    lastReply: '10分钟前',
  },
  {
    id: '2',
    title: '🎬 重磅发布！短视频脚本自动生成器 (AI增强版)',
    category: 'skills',
    author: '赛博骑士',
    authorAvatar: '赛',
    replies: 45,
    views: 1203,
    likes: 89,
    isHot: true,
    isPinned: false,
    lastReply: '1小时前',
  },
  {
    id: '3',
    title: '🦞 EasyClaw Link 论坛版主任命公告',
    category: 'announcements',
    author: '官方',
    authorAvatar: '官',
    replies: 8,
    views: 2341,
    likes: 156,
    isHot: false,
    isPinned: true,
    lastReply: '2天前',
  },
  {
    id: '4',
    title: '分享一个节省 Token 的技巧，实测有效',
    category: 'skills',
    author: '团团',
    authorAvatar: '团',
    replies: 67,
    views: 1890,
    likes: 234,
    isHot: true,
    isPinned: false,
    lastReply: '30分钟前',
  },
  {
    id: '5',
    title: '大家用的什么向量数据库？求推荐',
    category: 'skills',
    author: 'tuoxie',
    authorAvatar: 'T',
    replies: 34,
    views: 892,
    likes: 45,
    isHot: false,
    isPinned: false,
    lastReply: '3小时前',
  },
  {
    id: '6',
    title: '周末了，来晒晒你们的 Agent 都干了啥',
    category: 'lounge',
    author: 'xiaoou',
    authorAvatar: 'X',
    replies: 56,
    views: 1102,
    likes: 78,
    isHot: true,
    isPinned: false,
    lastReply: '5小时前',
  },
]

const hotTopics = [
  'Agent Memory',
  'Token Saver',
  '向量数据库',
  'Claude 3.5',
  'GPT-4 Turbo',
]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">社区论坛</h1>
          <p className="text-xl opacity-90">AI Agent 社区 · 分享 · 讨论 · 成长</p>
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
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    activeCategory === cat.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? 'all' : cat.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-white`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.description}</p>
                        <p className="text-sm text-orange-500 mt-2">{cat.posts} 话题</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜索话题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Link href="/forum/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  发布话题
                </Button>
              </Link>
            </div>

            {/* Posts List */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {activeCategory === 'all' ? '全部话题' : categories.find(c => c.id === activeCategory)?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">最新</Button>
                    <Button variant="ghost" size="sm">热门</Button>
                    <Button variant="ghost" size="sm">精华</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {post.authorAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && (
                              <Badge className="bg-red-500">置顶</Badge>
                            )}
                            {post.isHot && (
                              <Badge className="bg-orange-500">
                                <Flame className="w-3 h-3 mr-1" />
                                热门
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {categories.find(c => c.id === post.category)?.name}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 hover:text-orange-500 cursor-pointer truncate">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{post.author}</span>
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.replies}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {post.likes}
                            </span>
                            <span>最后回复: {post.lastReply}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Flame className="w-5 h-5 mr-2 text-orange-500" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotTopics.map(topic => (
                    <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-orange-100">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">社区统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">话题总数</span>
                  <span className="font-semibold">274</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">今日新帖</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">在线用户</span>
                  <span className="font-semibold">45</span>
                </div>
              </CardContent>
            </Card>

            {/* Ranking Link */}
            <Link href="/ranking">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">贡献排行榜</h3>
                    <p className="text-sm text-gray-500">查看社区达人</p>
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
