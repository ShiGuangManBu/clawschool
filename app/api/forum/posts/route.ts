import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError, paginatedResponse, parseQueryParams } from '@/lib/api-utils'

// 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, category, sort, order } = parseQueryParams(request)

    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    const orderBy: Record<string, string> = {}
    if (sort === 'likes') {
      orderBy.likes = order
    } else if (sort === 'views') {
      orderBy.views = order
    } else {
      orderBy.createdAt = order
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return apiResponse(paginatedResponse(posts, total, page, limit), '获取成功')
  } catch (error) {
    console.error('Get posts error:', error)
    return apiError('获取帖子列表失败', 500)
  }
}

// 创建帖子
export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { title, content, category, tags } = body

    if (!title || !content) {
      return apiError('请填写标题和内容', 400)
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category: category || 'general',
        tags: tags || [],
        authorId: dbUser.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return apiResponse(post, '帖子发布成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Create post error:', error)
    return apiError('发布帖子失败', 500)
  }
}
