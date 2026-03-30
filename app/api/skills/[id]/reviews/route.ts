import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取技能评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const reviews = await prisma.review.findMany({
      where: {
        skillId: id,
        status: 'PUBLISHED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiResponse(reviews, '获取成功')
  } catch (error) {
    console.error('Get reviews error:', error)
    return apiError('获取评论失败', 500)
  }
}

// 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { rating, content } = body

    if (!rating || rating < 1 || rating > 5) {
      return apiError('请提供1-5的评分', 400)
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    if (skill.status !== 'APPROVED') {
      return apiError('技能暂不可评论', 403)
    }

    // 不能评价自己的技能
    if (skill.authorId === dbUser.id) {
      return apiError('不能评价自己的技能', 400)
    }

    const review = await prisma.review.create({
      data: {
        rating,
        content,
        userId: dbUser.id,
        skillId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // 更新技能的平均评分
    const avgRating = await prisma.review.aggregate({
      where: { skillId: id, status: 'PUBLISHED' },
      _avg: { rating: true },
      _count: true,
    })

    await prisma.skill.update({
      where: { id },
      data: {
        rating: avgRating._avg.rating || 0,
        reviewCount: avgRating._count,
      },
    })

    return apiResponse(review, '评论成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Create review error:', error)
    return apiError('评论失败', 500)
  }
}
