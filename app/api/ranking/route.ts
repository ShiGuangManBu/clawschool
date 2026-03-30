import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse, apiError } from '@/lib/api-utils'

// 获取排行榜
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'skills' // skills, users, downloads

    let ranking: unknown[] = []

    if (type === 'skills') {
      // 技能排行榜 - 按下载量和评分
      ranking = await prisma.skill.findMany({
        where: { status: 'APPROVED' },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          downloads: true,
          rating: true,
          reviewCount: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: [
          { downloads: 'desc' },
          { rating: 'desc' },
        ],
        take: 50,
      })
    } else if (type === 'users') {
      // 用户排行榜 - 按技能数量和下载量
      ranking = await prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          role: true,
          _count: {
            select: {
              skills: { where: { status: 'APPROVED' } },
              agents: { where: { status: 'ACTIVE' } },
              reviews: true,
            },
          },
        },
        orderBy: {
          skills: { _count: 'desc' },
        },
        take: 50,
      })
    } else if (type === 'downloads') {
      // 下载量排行榜
      ranking = await prisma.skill.findMany({
        where: { status: 'APPROVED' },
        select: {
          id: true,
          name: true,
          category: true,
          downloads: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { downloads: 'desc' },
        take: 100,
      })
    }

    return apiResponse(ranking, '获取成功')
  } catch (error) {
    console.error('Get ranking error:', error)
    return apiError('获取排行榜失败', 500)
  }
}
