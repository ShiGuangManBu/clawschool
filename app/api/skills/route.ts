// Next.js API Route - 技能提交
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'

// 安全检查函数
function securityCheck(code: string, dependencies: string[]): { safe: boolean; risks: string[] } {
  const risks: string[] = []
  
  // 1. 检查危险代码模式
  const dangerousPatterns = [
    { pattern: /eval\s*\(/i, desc: '使用 eval() 存在代码注入风险' },
    { pattern: /Function\s*\(\s*["'`]/i, desc: '使用 Function 构造函数存在风险' },
    { pattern: /child_process/i, desc: '调用系统命令存在安全风险' },
    { pattern: /fs\.unlink|fs\.rmdir|fs\.rm/i, desc: '文件删除操作需要谨慎' },
    { pattern: /exec\s*\(|spawn\s*\(/i, desc: '执行系统命令存在风险' },
    { pattern: /http\.createServer|express\(\)/i, desc: '创建服务器可能暴露端口' },
    { pattern: /process\.env/i, desc: '访问环境变量可能泄露敏感信息' },
  ]
  
  for (const { pattern, desc } of dangerousPatterns) {
    if (pattern.test(code)) {
      risks.push(desc)
    }
  }
  
  // 2. 检查依赖安全性
  const riskyDeps = [
    'request', 'axios', 'node-fetch', // 网络请求
    'fs-extra', 'rimraf', // 文件操作
    'child_process', 'execa', // 系统命令
  ]
  
  for (const dep of dependencies) {
    if (riskyDeps.some(risky => dep.includes(risky))) {
      risks.push(`依赖 ${dep} 可能涉及敏感操作`)
    }
  }
  
  // 3. 检查代码长度合理性
  if (code.length < 50) {
    risks.push('代码过短，可能不完整')
  }
  if (code.length > 50000) {
    risks.push('代码过长，需要人工审查')
  }
  
  return {
    safe: risks.length === 0,
    risks
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }
    
    const body = await req.json()
    const { name, description, category, code, dependencies, tags } = body
    
    // 验证必填字段
    if (!name || !description || !code) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    
    // 安全检查
    const security = securityCheck(code, dependencies || [])
    
    // 自动风险评估
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (security.risks.length >= 3) {
      riskLevel = 'high'
    } else if (security.risks.length >= 1) {
      riskLevel = 'medium'
    }
    
    // 创建技能记录
    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        category: category || 'Other',
        content: code,
        dependencies: dependencies || [],
        tags: tags || [],
        status: 'PENDING',
        riskLevel,
        securityReport: JSON.stringify(security.risks),
        authorId: userId,
      }
    })
    
    return NextResponse.json({
      success: true,
      skill,
      securityCheck: security,
      message: security.safe 
        ? '技能提交成功，等待审核' 
        : '技能提交成功，检测到潜在风险，需要人工审核'
    })
    
  } catch (error) {
    console.error('Submit skill error:', error)
    return NextResponse.json({ error: '提交失败' }, { status: 500 })
  }
}

// 获取技能列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    
    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category
    
    const skills = await prisma.skill.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ skills })
    
  } catch (error) {
    console.error('Get skills error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
