import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import * as PaperService from '../services/paperService'
import * as ProjectService from '../services/projectService'

export default function CreatePaper() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      abstract: '',
      status: 'draft',
      project_id: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])

  // Load projects
  useEffect(() => {
    ProjectService.listProjects()
      .then(data => {
        // Normalize project data to have 'id' and 'title'
        const normalized = data.map(p => ({
          id: p.id ?? p.Project_ID,
          title: p.title ?? p.Project_Title
        }))
        setProjects(normalized)
      })
      .catch(err => {
        setProjects([])
        console.error(err)
        alert('Failed to load projects')
      })
  }, [])

  const onSubmit = async (vals) => {
    try {
      setLoading(true)
      
      const payload = {
        title: vals.title,
        abstract: vals.abstract,
        status: vals.status,
        project_id: vals.project_id ? Number(vals.project_id) : null
      }

      // Make sure auth headers are included if required
      await PaperService.createPaper(payload)
      
      alert('Paper submitted successfully!')
      window.location.reload()
    } catch (e) {
      console.error(e.response || e)
      alert(e?.response?.data?.detail || e.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-3">Submit Paper</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Title */}
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter paper title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Abstract */}
        <div>
          <label className="label">Abstract *</label>
          <textarea
            className="input"
            rows={4}
            {...register('abstract', { required: 'Abstract is required' })}
            placeholder="Enter paper abstract"
          />
          {errors.abstract && <p className="text-red-500 text-sm mt-1">{errors.abstract.message}</p>}
        </div>

        {/* Project */}
        <div>
          <label className="label">Project *</label>
          <select
            className="input"
            {...register('project_id', {
              required: 'Project selection is required',
              validate: value => value !== '' || 'Please select a project'
            })}
          >
            <option value="">-- Select a project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} {p.id ? `(ID: ${p.id})` : ''}
              </option>
            ))}
          </select>
          {errors.project_id && <p className="text-red-500 text-sm mt-1">{errors.project_id.message}</p>}
          <p className="text-sm text-gray-500 mt-1">You must select a project for this paper</p>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status *</label>
          <select
            className="input w-48"
            {...register('status', { required: 'Status is required' })}
          >
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? 'Submitting...' : 'Submit Paper'}
          </button>
        </div>
      </form>
    </div>
  )
}
