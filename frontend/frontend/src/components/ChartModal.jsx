import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../lib/api'

export default function ChartModal({ open, onClose }) {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('bar')

  useEffect(() => {
    if (open) {
      api.get('/researcher/publication-citation-counts/')
        .then(res => setData(res.data))
        .catch(err => {
          console.error(err)
          alert(err?.response?.data?.detail || 'Failed to load researcher data')
        })
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-[90%] p-6 animate-fadeIn overflow-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Research Analytics Dashboard</h2>

        {/* Tabs */}
        <div className="mb-4 flex justify-center border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'bar' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('bar')}
          >
            Bar Chart
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'area' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('area')}
          >
            Area Chart
          </button>
        </div>

        {/* Chart */}
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            {activeTab === 'bar' ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="publication_count" fill="#4f46e5" name="Publications" radius={[4, 4, 0, 0]} />
                <Bar dataKey="citation_count" fill="#10b981" name="Citations" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="publication_count" fill="#4f46e5" stroke="#4f46e5" fillOpacity={0.2} name="Publications" />
                <Area type="monotone" dataKey="citation_count" fill="#10b981" stroke="#10b981" fillOpacity={0.2} name="Citations" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <div className="text-sm text-indigo-700 font-medium">Total Publications</div>
            <div className="text-2xl font-bold text-indigo-800">
              {data.reduce((sum, item) => sum + (item.publication_count || 0), 0)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-sm text-green-700 font-medium">Total Citations</div>
            <div className="text-2xl font-bold text-green-800">
              {data.reduce((sum, item) => sum + (item.citation_count || 0), 0)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-sm text-purple-700 font-medium">Avg. per Researcher</div>
            <div className="text-2xl font-bold text-purple-800">
              {data.length ? (data.reduce((sum, item) => sum + (item.publication_count || 0), 0) / data.length).toFixed(1) : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
