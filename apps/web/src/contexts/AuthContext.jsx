import { useState } from 'react'
import { MOCK_USERS, AuthContext } from './authContextDef'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('school_lost_found_mock_role')
    return (saved && MOCK_USERS[saved]) ? MOCK_USERS[saved] : MOCK_USERS.STUDENT
  })

  const setRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setCurrentUser(MOCK_USERS[roleKey])
      localStorage.setItem('school_lost_found_mock_role', roleKey)
    }
  }

  const logout = () => {
    setRole('GUEST')
  }

  return (
    <AuthContext.Provider value={{ currentUser, setRole, logout, availableRoles: Object.keys(MOCK_USERS) }}>
      {children}
    </AuthContext.Provider>
  )
}
