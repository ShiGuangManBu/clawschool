import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取帖子详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                posts: { where: { status: 'PUBLISHED' } },
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!post) {
      return apiError('帖子不存在', 404)
    }

    if (post.status !== 'PUBLISHED') {
      return apiError('帖子不存在', 404)
    }

    // 增加浏览量
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return apiResponse(post, '获取成功')
  } catch (error) {
    console.error('Get post error:', error)
    return apiError('获取帖子详情失败', 500)
  }
}

// 更新帖子
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)
    const body = await request.json()

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return apiError('帖子不存在', 404)
    }

    if (post.authorId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    const { title, content, category, tags } = body
    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
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

    return apiResponse(updatedPost, '更新成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Update post error:', error)
    return apiError('更新失败', 500)
  }
}

// 删除帖子
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      return apiError('帖子不存在', 404)
    }

    if (post.authorId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    await prisma.post.delete({
      where: { id },
    })

    return apiResponse(null, '删除成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Delete post error:', error)
    return apiError('删除失败', 500)
  }
}
