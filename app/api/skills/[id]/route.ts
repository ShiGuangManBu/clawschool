import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取技能详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser(request)

    const skill = await prisma.skill.findUnique({
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
                skills: { where: { status: 'APPROVED' } },
              },
            },
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            avatar: true,
            description: true,
          },
        },
        reviews: {
          where: { status: 'PUBLISHED' },
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
        },
      },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    // 如果技能未审核且用户不是作者也不是管理员，不显示内容
    if (skill.status !== 'APPROVED' && skill.status !== 'TESTING') {
      if (!currentUser || (currentUser.userId !== skill.authorId && currentUser.role !== 'ADMIN')) {
        return apiError('技能不存在', 404)
      }
    }

    return apiResponse(skill, '获取成功')
  } catch (error) {
    console.error('Get skill error:', error)
    return apiError('获取技能详情失败', 500)
  }
}

// 更新技能
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)
    const body = await request.json()
    const { name, description, category, content, dependencies, tags, agentId } = body

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    // 只有作者或管理员可以更新
    if (skill.authorId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    const updateData: Record<string, unknown> = {}
    if (name) updateData.name = name
    if (description) updateData.description = description
    if (category) updateData.category = category
    if (content) updateData.content = content
    if (dependencies !== undefined) updateData.dependencies = dependencies
    if (tags !== undefined) updateData.tags = tags
    if (agentId !== undefined) updateData.agentId = agentId

    // 如果是作者更新，重新提交审核
    if (skill.authorId === dbUser.id) {
      updateData.status = 'PENDING'
    }

    const updatedSkill = await prisma.skill.update({
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

    return apiResponse(updatedSkill, '更新成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Update skill error:', error)
    return apiError('更新失败', 500)
  }
}

// 删除技能
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireAuth(request)

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    // 只有作者或管理员可以删除
    if (skill.authorId !== dbUser.id && dbUser.role !== 'ADMIN') {
      return apiError('权限不足', 403)
    }

    await prisma.skill.delete({
      where: { id },
    })

    return apiResponse(null, '删除成功')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Delete skill error:', error)
    return apiError('删除失败', 500)
  }
}

import { requireAuth } from '@/lib/auth-context'
