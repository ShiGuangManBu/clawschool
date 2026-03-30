import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取所有技能分类
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.skill.groupBy({
      by: ['category'],
      where: { status: 'APPROVED' },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    })

    return apiResponse(
      categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
      '获取成功'
    )
  } catch (error) {
    console.error('Get categories error:', error)
    return apiError('获取分类失败', 500)
  }
}
