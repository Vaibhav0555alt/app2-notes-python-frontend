import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const signup = (data) => API.post('/auth/signup', data)
export const login = (data) => API.post('/auth/login', data)
export const getTodos = () => API.get('/todos')
export const createTodo = (data) => API.post('/todos', data)
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data)
export const deleteTodo = (id) => API.delete(`/todos/${id}`)
