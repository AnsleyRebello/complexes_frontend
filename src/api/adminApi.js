// Admin API functions for managing users and appointments
import axios from 'axios'

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await adminApi.get('/users')
    return response.data
  } catch (error) {
    console.warn('Admin API not available, using mock data for users:', error)
    // Return mock user data
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        favoriteBuildingIds: [1, 2, 3],
        phone: '+91 98765 43210',
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith', 
        email: 'jane@example.com',
        role: 'user',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        favoriteBuildingIds: [2, 4],
        phone: '+91 98765 43211',
        status: 'active'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@clementregency.com',
        role: 'admin',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        favoriteBuildingIds: [],
        phone: '+91 98765 43212',
        status: 'active'
      },
      {
        id: 4,
        name: 'Demo User',
        email: 'demo@clementregency.com',
        role: 'user',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        favoriteBuildingIds: [1, 3, 5],
        phone: '+91 98765 43213',
        status: 'active'
      },
      {
        id: 5,
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        role: 'user',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        favoriteBuildingIds: [2, 6],
        phone: '+91 98765 43214',
        status: 'active'
      },
      {
        id: 6,
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@yahoo.com',
        role: 'user',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        favoriteBuildingIds: [1, 4, 7],
        phone: '+91 98765 43215',
        status: 'active'
      },
      {
        id: 7,
        name: 'Anita Patel',
        email: 'anita.patel@hotmail.com',
        role: 'user',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        favoriteBuildingIds: [3, 5],
        phone: '+91 98765 43216',
        status: 'active'
      }
    ]
  }
}

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const response = await adminApi.get('/appointments')
    return response.data
  } catch (error) {
    console.warn('Admin API not available, using mock data for appointments:', error)
    // Return mock appointment data
    return [
      {
        id: 1,
        userId: 1,
        buildingId: 1,
        buildingName: 'Luxury Downtown Apartment',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        mode: 'physical',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 2,
        buildingId: 2,
        buildingName: 'Modern Office Space',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        appointmentTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        mode: 'online',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        userId: 1,
        buildingId: 3,
        buildingName: 'Cozy Studio Apartment',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        appointmentTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        mode: 'physical',
        createdAt: new Date().toISOString()
      }
    ]
  }
}

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await adminApi.patch(`/users/${userId}/role`, { role: newRole })
    return response.data
  } catch (error) {
    console.error('Failed to update user role:', error)
    throw error
  }
}

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await adminApi.delete(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw error
  }
}

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await adminApi.patch(`/appointments/${appointmentId}/status`, { status })
    return response.data
  } catch (error) {
    console.error('Failed to update appointment status:', error)
    throw error
  }
}

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await adminApi.delete(`/appointments/${appointmentId}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete appointment:', error)
    throw error
  }
}

export default adminApi