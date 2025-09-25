// User activity tracking service for dashboard stats
export class UserActivityService {
  static STORAGE_KEYS = {
    VIEWED_PROPERTIES: 'user_viewed_properties',
    PROFILE_VIEWS: 'user_profile_views',
    APPOINTMENTS: 'user_appointments',
    FAVORITES: 'user_favorites'
  }

  // Get user-specific storage key
  static getUserStorageKey(baseKey, userId) {
    return `${baseKey}_${userId}`
  }

  // Get current user ID from localStorage or context
  static getCurrentUserId() {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.id || user.email // Use ID or email as fallback
      }
    } catch (error) {
      console.error('Error getting current user ID:', error)
    }
    return 'anonymous'
  }

  // Track property view
  static trackPropertyView(buildingId, buildingName) {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.VIEWED_PROPERTIES, userId)
    const viewedProperties = this.getViewedProperties()
    const existingView = viewedProperties.find(v => v.buildingId === buildingId)
    
    if (existingView) {
      existingView.viewCount++
      existingView.lastViewed = new Date().toISOString()
    } else {
      viewedProperties.push({
        buildingId,
        buildingName,
        viewCount: 1,
        firstViewed: new Date().toISOString(),
        lastViewed: new Date().toISOString()
      })
    }
    
    localStorage.setItem(storageKey, JSON.stringify(viewedProperties))
    return viewedProperties.length
  }

  // Get viewed properties for current user
  static getViewedProperties() {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.VIEWED_PROPERTIES, userId)
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : []
  }

  // Get total properties viewed count
  static getViewedPropertiesCount() {
    return this.getViewedProperties().length
  }

  // Track profile view (simulated)
  static trackProfileView() {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.PROFILE_VIEWS, userId)
    const currentViews = this.getProfileViews()
    const newCount = currentViews + 1
    localStorage.setItem(storageKey, newCount.toString())
    return newCount
  }

  // Get profile views for current user
  static getProfileViews() {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.PROFILE_VIEWS, userId)
    const stored = localStorage.getItem(storageKey)
    return stored ? parseInt(stored, 10) : Math.floor(Math.random() * 20) + 5 // Initial random count between 5-25
  }

  // Store appointment for current user
  static storeAppointment(appointmentData) {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.APPOINTMENTS, userId)
    const appointments = this.getAppointments()
    const newAppointment = {
      id: Date.now(),
      userId: userId,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    appointments.push(newAppointment)
    localStorage.setItem(storageKey, JSON.stringify(appointments))
    return newAppointment
  }

  // Get appointments for current user
  static getAppointments() {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.APPOINTMENTS, userId)
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : []
  }

  // Update appointment status
  static updateAppointmentStatus(appointmentId, status) {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.APPOINTMENTS, userId)
    const appointments = this.getAppointments()
    const appointment = appointments.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = status
      appointment.updatedAt = new Date().toISOString()
      localStorage.setItem(storageKey, JSON.stringify(appointments))
    }
    return appointments
  }

  // Store favorite for current user
  static addToFavorites(buildingId, buildingData) {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.FAVORITES, userId)
    const favorites = this.getFavorites()
    if (!favorites.find(f => f.id === buildingId)) {
      favorites.push({
        id: buildingId,
        ...buildingData,
        addedAt: new Date().toISOString()
      })
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    }
    return favorites
  }

  // Remove from favorites
  static removeFromFavorites(buildingId) {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.FAVORITES, userId)
    const favorites = this.getFavorites()
    const updated = favorites.filter(f => f.id !== buildingId)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    return updated
  }

  // Get favorites for current user
  static getFavorites() {
    const userId = this.getCurrentUserId()
    const storageKey = this.getUserStorageKey(this.STORAGE_KEYS.FAVORITES, userId)
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : []
  }

  // Get dashboard stats for current user
  static getDashboardStats() {
    return {
      totalFavorites: this.getFavorites().length,
      totalAppointments: this.getAppointments().length,
      propertiesViewed: this.getViewedPropertiesCount(),
      profileViews: this.getProfileViews()
    }
  }

  // Clear all data for current user
  static clearUserData() {
    const userId = this.getCurrentUserId()
    Object.values(this.STORAGE_KEYS).forEach(key => {
      const userKey = this.getUserStorageKey(key, userId)
      localStorage.removeItem(userKey)
    })
  }

  // Clear all data for all users (for admin/testing)
  static clearAllUsersData() {
    const allKeys = Object.keys(localStorage)
    allKeys.forEach(key => {
      if (Object.values(this.STORAGE_KEYS).some(storageKey => key.includes(storageKey))) {
        localStorage.removeItem(key)
      }
    })
  }

  // Initialize user data when they first log in
  static initializeUserData(userId) {
    const storageKeys = Object.values(this.STORAGE_KEYS)
    storageKeys.forEach(baseKey => {
      const userKey = this.getUserStorageKey(baseKey, userId)
      if (!localStorage.getItem(userKey)) {
        if (baseKey === this.STORAGE_KEYS.PROFILE_VIEWS) {
          // Initialize with a random profile view count
          localStorage.setItem(userKey, (Math.floor(Math.random() * 20) + 5).toString())
        } else {
          // Initialize with empty arrays for other data
          localStorage.setItem(userKey, JSON.stringify([]))
        }
      }
    })
  }
}

export default UserActivityService