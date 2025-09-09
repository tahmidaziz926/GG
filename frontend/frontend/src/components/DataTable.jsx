
import { useMemo, useState } from 'react'

export default function DataTable({ columns, data, pageSizeOptions = [5,10,20], searchKeys = [] }){
  const [sortBy, setSortBy] = useState({ key: null, dir: 'asc' })
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [page, setPage] = useState(1)

  const [query, setQuery] = useState('')
  const filtered = useMemo(()=>{
    if(!query) return data
    const q = query.toLowerCase()
    return data.filter(d => searchKeys.some(k => String(d[k]||'').toLowerCase().includes(q)))
  }, [data, query, searchKeys])

  const sorted = useMemo(()=>{
    if(!sortBy.key) return data
    const copy = [...data]
    copy.sort((a,b)=>{
      const A = a[sortBy.key], B = b[sortBy.key]
      if(A == null) return 1
      if(B == null) return -1
      if(typeof A === 'number' && typeof B === 'number') return sortBy.dir === 'asc' ? A-B : B-A
      return sortBy.dir === 'asc' ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A))
    })
    return copy
  }, [data, sortBy])

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const pageData = sorted.slice((page-1)*pageSize, page*pageSize)

  const toggleSort = (key) => {
    if(sortBy.key === key) setSortBy({ key, dir: sortBy.dir === 'asc' ? 'desc' : 'asc' })
    else setSortBy({ key, dir: 'asc' })
    setPage(1)
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <input placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)} className="input w-64" />
        <div className="text-sm text-gray-500">Results: {filtered.length}</div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-600">
          <tr>
            {columns.map(c => (
              <th key={c.key} className="pb-2 pr-4 cursor-pointer" onClick={()=>toggleSort(c.key)}>
                <div className="flex items-center gap-2">
                  <span>{c.title}</span>
                  {sortBy.key === c.key && <span className="text-xs text-gray-500">({sortBy.dir})</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {pageData.map((row, idx) => (
            <tr key={idx} className="border-t">
              {columns.map(c => <td key={c.key} className="py-3 pr-4">{c.render ? c.render(row) : row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Rows:</label>
          <select className="input py-1" value={pageSize} onChange={e=>{setPageSize(Number(e.target.value)); setPage(1)}}>
            {pageSizeOptions.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button className="btn" onClick={()=>setPage(1)} disabled={page===1}>First</button>
          <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
          <span>Page {page} / {pageCount}</span>
          <button className="btn" onClick={()=>setPage(p=>Math.min(pageCount,p+1))} disabled={page===pageCount}>Next</button>
          <button className="btn" onClick={()=>setPage(pageCount)} disabled={page===pageCount}>Last</button>
        </div>
      </div>
    </div>
  )
}
