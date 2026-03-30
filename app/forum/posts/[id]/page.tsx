'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, MessageSquare, Heart, Share2, Eye, 
  User, Calendar, Loader2, Send, Edit2, Trash2,
  MoreHorizontal, Reply
} from 'lucide-react'
import { postsApi, PostComment } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const postId = params.id as string

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<PostComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const fetchPost = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await postsApi.getById(postId)
      setPost(data)
    } catch (err: any) {
      console.error('Failed to fetch post:', err)
      setError(err.message || '获取帖子详情失败')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  const fetchComments = useCallback(async () => {
    try {
      const data = await postsApi.getComments(postId)
      setComments(data)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [fetchPost, fetchComments])

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!newComment.trim()) {
      alert('请输入评论内容')
      return
    }

    setIsSubmitting(true)
    try {
      await postsApi.createComment(postId, { content: newComment })
      setNewComment('')
      fetchComments()
      fetchPost()
    } catch (err: any) {
      alert(err.message || '评论失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇帖子吗？')) return

    try {
      await postsApi.delete(postId)
      router.push('/forum')
    } catch (err: any) {
      alert(err.message || '删除失败')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return

    try {
      await postsApi.deleteComment(postId, commentId)
      fetchComments()
    } catch (err: any) {
      alert(err.message || '删除失败')
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // 可以调用API更新点赞状态
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.slice(0, 100),
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

  if (error || !post) {
    return (
      <main className="min-h-screen bg-[#020818]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <h2 className="text-2xl font-bold text-white mb-4">帖子不存在</h2>
          <p className="text-cyan-100/60 mb-6">{error || '该帖子可能已被删除'}</p>
          <Button onClick={() => router.push('/forum')} className="bg-cyan-500 text-black hover:bg-cyan-400">
            返回论坛
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  const isOwner = user && (user.id === post.authorId || user.role === 'ADMIN')

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />

      {/* Back Button */}
      <div className="pt-24 pb-4">
        <div className="max-w-4xl mx-auto px-4">
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

      {/* Post Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="cyber-card mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {post.category || 'general'}
                    </Badge>
                    {post.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="border-cyan-500/40 text-cyan-400">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-white mb-4">{post.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-100/60">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author?.name || '匿名用户'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views || 0} 阅读
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {comments.length} 评论
                    </span>
                  </div>
                </div>

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0d1425] border-cyan-500/30">
                      <DropdownMenuItem onClick={() => router.push(`/forum/edit/${postId}`)} className="text-cyan-400 focus:bg-cyan-500/10">
                        <Edit2 className="w-4 h-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-red-400 focus:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="text-cyan-100/90 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-cyan-500/20">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLike}
                  className={`border-cyan-500/40 ${isLiked ? 'text-red-400 border-red-500/40 bg-red-500/10' : 'text-cyan-400 hover:bg-cyan-500/10'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-400' : ''}`} />
                  {post.likes || 0}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                评论 ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Form */}
              {isAuthenticated ? (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="写下你的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 mb-2"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSubmitComment}
                        disabled={isSubmitting}
                        className="bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        发表评论
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-[#0d1425] rounded-lg border border-cyan-500/20">
                  <p className="text-cyan-100/60 mb-4">登录后才能发表评论</p>
                  <Button onClick={() => router.push('/login?redirect=/forum')} className="bg-cyan-500 text-black hover:bg-cyan-400">
                    登录
                  </Button>
                </div>
              )}

              <Separator className="bg-cyan-500/20" />

              {/* Comments List */}
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-cyan-500/30 mx-auto mb-4" />
                  <p className="text-cyan-100/40">暂无评论，成为第一个评论者吧！</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{comment.author?.name || '匿名用户'}</span>
                            <span className="text-cyan-100/40 text-sm">
                              {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          {user && (user.id === comment.authorId || user.role === 'ADMIN') && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-cyan-100/80">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsLiked(!isLiked)}
                            className="text-cyan-100/50 hover:text-red-400 h-7"
                          >
                            <Heart className={`w-3 h-3 mr-1 ${comment.likes > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                            {comment.likes || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
