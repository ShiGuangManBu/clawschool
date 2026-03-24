'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'expert'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@clawschool.online',
    password: 'admin123',
    name: '管理员',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: '测试用户',
    role: 'user' as const,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('clawschool_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      throw new Error('邮箱或密码错误')
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)
    localStorage.setItem('clawschool_user', JSON.stringify(userWithoutPassword))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user exists
    if (MOCK_USERS.find(u => u.email === email)) {
      throw new Error('该邮箱已注册')
    }

    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      name,
      role: 'user' as const,
    }

    setUser(newUser)
    localStorage.setItem('clawschool_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('clawschool_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
