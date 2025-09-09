import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import * as DatasetService from '../services/datasetService'
import * as ProjectService from '../services/projectService' // Add this import

export default function CreateDataset() {
  const { register, handleSubmit } = useForm({ 
    defaultValues: { 
      title: '', 
      description: '', 
      project_id: '' 
    } 
  })
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([]) // Add state for projects

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await ProjectService.listProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        alert('Failed to load projects')
      }
    }
    fetchProjects()
  }, [])

  const onSubmit = async (vals) => {
    try {
      setLoading(true)
      // Now include project_id in the payload
      const payload = { 
        title: vals.title, 
        description: vals.description,
        project_id: vals.project_id ? parseInt(vals.project_id) : null
      }
      await DatasetService.createDataset(payload)
      alert('Dataset created successfully')
      window.location.reload()
    } catch (e) {
      alert(e?.response?.data?.detail || 'Create failed. Please make sure to select a project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-3">Create Dataset</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            {...register('title', { required: true })}
            placeholder="Enter dataset title"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input"
            rows={4}
            {...register('description')}
            placeholder="Describe your dataset"
          />
        </div>
        <div>
          <label className="label">Project *</label>
          <select
            className="input"
            {...register('project_id', { required: true })}
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title} {project.id ? `(ID: ${project.id})` : ''}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            You must select a project for this dataset
          </p>
        </div>
        <div className="flex justify-end">
          <button 
            className="btn-primary" 
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating...' : 'Create Dataset'}
          </button>
        </div>
      </form>
    </div>
  )
}