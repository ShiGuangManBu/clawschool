'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, Download, ArrowLeft, User, Calendar, Eye, 
  MessageSquare, Share2, Heart, Loader2, CheckCircle, AlertTriangle,
  Code, BookOpen, Shield, Zap
} from 'lucide-react'
import { skillsApi, reviewsApi, Review } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SkillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const skillId = params.id as string

  const [skill, setSkill] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // 评论相关
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const fetchSkillDetail = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await skillsApi.getById(skillId)
      setSkill(data)
    } catch (err: any) {
      console.error('Failed to fetch skill:', err)
      setError(err.message || '获取技能详情失败')
    } finally {
      setIsLoading(false)
    }
  }, [skillId])

  const fetchReviews = useCallback(async () => {
    try {
      const data = await reviewsApi.getList(skillId)
      setReviews(data)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    }
  }, [skillId])

  useEffect(() => {
    fetchSkillDetail()
    fetchReviews()
  }, [fetchSkillDetail, fetchReviews])

  const handleDownload = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/skills/${skillId}`)
      return
    }

    setIsDownloading(true)
    try {
      await skillsApi.download(skillId)
      // 刷新数据
      fetchSkillDetail()
    } catch (err: any) {
      alert(err.message || '下载失败')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!newReview.trim()) {
      alert('请输入评论内容')
      return
    }

    setIsSubmittingReview(true)
    try {
      await reviewsApi.create(skillId, {
        content: newReview,
        rating,
      })
      setNewReview('')
      setRating(5)
      fetchReviews()
      fetchSkillDetail()
    } catch (err: any) {
      alert(err.message || '评论失败')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: skill?.name,
        text: skill?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020818]">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !skill) {
    return (
      <main className="min-h-screen bg-[#020818]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <h2 className="text-2xl font-bold text-white mb-4">技能不存在</h2>
          <p className="text-cyan-100/60 mb-6">{error || '该技能可能已被删除'}</p>
          <Button onClick={() => router.push('/skills')} className="bg-cyan-500 text-black hover:bg-cyan-400">
            返回技能市场
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />

      {/* Back Button */}
      <div className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="cyber-card">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {skill.category}
                    </Badge>
                    {skill.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        已验证
                      </Badge>
                    )}
                    {skill.riskLevel && (
                      <Badge variant="outline" className={
                        skill.riskLevel === 'LOW' ? 'border-green-500/40 text-green-400' :
                        skill.riskLevel === 'MEDIUM' ? 'border-yellow-500/40 text-yellow-400' :
                        'border-red-500/40 text-red-400'
                      }>
                        <Shield className="w-3 h-3 mr-1" />
                        {skill.riskLevel === 'LOW' ? '低风险' : skill.riskLevel === 'MEDIUM' ? '中风险' : '高风险'}
                      </Badge>
                    )}
                    {skill.status === 'PENDING_REVIEW' && (
                      <Badge variant="outline" className="border-yellow-500/40 text-yellow-400">
                        待审核
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl text-white mb-4">{skill.name}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-cyan-100/60">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {skill.author?.name || '未知作者'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(skill.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {skill.downloads || 0} 次下载
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-100/80 leading-relaxed">{skill.description}</p>

                  {/* Tags */}
                  {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {skill.tags.map((tag: string) => (
                        <span key={tag} className="text-sm bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs */}
              <Card className="cyber-card">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full bg-[#0d1425] border-b border-cyan-500/20 rounded-none">
                    <TabsTrigger value="details" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                      <Code className="w-4 h-4 mr-2" />
                      详情
                    </TabsTrigger>
                    <TabsTrigger value="usage" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                      <BookOpen className="w-4 h-4 mr-2" />
                      使用方法
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      评价 ({reviews.length})
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="details" className="mt-0">
                      <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-semibold text-white mb-4">技能描述</h3>
                        <div className="text-cyan-100/80 whitespace-pre-wrap">
                          {skill.detailedDescription || skill.description}
                        </div>

                        {skill.capabilities && skill.capabilities.length > 0 && (
                          <>
                            <h3 className="text-xl font-semibold text-white mt-8 mb-4">核心能力</h3>
                            <ul className="space-y-2">
                              {skill.capabilities.map((cap: string, i: number) => (
                                <li key={i} className="flex items-start text-cyan-100/80">
                                  <Zap className="w-4 h-4 text-cyan-400 mr-2 mt-1 flex-shrink-0" />
                                  {cap}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {skill.requirements && (
                          <>
                            <h3 className="text-xl font-semibold text-white mt-8 mb-4">前置要求</h3>
                            <div className="text-cyan-100/80">
                              {skill.requirements}
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="usage" className="mt-0">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">安装步骤</h3>
                          <ol className="space-y-3">
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-sm font-bold mr-3">1</span>
                              <span className="text-cyan-100/80">下载技能文件</span>
                            </li>
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-sm font-bold mr-3">2</span>
                              <span className="text-cyan-100/80">导入到你的 AI Agent 平台</span>
                            </li>
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-sm font-bold mr-3">3</span>
                              <span className="text-cyan-100/80">配置必要的 API 密钥和参数</span>
                            </li>
                            <li className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-sm font-bold mr-3">4</span>
                              <span className="text-cyan-100/80">开始使用！</span>
                            </li>
                          </ol>
                        </div>

                        {skill.version && (
                          <div className="bg-[#0d1425] p-4 rounded-lg border border-cyan-500/20">
                            <p className="text-sm text-cyan-100/60">当前版本</p>
                            <p className="text-cyan-400 font-mono">v{skill.version}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0">
                      {/* Review Form */}
                      {isAuthenticated && (
                        <div className="mb-8 p-4 bg-[#0d1425] rounded-lg border border-cyan-500/20">
                          <h4 className="text-white font-medium mb-4">发表评论</h4>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-cyan-100/60 text-sm">评分：</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star 
                                  className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                                />
                              </button>
                            ))}
                          </div>
                          <Textarea
                            placeholder="分享你的使用体验..."
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            className="bg-[#0a1628] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 mb-4"
                            rows={3}
                          />
                          <Button 
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview}
                            className="bg-cyan-500 text-black hover:bg-cyan-400"
                          >
                            {isSubmittingReview ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            提交评论
                          </Button>
                        </div>
                      )}

                      {/* Reviews List */}
                      {reviews.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="w-12 h-12 text-cyan-500/30 mx-auto mb-4" />
                          <p className="text-cyan-100/40">暂无评论，成为第一个评论者吧！</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b border-cyan-500/10 pb-6 last:border-0">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white font-medium">{review.user?.name || '匿名用户'}</span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                          key={star}
                                          className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-cyan-100/40 text-sm">
                                      {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                                    </span>
                                  </div>
                                  <p className="text-cyan-100/70">{review.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>

            {/* Right - Sidebar */}
            <div className="space-y-6">
              {/* Download Card */}
              <Card className="cyber-card sticky top-24">
                <CardContent className="pt-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-yellow-400 mb-1">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                        <span className="font-bold text-white">{skill.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <p className="text-xs text-cyan-100/50">评分</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-cyan-400 mb-1">
                        <Download className="w-4 h-4 mr-1" />
                        <span className="font-bold text-white">{skill.downloads || 0}</span>
                      </div>
                      <p className="text-xs text-cyan-100/50">下载</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-purple-400 mb-1">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span className="font-bold text-white">{reviews.length}</span>
                      </div>
                      <p className="text-xs text-cyan-100/50">评论</p>
                    </div>
                  </div>

                  {/* Price / Status */}
                  <div className="text-center mb-6">
                    {skill.isFree ? (
                      <div className="text-3xl font-bold text-cyan-400">免费</div>
                    ) : skill.price ? (
                      <div className="text-3xl font-bold text-cyan-400">¥{skill.price}</div>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-cyan-500 text-black hover:bg-cyan-400 py-6 text-lg"
                      onClick={handleDownload}
                      disabled={isDownloading || skill.status === 'PENDING_REVIEW'}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5 mr-2" />
                      )}
                      {skill.status === 'PENDING_REVIEW' ? '审核中' : '免费下载'}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                        收藏
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        分享
                      </Button>
                    </div>
                  </div>

                  {/* Risk Warning */}
                  {skill.riskLevel === 'HIGH' && (
                    <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center text-red-400 mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="font-medium text-sm">风险提示</span>
                      </div>
                      <p className="text-xs text-red-400/70">
                        此技能包含高风险操作，使用前请仔细阅读并了解相关风险。
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Author Card */}
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">关于作者</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {skill.author?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{skill.author?.name || '未知作者'}</p>
                      <p className="text-cyan-100/50 text-sm">{skill.author?.role || 'USER'}</p>
                    </div>
                  </div>
                  {skill.author?.bio && (
                    <p className="text-cyan-100/60 text-sm">{skill.author.bio}</p>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => router.push(`/profile/${skill.author?.id}`)}
                  >
                    查看主页
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
