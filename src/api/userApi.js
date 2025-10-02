import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for Render cold starts
})

// Add response interceptor for better error handling
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout - Render service may be cold starting')
      error.message = 'Service is starting up, please try again in a moment...'
    } else if (error.response?.status === 503) {
      console.warn('Service temporarily unavailable')
      error.message = 'Service is temporarily unavailable, please try again...'
    }
    return Promise.reject(error)
  }
)

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