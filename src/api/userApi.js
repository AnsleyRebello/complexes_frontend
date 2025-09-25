import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = async (userData) => {
  const response = await userApi.post('/register', userData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await userApi.post('/login', credentials)
  return response.data
}

export const addFavoriteBuilding = async (userId, buildingId) => {
  const response = await userApi.post(`/${userId}/favorites/${buildingId}`)
  return response.data
}

export default userApi