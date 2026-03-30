import { NextRequest } from 'next/server'

// API响应格式化
export function apiResponse<T>(data: T, message = 'Success') {
  return Response.json({
    success: true,
    message,
    data,
  })
}

export function apiError(message: string, status = 400, errors?: unknown) {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  )
}

// 从请求获取JSON body
export async function getJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

// 解析查询参数
export function parseQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc',
  }
}

// 分页响应
export function paginatedResponse<T>(items: T[], total: number, page: number, limit: number) {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  }
}

// 密码验证规则
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: '密码至少需要6个字符' }
  }
  return { valid: true }
}

// 邮箱验证规则
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: '请输入有效的邮箱地址' }
  }
  return { valid: true }
}
