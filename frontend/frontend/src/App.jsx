import { useAuth } from './contexts/AuthProvider'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RedirectByRole(){
  const { user, loading } = useAuth()
  const nav = useNavigate()
  useEffect(()=>{
    if(!loading){
      if(!user) nav('/login')
      else if(user.role === 'admin') nav('/admin')
      else if(user.role === 'researcher') nav('/projects')
      else if(user.role === 'reviewer') nav('/reviews')
      else nav('/projects')
    }
  },[user,loading])
  return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-xl text-indigo-600 flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        Redirecting to Research+...
      </div>
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import Papers from './pages/Papers'
import Datasets from './pages/Datasets'
import Reviews from './pages/Reviews'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import ResearcherHome from './pages/ResearcherHome'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'  // ← import your Home page

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<RedirectByRole />} />
          <Route path="/home" element={<Home />} />  {/* ← new Home route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<Projects/>} />
            <Route path="/papers" element={<Papers/>} />
            <Route path="/datasets" element={<Datasets/>} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/admin" element={<Admin/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </div>
  )
}
