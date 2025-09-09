import { useEffect, useState } from 'react'
import * as ProjectService from '../services/projectService'
import CreateProject from './CreateProject'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    ProjectService.listProjects()
      .then(setProjects)
      .catch(()=>setProjects([]))
      .finally(()=>setLoading(false))
  },[])

  const [editing, setEditing] = useState(null)

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title', render: (r)=> r.title },
    { key: 'description', title: 'Description', render: (r)=> r.description },
    { key: 'created_by', title: 'Created by' },
    { key: '_actions', title: 'Actions', render: (r) => (
        <div className='flex gap-2'>
          <button className='btn' onClick={()=>setEditing(r)}>Edit</button>
          <button className='btn' onClick={async()=>{
            if(!confirm('Delete?')) return
            try{
              await (await import('../services/projectService')).deleteProject(r.id)
              alert('Deleted')
              window.location.reload()
            } catch(e){
              alert(e?.response?.data?.detail || 'Delete failed')
            }
          }}>Delete</button>
        </div>
      ) }
  ]

  if(loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Modal open={!!editing} onClose={()=>setEditing(null)} title='Edit project'>
        {editing && (
          <EditProjectForm project={editing} onSaved={()=>{ setEditing(null); window.location.reload() }} />
        )}
      </Modal>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <svg xmlns='http://www.w3.org/2000/svg' className='inline h-6 w-6 mr-2 align-middle' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7h18M3 12h18M3 17h18'/>
          </svg>
          Projects
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-4">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[30vh] text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-700">No Projects Yet</h2>
                <p className="text-gray-500">You haven't created any projects yet. Start by creating one!</p>
              </div>
            ) : (
              <DataTable columns={columns} data={projects} searchKeys={['title','description']} />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <CreateProject />
        </div>
      </div>
    </div>
  )
}


function EditProjectForm({ project, onSaved }){
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description)
  const [loading, setLoading] = useState(false)

  const save = async ()=>{
    try{
      setLoading(true)
      await (await import('../services/projectService')).updateProject(project.id, { title, description })
      alert('Saved')
      onSaved && onSaved()
    } catch(e){
      alert(e?.response?.data?.detail || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-3'>
      <div>
        <label className='label'>Title</label>
        <input className='input' value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div>
        <label className='label'>Description</label>
        <textarea className='input' rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div className='flex justify-end'>
        <button className='btn-primary' onClick={save} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
