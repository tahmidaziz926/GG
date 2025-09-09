
import api from '../lib/api'
export async function listProjects(){
  const { data } = await api.get('/projects/')
  return data
}
export async function createProject(payload){
  const { data } = await api.post('/projects/', payload)
  return data
}
export async function addMember(project_id, payload){
  const { data } = await api.post(`/projects/${project_id}/members/`, payload)
  return data
}
export async function addTag(project_id, payload){
  const { data } = await api.post(`/projects/${project_id}/tags/`, payload)
  return data
}


export async function updateProject(project_id, payload){
  const { data } = await api.put(`/projects/${project_id}/`, payload)
  return data
}
export async function deleteProject(project_id){
  const { data } = await api.delete(`/projects/${project_id}/`)
  return data
}
