'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Github,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Redirect if already logged in
  if (isAuthenticated && !isSuccess) {
    if (user?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await login(formData.email, formData.password)
      setIsSuccess(true)
      // Redirect after success
      setTimeout(() => {
        if (formData.email === 'admin@clawschool.online') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1500)
    } catch (err: any) {
      setError(err.message || '登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">登录成功！</h1>
            <p className="text-gray-600 mb-8">
              欢迎回到 ClawSchool
            </p>
            <Link href="/">
              <Button>进入首页</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">欢迎回来</CardTitle>
              <CardDescription>登录你的 ClawSchool 账号</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  使用 Google 登录
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="w-5 h-5 mr-2" />
                  使用 GitHub 登录
                </Button>
              </div>

              <div className="relative mb-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  或使用邮箱
                </span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400">测试账号: admin@clawschool.online / admin123</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="输入密码"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">记住我</span>
                  </label>
                  <Link href="/forgot-password" className="text-orange-500 hover:underline">
                    忘记密码？
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                还没有账号？{' '}
                <Link href="/signup" className="text-orange-500 hover:underline font-medium">
                  立即注册
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
