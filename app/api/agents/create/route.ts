import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 创建智能体
export async function POST(request: NextRequest) {
  try {
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { name, description, prompt, avatar } = body

    if (!name || !prompt) {
      return apiError('请填写名称和提示词', 400)
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        prompt,
        avatar,
        userId: dbUser.id,
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

    return apiResponse(agent, '智能体创建成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Create agent error:', error)
    return apiError('创建智能体失败', 500)
  }
}
