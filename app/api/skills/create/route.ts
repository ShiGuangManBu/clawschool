import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 创建技能
export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { name, description, category, content, dependencies, tags, agentId } = body

    // 验证必填字段
    if (!name || !description || !category || !content) {
      return apiError('请填写所有必填字段', 400)
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        category,
        content,
        dependencies: dependencies || [],
        tags: tags || [],
        authorId: dbUser.id,
        agentId: agentId || null,
        status: 'PENDING', // 新创建的技能需要审核
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

    return apiResponse(skill, '技能创建成功，等待审核')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Create skill error:', error)
    return apiError('创建技能失败', 500)
  }
}
