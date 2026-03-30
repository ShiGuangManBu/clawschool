import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError, paginatedResponse, parseQueryParams } from '@/lib/api-utils'

// 获取技能列表
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, category, sort, order } = parseQueryParams(request)

    const where: Record<string, unknown> = {
      status: 'APPROVED', // 只显示已审核通过的技能
    }

    // 搜索条件
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 分类筛选
    if (category) {
      where.category = category
    }

    // 构建排序
    const orderBy: Record<string, string> = {}
    const validSorts = ['createdAt', 'downloads', 'rating', 'reviewCount', 'name']
    if (validSorts.includes(sort)) {
      orderBy[sort] = order || 'desc'
    } else {
      orderBy.createdAt = 'desc'
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reviews: { where: { status: 'PUBLISHED' } },
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.skill.count({ where }),
    ])

    return apiResponse(paginatedResponse(skills, total, page, limit), '获取成功')
  } catch (error) {
    console.error('Get skills error:', error)
    return apiError('获取技能列表失败', 500)
  }
}
