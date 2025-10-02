import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const buildingApi = axios.create({
  baseURL: `${API_BASE_URL}/buildings`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for Render cold starts
})

// Add response interceptor for better error handling
buildingApi.interceptors.response.use(
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

// Attach JWT token if available
buildingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// === API functions ===

// Get all buildings
export const getAllBuildings = async () => {
  const response = await buildingApi.get('')
  return response.data
}

// Get single building
export const getBuildingById = async (id) => {
  const response = await buildingApi.get(`/${id}`)
  return response.data
}

// Filter buildings
export const filterBuildings = async (filters) => {
  const params = new URLSearchParams()
  if (filters.minCost) params.append('minCost', filters.minCost)
  if (filters.maxCost) params.append('maxCost', filters.maxCost)
  if (filters.type) params.append('type', filters.type)

  const response = await buildingApi.get(`/filter?${params.toString()}`)
  return response.data
}

// === CRUD ===
export const createBuilding = async (buildingData) => {
  const response = await buildingApi.post('', buildingData)
  return response.data
}

export const updateBuilding = async (id, buildingData) => {
  const response = await buildingApi.put(`/${id}`, buildingData)
  return response.data
}

export const deleteBuilding = async (id) => {
  const response = await buildingApi.delete(`/${id}`)
  return response.data
}

export default buildingApi
