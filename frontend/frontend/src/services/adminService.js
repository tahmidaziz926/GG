
import api from '../lib/api'
export async function allResearchers(){
  const { data } = await api.get('/admin/all-researchers/')
  return data
}
export async function allReviewers(){
  const { data } = await api.get('/admin/all-reviewers/')
  return data
}
