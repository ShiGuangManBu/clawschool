import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-context'
import { apiResponse, apiError, paginatedResponse, parseQueryParams } from '@/lib/api-utils'

// 获取待审核技能列表
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['ADMIN', 'EXPERT'])
    const { page, limit, search } = parseQueryParams(request)

    const where: Record<string, unknown> = {
      status: 'PENDING',
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.skill.count({ where }),
    ])

    return apiResponse(paginatedResponse(skills, total, page, limit), '获取成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Get pending skills error:', error)
    return apiError('获取列表失败', 500)
  }
}
