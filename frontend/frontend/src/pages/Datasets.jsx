import Modal from '../components/Modal'
import { useEffect, useState } from 'react'
import * as DatasetService from '../services/datasetService'
import CreateDataset from './CreateDataset'
import DataTable from '../components/DataTable'

export default function Datasets() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await DatasetService.listDatasets()
        setDatasets(Array.isArray(res) ? res : [])
      } catch (e) {
        setDatasets([])
      } finally {
        setLoading(false)
      }
    }
    fetchDatasets()
  }, [])

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    { key: 'owner_id', title: 'Owner' },
    {
      key: '_actions',
      title: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button className="btn" onClick={() => setEditing(r)}>Edit</button>
          <button
            className="btn"
            onClick={async () => {
              if (!confirm('Delete dataset?')) return
              try {
                await DatasetService.deleteDataset(r.id)
                alert('Deleted')
                // remove deleted dataset locally instead of full reload
                setDatasets(prev => prev.filter(d => d.id !== r.id))
              } catch (e) {
                alert(e?.response?.data?.detail || 'Delete failed')
              }
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit dataset">
        {editing && (
          <EditDatasetForm
            dataset={editing}
            onSaved={(updatedDataset) => {
              setEditing(null)
              setDatasets(prev => prev.map(d => d.id === updatedDataset.id ? updatedDataset : d))
            }}
          />
        )}
      </Modal>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline h-6 w-6 mr-2 align-middle" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          Datasets
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-4">
            {datasets.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[30vh] text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-700">No Datasets Yet</h2>
                <p className="text-gray-500">You haven't created any datasets yet. Start by creating one!</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={datasets.map(d => ({
                  id: d.id || '-',
                  title: d.title || '-',
                  description: d.description || '-',
                  owner_id: d.owner_id || '-',
                }))}
                searchKeys={['title', 'description']}
              />
            )}
          </div>
        </div>
        <div>
          <CreateDataset />
        </div>
      </div>
    </div>
  )
}


function EditDatasetForm({ dataset, onSaved }) {
  const [title, setTitle] = useState(dataset.title || '')
  const [description, setDescription] = useState(dataset.description || '')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    try {
      setLoading(true)
      const updated = await DatasetService.updateDataset(dataset.id, { title, description })
      alert('Saved')
      onSaved && onSaved(updated)
    } catch (e) {
      alert(e?.response?.data?.detail || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" onClick={save} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
