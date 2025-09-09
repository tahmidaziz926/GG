
import api from '../lib/api'

export async function login(payload){
  const { data } = await api.post('/login/', payload)
  return data
}

export async function register(payload){
  const { data } = await api.post('/register/', payload)
  return data
}
