import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取智能体详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: {
                agents: { where: { status: 'ACTIVE' } },
                skills: { where: { status: 'APPROVED' } },
              },
            },
          },
        },
        skills: {
          where: { status: 'APPROVED' },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            downloads: true,
            rating: true,
          },
          take: 5,
        },
      },
    })

    if (!agent) {
      return apiError('智能体不存在', 404)
    }

    return apiResponse(agent, '获取成功')
  } catch (error) {
    console.error('Get agent error:', error)
    return apiError('获取智能体详情失败', 500)
  }
}

// 更新智能体
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)
    const body = await request.json()

    const agent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!agent) {
      return apiError('智能体不存在', 404)
    }

    if (agent.userId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    const { name, description, prompt, avatar, status } = body
    const updateData: Record<string, unknown> = {}
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (prompt) updateData.prompt = prompt
    if (avatar !== undefined) updateData.avatar = avatar
    if (dbUser.role === 'ADMIN' && status) updateData.status = status

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: updateData,
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

    return apiResponse(updatedAgent, '更新成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Update agent error:', error)
    return apiError('更新失败', 500)
  }
}

// 删除智能体
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)

    const agent = await prisma.agent.findUnique({
      where: { id },
    })

    if (!agent) {
      return apiError('智能体不存在', 404)
    }

    if (agent.userId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    await prisma.agent.delete({
      where: { id },
    })

    return apiResponse(null, '删除成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Delete agent error:', error)
    return apiError('删除失败', 500)
  }
}
