
import { createContext, useContext, useEffect, useState } from 'react'
import * as AuthService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const uid = localStorage.getItem('lab_user_id')
    const role = localStorage.getItem('lab_user_role')
    const name = localStorage.getItem('lab_user_name')
    if(uid && role) setUser({ user_id: Number(uid), role, name })
    setLoading(false)
  },[])

  const login = async (user_id, password) => {
    const data = await AuthService.login({ user_id, password })
    // data: { role, user_id, name }
    localStorage.setItem('lab_user_id', data.user_id)
    localStorage.setItem('lab_user_role', data.role)
    localStorage.setItem('lab_user_name', data.name || '')
    setUser({ user_id: data.user_id, role: data.role, name: data.name })
    return data
  }

  const register = async (payload) => {
    const data = await AuthService.register(payload)
    return data
  }

  const logout = () => {
    localStorage.removeItem('lab_user_id')
    localStorage.removeItem('lab_user_role')
    localStorage.removeItem('lab_user_name')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
