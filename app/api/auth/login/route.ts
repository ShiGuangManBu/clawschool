import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { apiResponse, apiError, validateEmail } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 验证必填字段
    if (!email || !password) {
      return apiError('请填写邮箱和密码', 400)
    }

    // 验证邮箱格式
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return apiError(emailValidation.message!, 400)
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return apiError('邮箱或密码错误', 401)
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return apiError('账号已被禁用，请联系管理员', 403)
    }

    // 验证密码
    if (!user.password) {
      return apiError('请使用第三方登录', 401)
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return apiError('邮箱或密码错误', 401)
    }

    // 生成Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return apiResponse(
      { user: userWithoutPassword, token },
      '登录成功'
    )
  } catch (error) {
    console.error('Login error:', error)
    return apiError('登录失败，请稍后重试', 500)
  }
}
