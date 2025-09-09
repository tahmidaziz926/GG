
import api from '../lib/api'
export async function createPaper(payload){
  const { data } = await api.post('/papers/', payload)
  return data
}
export async function listPapers(){
  const { data } = await api.get('/papers/')
  return data
}
export async function createReview(paper_id, payload){
  const { data } = await api.post(`/papers/${paper_id}/reviews/`, payload)
  return data
}


export async function updatePaper(paper_id, payload){
  const { data } = await api.put(`/papers/${paper_id}/`, payload)
  return data
}
export async function deletePaper(paper_id){
  const { data } = await api.delete(`/papers/${paper_id}/`)
  return data
}
