import { verifyToken, getTokenFromRequest, JWTPayload } from './auth'
import { prisma } from './prisma'

// 获取当前用户（如果已登录）
export async function getCurrentUser(request: Request): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return verifyToken(token)
}

// 需要认证的请求
export async function requireAuth(request: Request): Promise<{ user: JWTPayload; dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> }> {
  const user = await getCurrentUser(request)

  if (!user) {
    throw new AuthError('请先登录')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
  })

  if (!dbUser) {
    throw new AuthError('用户不存在')
  }

  if (dbUser.status !== 'ACTIVE') {
    throw new AuthError('账号已被禁用')
  }

  return { user, dbUser }
}

// 需要特定角色的请求
export async function requireRole(request: Request, roles: string[]): Promise<{ user: JWTPayload; dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> }> {
  const { user, dbUser } = await requireAuth(request)

  if (!roles.includes(user.role)) {
    throw new AuthError('权限不足')
  }

  return { user, dbUser }
}

export class AuthError extends Error {
  status: number

  constructor(message: string, status = 401) {
    super(message)
    this.name = 'AuthError'
    this.status = status
  }
}
