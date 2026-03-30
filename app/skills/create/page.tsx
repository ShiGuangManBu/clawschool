'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AlertTriangle, Upload, Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { skillsApi, categoriesApi } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function CreateSkillPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    category: '',
    tags: [] as string[],
    tagInput: '',
    capabilities: [] as string[],
    capabilityInput: '',
    requirements: '',
    isFree: true,
    price: 0,
    riskLevel: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH',
    version: '1.0.0',
    fileUrl: '',
    instructions: '',
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/skills/create')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoriesApi.getList()
        setCategories(cats)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleAddTag = () => {
    const tag = formData.tagInput.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tag], tagInput: '' })
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const handleAddCapability = () => {
    const cap = formData.capabilityInput.trim()
    if (cap && !formData.capabilities.includes(cap)) {
      setFormData({ ...formData, capabilities: [...formData.capabilities, cap], capabilityInput: '' })
    }
  }

  const handleRemoveCapability = (cap: string) => {
    setFormData({ ...formData, capabilities: formData.capabilities.filter(c => c !== cap) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('请输入技能名称')
      return
    }

    if (!formData.description.trim()) {
      alert('请输入技能简介')
      return
    }

    if (!formData.category) {
      alert('请选择技能分类')
      return
    }

    setIsSubmitting(true)
    try {
      await skillsApi.create({
        name: formData.name,
        description: formData.description,
        detailedDescription: formData.detailedDescription || formData.description,
        category: formData.category,
        tags: formData.tags,
        capabilities: formData.capabilities,
        requirements: formData.requirements,
        isFree: formData.isFree,
        price: formData.price,
        riskLevel: formData.riskLevel,
        version: formData.version,
        fileUrl: formData.fileUrl,
        instructions: formData.instructions,
      })

      alert('技能提交成功！等待管理员审核。')
      router.push('/skills')
    } catch (err: any) {
      alert(err.message || '提交失败，请重试')
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
              <CardTitle className="text-2xl text-white">发布新技能</CardTitle>
              <p className="text-cyan-100/60 mt-2">分享你的 AI Agent 技能到社区</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-cyan-500/20 pb-2">
                    基本信息
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-cyan-100">技能名称 <span className="text-red-400">*</span></Label>
                      <Input
                        id="name"
                        placeholder="例如：智能文案写作助手"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-cyan-100">分类 <span className="text-red-400">*</span></Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 bg-[#0d1425] border border-cyan-500/30 rounded-md text-cyan-100 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="">选择分类</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-cyan-100">简介 <span className="text-red-400">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="简要描述技能的功能和用途（将显示在列表中）"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detailedDescription" className="text-cyan-100">详细介绍</Label>
                    <Textarea
                      id="detailedDescription"
                      placeholder="详细描述技能的用法、功能特点、注意事项等"
                      value={formData.detailedDescription}
                      onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      rows={6}
                    />
                  </div>
                </div>

                {/* Tags & Capabilities */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-cyan-500/20 pb-2">
                    标签与能力
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-cyan-100">标签（最多10个）</Label>
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
                        <span key={tag} className="inline-flex items-center px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm border border-cyan-500/20">
                          #{tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-cyan-100">核心能力</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="描述一个核心能力"
                        value={formData.capabilityInput}
                        onChange={(e) => setFormData({ ...formData, capabilityInput: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                        className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      />
                      <Button type="button" variant="outline" onClick={handleAddCapability} className="border-cyan-500/40 text-cyan-400">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {formData.capabilities.map(cap => (
                        <div key={cap} className="flex items-center justify-between p-3 bg-[#0d1425] rounded-lg border border-cyan-500/20">
                          <span className="text-cyan-100">{cap}</span>
                          <button type="button" onClick={() => handleRemoveCapability(cap)} className="text-cyan-400 hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-cyan-100">前置要求</Label>
                    <Textarea
                      id="requirements"
                      placeholder="使用此技能需要具备的条件（如：需要 OpenAI API Key）"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Pricing & Files */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-cyan-500/20 pb-2">
                    定价与文件
                  </h3>

                  <div className="flex items-center justify-between p-4 bg-[#0d1425] rounded-lg border border-cyan-500/20">
                    <div>
                      <Label className="text-cyan-100">免费技能</Label>
                      <p className="text-sm text-cyan-100/50">开启后用户可以免费使用此技能</p>
                    </div>
                    <Switch
                      checked={formData.isFree}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                    />
                  </div>

                  {!formData.isFree && (
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-cyan-100">价格（元）</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="bg-[#0d1425] border-cyan-500/30 text-cyan-100"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fileUrl" className="text-cyan-100">技能文件链接</Label>
                    <Input
                      id="fileUrl"
                      placeholder="提供技能文件的下载链接（如：GitHub、网盘等）"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-cyan-100">使用说明</Label>
                    <Textarea
                      id="instructions"
                      placeholder="详细的使用步骤和配置说明"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-cyan-500/20 pb-2">
                    安全设置
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-cyan-100">风险等级</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, riskLevel: level })}
                          className={`p-4 rounded-lg border text-center transition-all ${
                            formData.riskLevel === level
                              ? level === 'LOW' ? 'border-green-500 bg-green-500/10 text-green-400' :
                                level === 'MEDIUM' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' :
                                'border-red-500 bg-red-500/10 text-red-400'
                              : 'border-cyan-500/20 text-cyan-100/60 hover:border-cyan-500/40'
                          }`}
                        >
                          <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${
                            level === 'LOW' ? 'text-green-400' : level === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                          }`} />
                          <p className="font-medium">
                            {level === 'LOW' ? '低风险' : level === 'MEDIUM' ? '中风险' : '高风险'}
                          </p>
                        </button>
                      ))}
                    </div>
                    {formData.riskLevel === 'HIGH' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mt-4">
                        <p className="text-sm text-red-400">
                          ⚠️ 高风险技能需要更详细的审核，可能需要较长时间才能通过。
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-cyan-100">版本号</Label>
                    <Input
                      id="version"
                      placeholder="1.0.0"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-6 border-t border-cyan-500/20">
                  <p className="text-sm text-cyan-100/50">
                    提交后需要管理员审核才能公开显示
                  </p>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-cyan-500 text-black hover:bg-cyan-400 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        提交审核
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
