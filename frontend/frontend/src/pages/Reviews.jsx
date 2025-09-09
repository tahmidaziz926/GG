
import { useEffect, useState } from 'react'
import * as PaperService from '../services/paperService'

export default function Reviews(){
  const [papers, setPapers] = useState([])
  useEffect(()=>{ PaperService.listPapers().then(setPapers).catch(()=>setPapers([])) },[])

  const submitReview = async (paper_id, decision) => {
    try {
      await PaperService.createReview(paper_id, { decision })
      alert('Review submitted')
      window.location.reload()
    } catch (e) {
      alert(e?.response?.data?.detail || 'Failed')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold"><svg xmlns='http://www.w3.org/2000/svg' className='inline h-6 w-6 mr-2 align-middle' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7h18M3 12h18M3 17h18'/></svg> Review Queue</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {papers.map(p=> (
          <div key={p.paper_id} className="card p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-700">{p.abstract}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn" onClick={()=>submitReview(p.paper_id, 'accept')}>Accept</button>
              <button className="btn" onClick={()=>submitReview(p.paper_id, 'minor_revision')}>Minor Rev</button>
              <button className="btn" onClick={()=>submitReview(p.paper_id, 'reject')}>Reject</button>
            </div>
          </div>
        ))}
        {papers.length === 0 && <div className="card p-4">No papers available for review.</div>}
      </div>
    </div>
  )
}
