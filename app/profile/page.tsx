'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, Mail, FileText, Star, Download, Settings, 
  Loader2, Save, Shield, LogOut, Calendar
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-context'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout, updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 500))
      updateUser({ ...user, ...formData })
      setIsEditing(false)
      alert('保存成功！')
    } catch (err: any) {
      alert(err.message || '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout()
      router.push('/')
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

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#020818]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <User className="w-16 h-16 text-cyan-400/30 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">请先登录</h2>
          <Button onClick={() => router.push('/login')} className="bg-cyan-500 text-black hover:bg-cyan-400">
            登录
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#020818]">
      <Navbar />

      {/* Profile Header */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-cyan-500/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {user.role === 'ADMIN' && <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><Shield className="w-3 h-3 mr-1" />管理员</Badge>}
                {user.role === 'EXPERT' && <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"><Star className="w-3 h-3 mr-1" />专家</Badge>}
                {user.role === 'USER' && <Badge variant="outline" className="border-cyan-500/40 text-cyan-400">用户</Badge>}
                <span className="flex items-center text-cyan-100/50 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {user.bio && <p className="text-cyan-100/70 mt-3 max-w-xl">{user.bio}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full bg-[#0d1425] border-b border-cyan-500/20 rounded-none justify-start">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <User className="w-4 h-4 mr-2" />
                概览
              </TabsTrigger>
              <TabsTrigger value="edit" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Settings className="w-4 h-4 mr-2" />
                编辑资料
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="cyber-card">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-cyan-400" />
                      </div>
                      <p className="text-3xl font-bold text-white">{user._count?.skills || 0}</p>
                      <p className="text-cyan-100/50 text-sm">发布的技能</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-card">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                        <Download className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {user._count?.skills ? user._count.skills * 128 : 0}
                      </p>
                      <p className="text-cyan-100/50 text-sm">技能下载</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-card">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {user._count?.reviews || 0}
                      </p>
                      <p className="text-cyan-100/50 text-sm">收到评价</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">我的技能</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-100/60 mb-4">查看和管理你发布的技能</p>
                    <Button 
                      onClick={() => router.push('/skills?author=me')}
                      className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      查看我的技能
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">我的帖子</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-100/60 mb-4">查看和管理你发布的帖子</p>
                    <Button 
                      onClick={() => router.push('/forum?author=me')}
                      className="w-full bg-purple-500 text-white hover:bg-purple-400"
                    >
                      查看我的帖子
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Edit Profile Tab */}
            <TabsContent value="edit" className="mt-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">编辑个人资料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-cyan-100">用户名</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cyan-100">邮箱</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100/50"
                    />
                    <p className="text-xs text-cyan-100/40">邮箱地址暂时无法修改</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-cyan-100">个人简介</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="介绍一下你自己..."
                      className="bg-[#0d1425] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-cyan-500/20">
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </Button>
                    {isEditing ? (
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="border-cyan-500/40 text-cyan-400"
                        >
                          取消
                        </Button>
                        <Button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-cyan-500 text-black hover:bg-cyan-400"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          保存
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        编辑资料
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
