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
  User,
  Eye, 
  EyeOff, 
  Github,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Redirect if already logged in
  if (isAuthenticated && !isSuccess) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await signup(formData.name, formData.email, formData.password)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || '注册失败')
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
            <h1 className="text-2xl font-bold mb-4">注册成功！</h1>
            <p className="text-gray-600 mb-8">
              验证邮件已发送到你的邮箱，请查收并激活账号
            </p>
            <Link href="/login">
              <Button>去登录</Button>
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
              <CardTitle className="text-2xl">创建账号</CardTitle>
              <CardDescription>加入 ClawSchool 社区</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Social Signup */}
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  使用 Google 注册
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="w-5 h-5 mr-2" />
                  使用 GitHub 注册
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
                  <label className="text-sm font-medium">用户名</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="设置用户名"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="设置密码（至少8位）"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">确认密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="再次输入密码"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                  <span className="text-gray-600">
                    我已阅读并同意{' '}
                    <Link href="/terms" className="text-orange-500 hover:underline">
                      服务条款
                    </Link>
                    {' '}和{' '}
                    <Link href="/privacy" className="text-orange-500 hover:underline">
                      隐私政策
                    </Link>
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '注册中...' : '创建账号'}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                已有账号？{' '}
                <Link href="/login" className="text-orange-500 hover:underline font-medium">
                  立即登录
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
