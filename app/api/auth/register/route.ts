import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { apiResponse, apiError, validateEmail, validatePassword } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // 验证必填字段
    if (!email || !password || !name) {
      return apiError('请填写所有必填字段', 400)
    }

    // 验证邮箱格式
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return apiError(emailValidation.message!, 400)
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return apiError(passwordValidation.message!, 400)
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return apiError('该邮箱已被注册', 400)
    }

    // 创建用户
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    // 生成Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return apiResponse(
      { user, token },
      '注册成功'
    )
  } catch (error) {
    console.error('Register error:', error)
    return apiError('注册失败，请稍后重试', 500)
  }
}
