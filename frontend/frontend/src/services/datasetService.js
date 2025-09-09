
import api from '../lib/api'
export async function createDataset(payload){
  const { data } = await api.post('/datasets/', payload)
  return data
}
export async function listDatasets(){
  const { data } = await api.get('/datasets/')
  return data
}
export async function addTag(dataset_id, payload){
  const { data } = await api.post(`/datasets/${dataset_id}/tags/`, payload)
  return data
}
export async function requestAccess(dataset_id){
  const { data } = await api.post(`/datasets/${dataset_id}/access-requests/`)
  return data
}


export async function updateDataset(dataset_id, payload){
  const { data } = await api.put(`/datasets/${dataset_id}/`, payload)
  return data
}
export async function deleteDataset(dataset_id){
  const { data } = await api.delete(`/datasets/${dataset_id}/`)
  return data
}
