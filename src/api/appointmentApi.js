import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const appointmentApi = axios.create({
  baseURL: `${API_BASE_URL}/appointments`,
  headers: {
    'Content-Type': 'application/json',
  },
})

appointmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const bookAppointment = async (appointmentData) => {
  try {
    const response = await appointmentApi.post('/book', appointmentData)
    return response.data
  } catch (error) {
    console.error('Error booking appointment:', error)
    throw error
  }
}

export const verifyAppointment = async (appointmentId) => {
  try {
    const response = await appointmentApi.get(`/verify?appointmentId=${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Error verifying appointment:', error)
    throw error
  }
}

export const getUserAppointments = async (userId) => {
  try {
    const response = await appointmentApi.get(`/user/${userId}`)
    return response.data
  } catch (error) {
    // Return mock data if API fails
    console.warn('Appointment API not available, using mock data:', error)
    return [
      {
        id: 1,
        buildingName: 'Luxury Downtown Apartment',
        buildingLocation: 'Downtown District',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        mode: 'physical'
      },
      {
        id: 2,
        buildingName: 'Modern Office Space',
        buildingLocation: 'Business Center',
        dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        mode: 'online'
      }
    ]
  }
}

export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await appointmentApi.delete(`/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    throw error
  }
}

export default appointmentApi