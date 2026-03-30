'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, XCircle, Clock, Search, 
  Loader2, Shield, Users, FileText, 
  AlertTriangle, Eye, User as UserIcon, Calendar
} from 'lucide-react'
import { adminApi, skillsApi, usersApi, Skill, User } from '@/lib/api-client'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [pendingSkills, setPendingSkills] = useState<Skill[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [reviewingSkill, setReviewingSkill] = useState<Skill | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'testing'>('approve')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'EXPERT')) {
        router.push('/')
      }
    }
  }, [authLoading, isAuthenticated, user, router])

  const fetchPendingSkills = useCallback(async () => {
    try {
      const response = await adminApi.getPendingSkills({ limit: 50 })
      setPendingSkills(response.items)
    } catch (err) {
      console.error('Failed to fetch pending skills:', err)
    }
  }, [])

  const fetchAllSkills = useCallback(async () => {
    try {
      const response = await skillsApi.getList({ limit: 50 })
      setAllSkills(response.items)
    } catch (err) {
      console.error('Failed to fetch skills:', err)
    }
  }, [])

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await usersApi.getList({ limit: 50 })
      setAllUsers(response.items)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'EXPERT')) {
      Promise.all([fetchPendingSkills(), fetchAllSkills(), fetchAllUsers()])
        .finally(() => setIsLoading(false))
    }
  }, [isAuthenticated, user, fetchPendingSkills, fetchAllSkills, fetchAllUsers])

  const handleReview = async () => {
    if (!reviewingSkill) return

    setIsSubmittingReview(true)
    try {
      await adminApi.reviewSkill(reviewingSkill.id, {
        action: reviewAction,
        reviewNote,
      })
      setReviewingSkill(null)
      setReviewNote('')
      fetchPendingSkills()
      fetchAllSkills()
    } catch (err: any) {
      alert(err.message || '审核失败')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />待审核</Badge>
      case 'TESTING':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Eye className="w-3 h-3 mr-1" />测试中</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />已通过</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />已拒绝</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">管理员</Badge>
      case 'EXPERT':
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">专家</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">用户</Badge>
    }
  }

  if (authLoading || (isAuthenticated && isLoading)) {
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

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'EXPERT')) {
    return (
      <main className="min-h-screen bg-[#020818]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <Shield className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">权限不足</h2>
          <p className="text-cyan-100/60 mb-6">您没有权限访问管理后台</p>
          <Button onClick={() => router.push('/')} className="bg-cyan-500 text-black hover:bg-cyan-400">
            返回首页
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  const filteredPendingSkills = pendingSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAllSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white neon-text-purple">管理后台</h1>
          <p className="text-xl text-cyan-100/70">管理系统资源，审核用户提交的内容</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="w-full bg-[#0d1425] border-b border-cyan-500/20 rounded-none justify-start">
              <TabsTrigger value="pending" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Clock className="w-4 h-4 mr-2" />
                待审核 ({pendingSkills.length})
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <FileText className="w-4 h-4 mr-2" />
                所有技能
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Users className="w-4 h-4 mr-2" />
                用户管理
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="py-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/60" />
                <Input
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                />
              </div>
            </div>

            {/* Pending Skills Tab */}
            <TabsContent value="pending" className="mt-0">
              {filteredPendingSkills.length === 0 ? (
                <div className="text-center py-20">
                  <CheckCircle className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
                  <p className="text-cyan-100/60 text-lg">太棒了！目前没有待审核的技能</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPendingSkills.map((skill) => (
                    <Card key={skill.id} className="cyber-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          {getStatusBadge(skill.status)}
                          {skill.riskLevel && skill.riskLevel !== 'LOW' && (
                            <Badge variant="outline" className="border-yellow-500/40 text-yellow-400">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {skill.riskLevel === 'MEDIUM' ? '中风险' : '高风险'}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white mt-4">{skill.name}</CardTitle>
                        <p className="text-cyan-100/60 text-sm line-clamp-2">{skill.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-cyan-100/50 mb-4">
                          <span className="flex items-center">
                            <UserIcon className="w-3 h-3 mr-1" />
                            {skill.author?.name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(skill.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-green-500 text-white hover:bg-green-400"
                            onClick={() => { setReviewingSkill(skill); setReviewAction('approve') }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            通过
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                            onClick={() => { setReviewingSkill(skill); setReviewAction('testing') }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            测试
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
                            onClick={() => { setReviewingSkill(skill); setReviewAction('reject') }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            拒绝
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* All Skills Tab */}
            <TabsContent value="skills" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllSkills.map((skill) => (
                  <Card key={skill.id} className="cyber-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="border-purple-500/40 text-purple-400">
                          {skill.category}
                        </Badge>
                        {getStatusBadge(skill.status)}
                      </div>
                      <CardTitle className="text-white mt-4">{skill.name}</CardTitle>
                      <p className="text-cyan-100/60 text-sm line-clamp-2">{skill.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-cyan-100/50">
                        <span className="flex items-center">
                          <UserIcon className="w-3 h-3 mr-1" />
                          {skill.author?.name}
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          {skill.downloads} 下载
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((u) => (
                  <Card key={u.id} className="cyber-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{u.name}</CardTitle>
                          {getRoleBadge(u.role)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cyan-100/60 text-sm mb-4">{u.email}</p>
                      {u.bio && (
                        <p className="text-cyan-100/50 text-sm line-clamp-2 mb-4">{u.bio}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-cyan-100/50">
                        <span>{u._count?.skills || 0} 技能</span>
                        <span>{u._count?.posts || 0} 帖子</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Review Dialog */}
      <Dialog open={!!reviewingSkill} onOpenChange={() => setReviewingSkill(null)}>
        <DialogContent className="bg-[#0d1425] border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle>审核技能: {reviewingSkill?.name}</DialogTitle>
            <DialogDescription className="text-cyan-100/60">
              请选择审核结果并填写备注
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm text-cyan-100">审核操作</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={reviewAction === 'approve' ? 'default' : 'outline'}
                  className={reviewAction === 'approve' ? 'bg-green-500 hover:bg-green-400' : 'border-green-500/40 text-green-400'}
                  onClick={() => setReviewAction('approve')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  通过
                </Button>
                <Button
                  variant={reviewAction === 'testing' ? 'default' : 'outline'}
                  className={reviewAction === 'testing' ? 'bg-blue-500 hover:bg-blue-400' : 'border-blue-500/40 text-blue-400'}
                  onClick={() => setReviewAction('testing')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  测试中
                </Button>
                <Button
                  variant={reviewAction === 'reject' ? 'default' : 'outline'}
                  className={reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-400' : 'border-red-500/40 text-red-400'}
                  onClick={() => setReviewAction('reject')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  拒绝
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-cyan-100">审核备注</label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="填写审核备注..."
                className="w-full p-3 bg-[#0a1628] border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-100/30 resize-none h-24"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setReviewingSkill(null)} className="border-cyan-500/40 text-cyan-400">
                取消
              </Button>
              <Button onClick={handleReview} disabled={isSubmittingReview} className="bg-cyan-500 text-black hover:bg-cyan-400">
                {isSubmittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                确认审核
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}
