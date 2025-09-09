import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const { register, handleSubmit } = useForm({ defaultValues: { user_id: '', password: '' } })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // default redirect is now /home
  const from = location.state?.from?.pathname || '/home'

  const onSubmit = async (vals) => {
    try {
      const uid = Number(vals.user_id)
      await login(uid, vals.password)
      navigate(from, { replace: true }) // redirect to welcome page
    } catch (e) {
      alert(e?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-md w-full glass rounded-2xl p-8 shadow-xl animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
            DL
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Research+</h1>
          <p className="text-gray-600">Sign in to your research portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">User ID</label>
            <input
              className="input"
              placeholder="Enter your user ID"
              {...register('user_id')}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
              {...register('password')}
            />
          </div>
          <button className="btn-primary w-full py-3 text-lg font-medium">
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          New to Dork Labs?{" "}
          <a href="/register" className="link font-semibold">
            Create an account
          </a>
        </div>
      </div>
    </div>
  )
}
