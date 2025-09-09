
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function ProtectedRoute(){
  const { user, loading } = useAuth()
  const loc = useLocation()
  if(loading) return <div className="p-8 text-center">Loading...</div>
  if(!user) return <Navigate to="/login" state={{ from: loc }} replace />
  return <Outlet />
}
