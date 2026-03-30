import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取帖子评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comments = await prisma.postComment.findMany({
      where: { postId: id },
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
    })

    return apiResponse(comments, '获取成功')
  } catch (error) {
    console.error('Get comments error:', error)
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
    const { content } = body

    if (!content || content.trim().length === 0) {
      return apiError('请输入评论内容', 400)
    }

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post || post.status !== 'PUBLISHED') {
      return apiError('帖子不存在', 404)
    }

    const comment = await prisma.postComment.create({
      data: {
        content,
        authorId: dbUser.id,
        postId: id,
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

    return apiResponse(comment, '评论成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Create comment error:', error)
    return apiError('评论失败', 500)
  }
}
