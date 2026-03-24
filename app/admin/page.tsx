'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard,
  Code,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Star,
  AlertCircle
} from 'lucide-react'

// Mock data
const stats = {
  totalUsers: 1240,
  totalSkills: 642,
  pendingSkills: 23,
  totalDownloads: 45280,
  newUsersToday: 15,
  newSkillsToday: 3,
}

const pendingSkills = [
  {
    id: '1',
    name: 'WeChat Bot',
    description: '微信机器人集成，支持自动回复和群管理',
    author: 'WeChatMaster',
    submittedAt: '2026-03-24 14:30',
    category: 'Integration',
  },
  {
    id: '2',
    name: 'PDF Parser Pro',
    description: '高级PDF解析器，支持表格提取和OCR',
    author: 'DocAI',
    submittedAt: '2026-03-24 12:15',
    category: 'Automation',
  },
  {
    id: '3',
    name: 'Stock Tracker',
    description: '股票实时追踪和预警系统',
    author: 'FinanceBot',
    submittedAt: '2026-03-24 10:00',
    category: 'Automation',
  },
]

const recentUsers = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'user', joinedAt: '2026-03-24', status: 'active' },
  { id: '2', name: '李四', email: 'lisi@example.com', role: 'user', joinedAt: '2026-03-24', status: 'active' },
  { id: '3', name: '王五', email: 'wangwu@example.com', role: 'expert', joinedAt: '2026-03-23', status: 'active' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: 'user', joinedAt: '2026-03-23', status: 'banned' },
]

const recentReviews = [
  { id: '1', user: 'UserA', skill: 'Agent Memory', rating: 5, content: '非常好用！', date: '2026-03-24' },
  { id: '2', user: 'UserB', skill: 'Token Saver', rating: 4, content: '节省了不少成本', date: '2026-03-24' },
  { id: '3', user: 'UserC', skill: 'Task Decomposer', rating: 3, content: '还可以改进', date: '2026-03-23' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const sidebarItems = [
    { id: 'overview', label: '总览', icon: LayoutDashboard },
    { id: 'skills', label: '技能审核', icon: Code },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'reviews', label: '评价管理', icon: MessageSquare },
    { id: 'settings', label: '系统设置', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg" />
            <span className="font-bold text-lg">ClawSchool 管理后台</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">A</span>
              </div>
              <span className="text-sm">管理员</span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen sticky top-16">
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === 'skills' && stats.pendingSkills > 0 && (
                  <Badge className="ml-auto bg-red-500">{stats.pendingSkills}</Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">总览</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">总用户数</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                        <p className="text-sm text-green-500 flex items-center mt-1">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +{stats.newUsersToday} 今日
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">技能总数</p>
                        <p className="text-3xl font-bold">{stats.totalSkills}</p>
                        <p className="text-sm text-green-500 flex items-center mt-1">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +{stats.newSkillsToday} 今日
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Code className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">待审核技能</p>
                        <p className="text-3xl font-bold">{stats.pendingSkills}</p>
                        <p className="text-sm text-orange-500 flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          需要处理
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">总下载量</p>
                        <p className="text-3xl font-bold">{stats.totalDownloads.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">平均评分</p>
                        <p className="text-3xl font-bold">4.7</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">通过率</p>
                        <p className="text-3xl font-bold">41.5%</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">最新用户</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUsers.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold">{user.name[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                              {user.status === 'active' ? '正常' : '封禁'}
                            </Badge>
                            <span className="text-sm text-gray-500">{user.joinedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">最新评价</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.user}</span>
                              <span className="text-gray-500">评价了</span>
                              <span className="font-medium">{review.skill}</span>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.content}</p>
                          <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">技能审核</h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">{stats.pendingSkills} 待审核</Badge>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pendingSkills.map((skill) => (
                      <div key={skill.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{skill.name}</h3>
                              <Badge variant="outline">{skill.category}</Badge>
                              <Badge className="bg-orange-500">待审核</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{skill.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>作者: {skill.author}</span>
                              <span>提交时间: {skill.submittedAt}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              查看详情
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              通过
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="w-4 h-4 mr-1" />
                              拒绝
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">用户管理</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="搜索用户..." className="pl-10 w-64" />
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">用户</th>
                        <th className="text-left py-3 px-4">角色</th>
                        <th className="text-left py-3 px-4">状态</th>
                        <th className="text-left py-3 px-4">注册时间</th>
                        <th className="text-left py-3 px-4">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b last:border-0">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="font-bold">{user.name[0]}</span>
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.role === 'expert' ? 'default' : 'secondary'}>
                              {user.role === 'expert' ? '专家' : '用户'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                              {user.status === 'active' ? '正常' : '封禁'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">{user.joinedAt}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">编辑</Button>
                              <Button variant="destructive" size="sm">封禁</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">评价管理</h1>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user}</span>
                              <span className="text-gray-500">评价了</span>
                              <span className="font-medium">{review.skill}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">{review.content}</p>
                            <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">回复</Button>
                            <Button variant="destructive" size="sm">删除</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">系统设置</h1>
              
              <Card>
                <CardHeader>
                  <CardTitle>基础设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">网站名称</label>
                      <Input defaultValue="ClawSchool" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">网站域名</label>
                      <Input defaultValue="clawschool.online" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">网站描述</label>
                    <Input defaultValue="AI Agent Skill Sharing Platform" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>审核设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">自动审核</p>
                      <p className="text-sm text-gray-500">新提交的技能自动通过审核</p>
                    </div>
                    <Button variant="outline">关闭</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">邮件通知</p>
                      <p className="text-sm text-gray-500">有新技能提交时发送邮件通知</p>
                    </div>
                    <Button>开启</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
