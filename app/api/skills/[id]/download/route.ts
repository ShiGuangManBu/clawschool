import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-context'
import { apiResponse, apiError } from '@/lib/api-utils'

// 下载技能
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireAuth(request) // 需要登录才能下载

    const skill = await prisma.skill.findUnique({
      where: { id },
    })

    if (!skill) {
      return apiError('技能不存在', 404)
    }

    if (skill.status !== 'APPROVED' && skill.status !== 'TESTING') {
      return apiError('技能暂不可下载', 403)
    }

    // 增加下载计数
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        downloads: { increment: 1 },
      },
    })

    return apiResponse(
      {
        downloadCount: updatedSkill.downloads,
        content: skill.content,
        dependencies: skill.dependencies,
      },
      '下载成功'
    )
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AuthError') {
      return apiError(error.message, error.status || 401)
    }
    console.error('Download skill error:', error)
    return apiError('下载失败', 500)
  }
}
