import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const { register: reg, handleSubmit, watch } = useForm({ defaultValues: { role: 'researcher' } })
  const { register } = useAuth()
  const navigate = useNavigate()
  const [newUser, setNewUser] = useState(null)

  const onSubmit = async (vals) => {
    try {
      const createdUser = await register(vals)
      setNewUser(createdUser)
    } catch (e) {
      alert(e?.response?.data?.detail || 'Registration failed')
    }
  }

  if (newUser) {
    return (
      <div className="max-w-md mx-auto mt-10 card p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-green-600">Registration Successful 🎉</h1>
        <p className="mb-2">Welcome, <span className="font-bold">{newUser.name}</span>!</p>
        <p className="mb-4">
          Your <span className="font-semibold">User ID</span> is:
        </p>
        <div className="text-3xl font-bold bg-gray-100 p-3 rounded-lg mb-6">
          {newUser.user_id}
        </div>
        <p className="mb-6 text-sm text-gray-500">Please save this User ID for login and future reference.</p>
        <button
          className="btn-primary w-full"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="label">Full name</label>
          <input className="input" {...reg('name')} />
        </div>
        <div className="mb-4">
          <label className="label">Email</label>
          <input className="input" type="email" {...reg('email')} />
        </div>
        <div className="mb-4">
          <label className="label">Password</label>
          <input className="input" type="password" {...reg('password')} />
        </div>
        <input type="hidden" {...reg('role')} value="researcher" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Publication count</label>
            <input className="input" type="number" {...reg('publication_count')} />
          </div>
          <div>
            <label className="label">Citation count</label>
            <input className="input" type="number" {...reg('citation_count')} />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn-primary w-full">Create account</button>
        </div>
      </form>
    </div>
  )
}