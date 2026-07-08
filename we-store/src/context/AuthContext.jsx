import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState, nextId } from '../lib/storage'
import { seedUsers } from '../data/seed'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadState('users', seedUsers))
  const [currentUserId, setCurrentUserId] = useState(() => loadState('session', null))

  useEffect(() => saveState('users', users), [users])
  useEffect(() => saveState('session', currentUserId), [currentUserId])

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || null,
    [users, currentUserId]
  )

  function login(email, password, role) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (!user) return { ok: false, error: 'Invalid email or password.' }
    if (role && user.role !== role) {
      return { ok: false, error: `That account is not registered as a ${role}.` }
    }
    setCurrentUserId(user.id)
    return { ok: true, user }
  }

  function signup({ name, email, password, phone, role }) {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (exists) return { ok: false, error: 'An account with that email already exists.' }
    const newUser = {
      id: nextId(users),
      role: role || 'customer',
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone?.trim() || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setUsers((prev) => [...prev, newUser])
    setCurrentUserId(newUser.id)
    return { ok: true, user: newUser }
  }

  function logout() {
    setCurrentUserId(null)
  }

  function updateProfile(userId, updates) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)))
  }

  const value = {
    users,
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
