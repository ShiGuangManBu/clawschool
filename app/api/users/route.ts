import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, paginatedResponse, parseQueryParams } from '@/lib/api-utils'

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search } = parseQueryParams(request)

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              skills: { where: { status: 'APPROVED' } },
              agents: { where: { status: 'ACTIVE' } },
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return apiResponse(paginatedResponse(users, total, page, limit), '获取成功')
  } catch (error) {
    console.error('Get users error:', error)
    return apiError('获取用户列表失败', 500)
  }
}
