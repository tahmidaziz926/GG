
import api from '../lib/api'
export async function addFeedback(payload){
  const { data } = await api.post('/feedback/', payload)
  return data
}
export async function listFeedbacks(){
  const { data } = await api.get('/feedbacks/')
  return data
}
