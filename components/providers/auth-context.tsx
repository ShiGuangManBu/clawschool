'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, authStorage, User } from '@/lib/api-client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = authStorage.getToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await authApi.getMe()
      authStorage.setUser(userData)
      setUser(userData)
    } catch (error) {
      console.error('Failed to get user:', error)
      authStorage.clear()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken()
      const cachedUser = authStorage.getUser()

      if (cachedUser && token) {
        setUser(cachedUser)
        setIsLoading(false)
        // 验证token是否仍然有效
        try {
          const userData = await authApi.getMe()
          authStorage.setUser(userData)
          setUser(userData)
        } catch {
          authStorage.clear()
          setUser(null)
        }
      } else {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { user: userData, token } = await authApi.login({ email, password })
    authStorage.setToken(token)
    authStorage.setUser(userData)
    setUser(userData)
  }

  const register = async (email: string, password: string, name: string) => {
    const { user: userData, token } = await authApi.register({ email, password, name })
    authStorage.setToken(token)
    authStorage.setUser(userData)
    setUser(userData)
  }

  const logout = () => {
    authStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
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
