import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 审核技能
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { dbUser } = await requireRole(request, ['ADMIN', 'EXPERT'])
    const body = await request.json()
    const { action, reviewNote, riskLevel } = body

    // action: approve, reject, testing
    if (!['approve', 'reject', 'testing'].includes(action)) {
      return apiError('无效的审核操作', 400)
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    if (skill.status !== 'PENDING') {
      return apiError('技能已审核', 400)
    }

    const statusMap: Record<string, string> = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      testing: 'TESTING',
    }

    const [updatedSkill] = await prisma.$transaction([
      prisma.skill.update({
        where: { id },
        data: {
          status: statusMap[action] as 'APPROVED' | 'REJECTED' | 'TESTING',
          verified: action === 'approve',
          verifiedAt: new Date(),
          reviewedBy: dbUser.id,
          reviewedAt: new Date(),
          reviewNote,
          riskLevel: riskLevel || skill.riskLevel,
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
      }),
      prisma.auditLog.create({
        data: {
          action: `SKILL_${statusMap[action].toUpperCase()}`,
          targetId: id,
          targetType: 'SKILL',
          details: JSON.stringify({ reviewNote, riskLevel }),
          userId: dbUser.id,
        },
      }),
    ])

    return apiResponse(updatedSkill, '审核完成')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Review skill error:', error)
    return apiError('审核失败', 500)
  }
}
