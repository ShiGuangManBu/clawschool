'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, X, Loader2, Send } from 'lucide-react'
import { postsApi } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const CATEGORIES = [
  { value: 'general', label: '综合讨论' },
  { value: 'skills', label: '技能分享' },
  { value: 'agents', label: '智能体' },
  { value: 'tutorials', label: '教程分享' },
  { value: 'help', label: '求助问答' },
  { value: 'feedback', label: '反馈建议' },
]

export default function CreatePostPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [] as string[],
    tagInput: '',
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/forum/create')
    }
  }, [authLoading, isAuthenticated, router])

  const handleAddTag = () => {
    const tag = formData.tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag], tagInput: '' })
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('请输入帖子标题')
      return
    }

    if (!formData.content.trim()) {
      alert('请输入帖子内容')
      return
    }

    setIsSubmitting(true)
    try {
      await postsApi.create({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })

      alert('帖子发布成功！')
      router.push('/forum')
    } catch (err: any) {
      alert(err.message || '发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
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

      {/* Form */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-2xl text-white">发布新帖子</CardTitle>
              <p className="text-cyan-100/60 mt-2">分享你的想法，与社区交流</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-cyan-100">标题 <span className="text-red-400">*</span></Label>
                  <Input
                    id="title"
                    placeholder="简洁明了地描述你的话题"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-cyan-100">分类</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`p-3 rounded-lg border text-center text-sm transition-all ${
                          formData.category === cat.value
                            ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                            : 'border-cyan-500/20 text-cyan-100/60 hover:border-cyan-500/40'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-cyan-100">内容 <span className="text-red-400">*</span></Label>
                  <Textarea
                    id="content"
                    placeholder="详细描述你想分享的内容..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30 min-h-[300px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-cyan-100">标签（可选，最多5个）</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入标签后按回车添加"
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} className="border-cyan-500/40 text-cyan-400">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20">
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6 border-t border-cyan-500/20">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        发布中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        发布帖子
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
