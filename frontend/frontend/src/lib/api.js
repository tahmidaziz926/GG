
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const uid = localStorage.getItem('lab_user_id')
  const role = localStorage.getItem('lab_user_role')
  if(uid) config.headers['X-User-Id'] = uid
  if(role) config.headers['X-User-Role'] = role
  return config
})

export default api
