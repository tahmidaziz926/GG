
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import * as ProjectService from '../services/projectService'

export default function CreateProject(){ 
  const { register, handleSubmit } = useForm({ defaultValues: { title: '', description: '' } })
  const [loading, setLoading] = useState(false)
  const onSubmit = async (vals) => {
    try {
      setLoading(true)
      await ProjectService.createProject(vals)
      alert('Project created successfully')
      window.location.reload()
    } catch (e) {
      alert(e?.response?.data?.detail || 'Create failed')
    } finally { setLoading(false) }
  }
  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-3">Create Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Title</label>
          <input className="input" {...register('title', { required: true })} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={4} {...register('description')} />
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}
