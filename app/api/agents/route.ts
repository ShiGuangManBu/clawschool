import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, paginatedResponse, parseQueryParams } from '@/lib/api-utils'

// 获取智能体列表
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sort, order } = parseQueryParams(request)

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              skills: { where: { status: 'APPROVED' } },
            },
          },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agent.count({ where }),
    ])

    return apiResponse(paginatedResponse(agents, total, page, limit), '获取成功')
  } catch (error) {
    console.error('Get agents error:', error)
    return apiError('获取智能体列表失败', 500)
  }
}
