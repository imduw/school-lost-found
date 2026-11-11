import { useEffect, useState } from 'react'
import apiClient, { TOKEN_STORAGE_KEY, getApiErrorMessage } from '../services/apiClient'
import { AuthContext, MOCK_USERS } from './authContextDef'

const GUEST_USER = MOCK_USERS.GUEST

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(GUEST_USER)
  const [loadingAuth, setLoadingAuth] = useState(() => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)))

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      return
    }

    let cancelled = false
    apiClient
      .get('/auth/me')
      .then((res) => {
        if (!cancelled && res.data?.success) {
          setCurrentUser(res.data.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setCurrentUser(GUEST_USER)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingAuth(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      const { token, user } = res.data.data
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      setCurrentUser(user)
      return user
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Đăng nhập thất bại'), { cause: error })
    }
  }

  const register = async (payload) => {
    try {
      const res = await apiClient.post('/auth/register', payload)
      const { token, user } = res.data.data
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      setCurrentUser(user)
      return user
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Đăng ký thất bại'), { cause: error })
    }
  }

  const logout = async () => {
    try {
      if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
        await apiClient.post('/auth/logout')
      }
    } catch {
      // Bỏ qua lỗi mạng khi logout, luôn dọn phiên ở client
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setCurrentUser(GUEST_USER)
    }
  }

  const isAuthenticated = Boolean(currentUser && currentUser.role && currentUser.role !== 'GUEST')

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loadingAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
