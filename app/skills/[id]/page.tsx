'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Star, 
  Download, 
  Clock, 
  User, 
  CheckCircle, 
  Copy, 
  Check,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Heart
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

// Mock data - 实际应从 API 获取
const skillData = {
  id: '1',
  name: 'Agent Memory',
  description: '六层记忆架构系统，支持长期记忆存储与检索，让AI拥有真正的记忆能力。基于先进的向量数据库和语义检索技术，实现高效的记忆存取。',
  longDescription: `
## 功能特性

- **六层记忆架构**: SOUL → MEMORY → P0热 → P1温 → P4档案 → P5冷
- **自动分层**: 根据访问频率自动调整记忆层级
- **语义检索**: 基于向量相似度的智能记忆召回
- **持久化存储**: 支持多种存储后端（本地文件、数据库、云存储）

## 使用场景

1. 长期对话上下文保持
2. 用户偏好学习
3. 知识积累与复用
4. 多会话状态同步

## 技术栈

- TypeScript
- Vector DB (Pinecone/Milvus)
- OpenAI Embeddings
- Prisma ORM
  `,
  author: 'Sanwan',
  authorAvatar: 'S',
  rating: 4.9,
  downloads: 443,
  category: 'Core',
  verified: true,
  version: '2.1.0',
  updatedAt: '2026-03-20',
  license: 'MIT',
  tags: ['记忆', '存储', '核心', '向量检索', '持久化'],
  dependencies: ['@prisma/client', 'openai', 'pinecone-client'],
  code: `import { MemoryManager } from '@clawschool/agent-memory'

// 初始化记忆管理器
const memory = new MemoryManager({
  tiers: 6,  // 六层架构
  vectorDB: 'pinecone',
  embeddingModel: 'text-embedding-3-small'
})

// 存储记忆
await memory.store({
  content: '用户喜欢深色模式',
  context: { userId: 'user_123' },
  importance: 0.8
})

// 检索记忆
const memories = await memory.retrieve({
  query: '用户偏好设置',
  limit: 5,
  minRelevance: 0.7
})`,
  reviews: [
    {
      id: '1',
      user: 'LobsterDev',
      avatar: 'L',
      rating: 5,
      content: '非常好用的记忆系统，六层架构设计很合理，检索速度也很快！',
      date: '2026-03-15',
    },
    {
      id: '2',
      user: 'AIBuilder',
      avatar: 'A',
      rating: 5,
      content: '解决了长期困扰我的上下文保持问题，强烈推荐。',
      date: '2026-03-10',
    },
    {
      id: '3',
      user: 'CodeMaster',
      avatar: 'C',
      rating: 4,
      content: '功能强大，但文档可以更详细一些。',
      date: '2026-03-05',
    },
  ],
}

export default function SkillDetailPage() {
  const params = useParams()
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(skillData.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-900">首页</Link>
            <span>/</span>
            <Link href="/skills" className="hover:text-gray-900">技能市场</Link>
            <span>/</span>
            <span className="text-gray-900">{skillData.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {skillData.verified && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      已验证
                    </Badge>
                  )}
                  <Badge variant="outline">{skillData.category}</Badge>
                  <Badge variant="secondary">v{skillData.version}</Badge>
                </div>
                <h1 className="text-4xl font-bold mb-4">{skillData.name}</h1>
                <p className="text-xl text-gray-600">{skillData.description}</p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="readme" className="mb-8">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="readme">使用说明</TabsTrigger>
                  <TabsTrigger value="code">代码</TabsTrigger>
                  <TabsTrigger value="reviews">评价 ({skillData.reviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="readme" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                          __html: skillData.longDescription
                            .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
                            .replace(/- \*\*(.*?)\*\*: (.*)/g, '<li class="mb-2"><strong>$1</strong>: $2</li>')
                            .replace(/\n/g, '<br/>')
                        }} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">示例代码</CardTitle>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? '已复制' : '复制'}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{skillData.code}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">依赖项</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {skillData.dependencies.map(dep => (
                          <code key={dep} className="bg-gray-100 px-3 py-1 rounded text-sm">
                            {dep}
                          </code>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {skillData.reviews.map(review => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                              {review.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{review.user}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-600">{review.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <Card>
                <CardContent className="p-6">
                  <Button className="w-full mb-4" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    安装技能
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                      收藏
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      分享
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        {skillData.rating}
                      </div>
                      <div className="text-sm text-gray-500">评分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{skillData.downloads}</div>
                      <div className="text-sm text-gray-500">下载量</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">版本</span>
                      <span>{skillData.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">更新于</span>
                      <span>{skillData.updatedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">协议</span>
                      <span>{skillData.license}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">作者</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {skillData.authorAvatar}
                    </div>
                    <div>
                      <div className="font-semibold">{skillData.author}</div>
                      <div className="text-sm text-gray-500">顶级验证官</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    联系作者
                  </Button>
                </CardContent>
              </Card>

              {/* Tags Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillData.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
