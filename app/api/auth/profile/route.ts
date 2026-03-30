import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError, validateEmail } from '@/lib/api-utils'

export async function PUT(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { name, bio, avatar } = body

    const updateData: Record<string, string> = {}
    if (name) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar

    const user = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        status: true,
        createdAt: true,
      },
    })

    return apiResponse(user, '更新成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Update profile error:', error)
    return apiError('更新失败，请稍后重试', 500)
  }
}
