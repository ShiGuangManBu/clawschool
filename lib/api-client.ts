// API 客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

// 通用API请求函数
async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  // 获取token
  let token = ''
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || ''
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '请求失败')
  }

  return data
}

// 认证相关 API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/login', { method: 'POST', body: data }),

  getMe: () =>
    apiRequest<User>('/api/auth/me'),

  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    apiRequest<User>('/api/auth/profile', { method: 'PUT', body: data }),
}

// 技能相关 API
export const skillsApi = {
  getList: (params?: { page?: number; limit?: number; search?: string; category?: string; sort?: string; order?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search || '')
    if (params?.category) searchParams.set('category', params.category)
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Skill>>(`/api/skills${query ? `?${query}` : ''}`)
  },

  getById: (id: string) =>
    apiRequest<Skill>(`/api/skills/${id}`),

  create: (data: {
    name: string
    description: string
    detailedDescription?: string
    category: string
    tags?: string[]
    capabilities?: string[]
    requirements?: string
    isFree?: boolean
    price?: number
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
    version?: string
    fileUrl?: string
    instructions?: string
    content?: string
    dependencies?: string[]
    agentId?: string
  }) =>
    apiRequest<Skill>('/api/skills/create', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Skill>) =>
    apiRequest<Skill>(`/api/skills/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<null>(`/api/skills/${id}`, { method: 'DELETE' }),

  download: (id: string) =>
    apiRequest<{ downloadCount: number; content?: string; dependencies?: string[] }>(`/api/skills/${id}/download`, { method: 'POST' }),

  getCategories: () =>
    apiRequest<{ id: string; name: string; count: number }[]>('/api/skills/categories'),

  // 评论
  getReviews: (id: string) =>
    apiRequest<Review[]>(`/api/skills/${id}/reviews`),
}

// 评论相关 API
export const reviewsApi = {
  getList: (skillId: string) =>
    apiRequest<Review[]>(`/api/skills/${skillId}/reviews`),

  create: (skillId: string, data: { rating: number; content: string }) =>
    apiRequest<Review>(`/api/skills/${skillId}/reviews`, { method: 'POST', body: data }),
}

// 分类 API
export const categoriesApi = {
  getList: () =>
    apiRequest<{ id: string; name: string; count: number }[]>('/api/skills/categories'),
}

// 智能体相关 API
export const agentsApi = {
  getList: (params?: { page?: number; limit?: number; search?: string; sort?: string; order?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search || '')
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Agent>>(`/api/agents${query ? `?${query}` : ''}`)
  },

  getById: (id: string) =>
    apiRequest<Agent>(`/api/agents/${id}`),

  create: (data: { name: string; description?: string; prompt: string; avatar?: string }) =>
    apiRequest<Agent>('/api/agents/create', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Agent>) =>
    apiRequest<Agent>(`/api/agents/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<null>(`/api/agents/${id}`, { method: 'DELETE' }),
}

// 论坛相关 API
export const postsApi = {
  getList: (params?: { page?: number; limit?: number; search?: string; category?: string; sort?: string; order?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search || '')
    if (params?.category) searchParams.set('category', params.category)
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Post>>(`/api/forum/posts${query ? `?${query}` : ''}`)
  },

  getById: (id: string) =>
    apiRequest<Post>(`/api/forum/posts/${id}`),

  create: (data: { title: string; content: string; category?: string; tags?: string[] }) =>
    apiRequest<Post>('/api/forum/posts', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Post>) =>
    apiRequest<Post>(`/api/forum/posts/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest<null>(`/api/forum/posts/${id}`, { method: 'DELETE' }),

  // 评论
  getComments: (postId: string) =>
    apiRequest<PostComment[]>(`/api/forum/posts/${postId}/comments`),

  createComment: (postId: string, data: { content: string }) =>
    apiRequest<PostComment>(`/api/forum/posts/${postId}/comments`, { method: 'POST', body: data }),

  deleteComment: (postId: string, commentId: string) =>
    apiRequest<null>(`/api/forum/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
}

// 兼容旧名称
export const forumApi = postsApi

// 排行榜 API
export const rankingApi = {
  getSkills: () =>
    apiRequest<Skill[]>('/api/ranking?type=skills'),

  getUsers: () =>
    apiRequest<User[]>('/api/ranking?type=users'),

  getDownloads: () =>
    apiRequest<Skill[]>('/api/ranking?type=downloads'),
}

// 管理员 API
export const adminApi = {
  getPendingSkills: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search || '')
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Skill>>(`/api/admin/skills${query ? `?${query}` : ''}`)
  },

  reviewSkill: (id: string, data: { action: 'approve' | 'reject' | 'testing'; reviewNote?: string; riskLevel?: string }) =>
    apiRequest<Skill>(`/api/admin/skills/${id}`, { method: 'PUT', body: data }),
}

// 用户 API
export const usersApi = {
  getList: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.search) searchParams.set('search', params.search || '')
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<User>>(`/api/users${query ? `?${query}` : ''}`)
  },
}

// 类型定义
export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'EXPERT'
  avatar?: string
  bio?: string
  status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED'
  createdAt: string
  _count?: {
    skills?: number
    agents?: number
    reviews?: number
    posts?: number
  }
}

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  content: string
  dependencies: string[]
  tags: string[]
  status: 'PENDING' | 'TESTING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  downloads: number
  rating: number
  reviewCount: number
  verified: boolean
  verifiedAt?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  authorId?: string
  agent?: {
    id: string
    name: string
    avatar?: string
    description?: string
  }
  agentId?: string
  reviews?: Review[]
}

export interface Agent {
  id: string
  name: string
  description?: string
  prompt: string
  avatar?: string
  verified: boolean
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  userId?: string
  skills?: Skill[]
  _count?: {
    skills?: number
  }
}

export interface Review {
  id: string
  rating: number
  content?: string
  status: 'PUBLISHED' | 'HIDDEN' | 'DELETED'
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  skillId?: string
}

export interface Post {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  likes: number
  status: 'PUBLISHED' | 'DRAFT' | 'DELETED'
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  authorId?: string
  comments?: PostComment[]
  _count?: {
    comments?: number
  }
}

export interface PostComment {
  id: string
  content: string
  likes: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  authorId?: string
  postId?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

// 认证存储工具
export const authStorage = {
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setToken: (token: string) => typeof window !== 'undefined' && localStorage.setItem('token', token),
  removeToken: () => typeof window !== 'undefined' && localStorage.removeItem('token'),
  getUser: () => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  setUser: (user: User) => typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => typeof window !== 'undefined' && localStorage.removeItem('user'),
  clear: () => {
    authStorage.removeToken()
    authStorage.removeUser()
  },
}
