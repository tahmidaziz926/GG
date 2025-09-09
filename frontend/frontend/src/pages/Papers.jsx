import Modal from '../components/Modal'
import { useEffect, useState } from 'react'
import * as PaperService from '../services/paperService'
import CreatePaper from './CreatePaper'
import DataTable from '../components/DataTable'

export default function Papers(){
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    PaperService.listPapers()
      .then(setPapers)
      .catch(()=>setPapers([]))
      .finally(()=>setLoading(false))
  },[])

  const [editing, setEditing] = useState(null)

  const columns = [
    { key: 'paper_id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'abstract', title: 'Abstract' },
    { key: 'status', title: 'Status' },
    { key: 'date_uploaded', title: 'Uploaded' },
    { key: '_actions', title: 'Actions', render: (r) => (
        <div className='flex gap-2'>
          <button className='btn' onClick={()=>setEditing(r)}>Edit</button>
          <button className='btn' onClick={async()=>{
            if(!confirm('Delete paper?')) return
            try{
              await (await import('../services/paperService')).deletePaper(r.paper_id)
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
      <Modal open={!!editing} onClose={()=>setEditing(null)} title='Edit paper'>
        {editing && <EditPaperForm paper={editing} onSaved={()=>{ setEditing(null); window.location.reload() }} />}
      </Modal>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <svg xmlns='http://www.w3.org/2000/svg' className='inline h-6 w-6 mr-2 align-middle' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7h18M3 12h18M3 17h18'/>
          </svg>
          Papers
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-4">
            {papers.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[30vh] text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-700">No Papers Yet</h2>
                <p className="text-gray-500">You haven't added any papers yet. Start by creating one!</p>
              </div>
            ) : (
              <DataTable columns={columns} data={papers} searchKeys={['title','abstract','status']} />
            )}
          </div>
        </div>
        <div>
          <CreatePaper />
        </div>
      </div>
    </div>
  )
}


function EditPaperForm({ paper, onSaved }){
  const [title, setTitle] = useState(paper.title)
  const [abstract, setAbstract] = useState(paper.abstract)
  const [status, setStatus] = useState(paper.status)
  const [loading, setLoading] = useState(false)

  const save = async ()=>{
    try{
      setLoading(true)
      await (await import('../services/paperService')).updatePaper(paper.paper_id, { title, abstract, status })
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
        <label className='label'>Abstract</label>
        <textarea className='input' rows={4} value={abstract} onChange={e=>setAbstract(e.target.value)} />
      </div>
      <div className='flex items-center gap-3'>
        <select className='input w-48' value={status} onChange={e=>setStatus(e.target.value)}>
          <option value='draft'>draft</option>
          <option value='submitted'>submitted</option>
          <option value='under_review'>under_review</option>
        </select>
        <div className='flex-1' />
        <button className='btn-primary' onClick={save} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
