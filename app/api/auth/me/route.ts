import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return apiError('未登录', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            skills: true,
            agents: true,
            reviews: true,
          },
        },
      },
    })

    if (!user) {
      return apiError('用户不存在', 404)
    }

    return apiResponse(user, '获取成功')
  } catch (error) {
    console.error('Get current user error:', error)
    return apiError('获取用户信息失败', 500)
  }
}
