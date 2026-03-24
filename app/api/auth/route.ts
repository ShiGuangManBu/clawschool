// Next.js API Route - 认证
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 注册
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, name, email, password } = body
    
    if (action === 'register') {
      // 检查用户是否存在
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        return NextResponse.json({ error: '邮箱已注册' }, { status: 400 })
      }
      
      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // 创建用户
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER'
        },
        select: { id: true, name: true, email: true, role: true }
      })
      
      // 生成 JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({
        success: true,
        user,
        token
      })
    }
    
    if (action === 'login') {
      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (!user || !user.password) {
        return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
      }
      
      // 验证密码
      const isValid = await bcrypt.compare(password, user.password)
      
      if (!isValid) {
        return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
      }
      
      // 生成 JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      })
    }
    
    return NextResponse.json({ error: '无效操作' }, { status: 400 })
    
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
