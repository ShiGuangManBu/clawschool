// Next.js API Route - 技能审核
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

function getAuthUserId(): string | null {
  try {
    const headersList = headers()
    const authorization = headersList.get('authorization')
    if (!authorization?.startsWith('Bearer ')) return null
    const token = authorization.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }
    
    // 检查是否为管理员
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权操作' }, { status: 403 })
    }
    
    const body = await req.json()
    const { skillId, action, reviewNote } = body
    
    if (!skillId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }
    
    const skill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        reviewedBy: userId,
        reviewedAt: new Date(),
        reviewNote: reviewNote || null,
        verified: action === 'APPROVE'
      }
    })
    
    // 创建审核日志
    await prisma.auditLog.create({
      data: {
        action: action === 'APPROVE' ? 'SKILL_APPROVED' : 'SKILL_REJECTED',
        targetId: skillId,
        targetType: 'SKILL',
        userId,
        details: reviewNote || undefined
      }
    })
    
    return NextResponse.json({
      success: true,
      skill,
      message: action === 'APPROVE' ? '技能已通过审核' : '技能已拒绝'
    })
    
  } catch (error) {
    console.error('Review skill error:', error)
    return NextResponse.json({ error: '审核失败' }, { status: 500 })
  }
}
