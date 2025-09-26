import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

import { User, Heart, Calendar, Home, Settings, Bell, TrendingUp, Eye, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllBuildings } from '../api/buildingApi'
import UserActivityService from '../services/UserActivityService'

import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [favoriteBuildings, setFavoriteBuildings] = useState([])
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalAppointments: 0,
    propertiesViewed: 0,
    profileViews: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Initialize user data if this is their first time
      if (user?.id || user?.email) {
        UserActivityService.initializeUserData(user.id || user.email)
      }

      // Get real user activity data
      const activityStats = UserActivityService.getDashboardStats()
      
      // Fetch favorite buildings from localStorage (user-specific)
      const storedFavorites = UserActivityService.getFavorites()
      setFavoriteBuildings(storedFavorites)

      // Get appointments from localStorage (user-specific)
      const storedAppointments = UserActivityService.getAppointments()
      setAppointments(storedAppointments)

      // Set real stats
      setStats({
        totalFavorites: activityStats.totalFavorites,
        totalAppointments: activityStats.totalAppointments,
        propertiesViewed: activityStats.propertiesViewed,
        profileViews: activityStats.profileViews
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      // Simulate profile view tracking (in real app, this would be when others view your profile)
      UserActivityService.trackProfileView()
    }
  }, [fetchDashboardData, user])

  // Function to refresh dashboard data
  const refreshDashboard = () => {
    fetchDashboardData()
  }

  const formatPrice = (price) => {
    return '₹' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const quickStats = [
    {
      icon: Heart,
      label: 'Saved Properties',
      value: stats.totalFavorites,
      color: 'bg-red-500'
    },
    {
      icon: Calendar,
      label: 'Appointments',
      value: stats.totalAppointments,
      color: 'bg-blue-500'
    },
    {
      icon: Eye,
      label: 'Properties Viewed',
      value: stats.propertiesViewed,
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Profile Views',
      value: stats.profileViews,
      color: 'bg-purple-500'
    }
  ]

  const renderFavorites = () => {
    if (favoriteBuildings.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-6">
            Start exploring properties and add them to your favorites for quick access
          </p>
          <Link to="/" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      )
    }

    return (
      <div className="grid gap-6">
        {favoriteBuildings.map((building) => (
          <div key={building.id} className="card p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-48 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
              {building.images && building.images.length > 0 ? (
                <img
                  src={building.images[0]}
                  alt={building.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">{building.name}</h4>
                  <p className="text-gray-600 mb-2">{building.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(building.cost)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      building.type === 'apartment' ? 'bg-blue-100 text-blue-800' :
                      building.type === 'office' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {building.type?.charAt(0).toUpperCase() + building.type?.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-4">
                  <Link
                    to={`/building/${building.id}`}
                    className="btn-secondary flex items-center space-x-1 text-sm px-3 py-2"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                  <Link
                    to={`/building/${building.id}#appointment`}
                    className="btn-primary flex items-center space-x-1 text-sm px-3 py-2"
                  >
                    <Calendar size={16} />
                    <span>Book</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Calendar className="text-primary-600" size={28} />
          <span>Your Appointments ({appointments.length})</span>
        </h3>
        <button 
          onClick={refreshDashboard}
          className="btn-secondary text-sm px-3 py-2"
        >
          Refresh
        </button>
      </div>
      
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Property Viewing - {appointment.buildingName}
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <p className="flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Date: {new Date(appointment.appointmentTime).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">⏰</span>
                      Time: {new Date(appointment.appointmentTime).toLocaleTimeString()}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="mr-2" size={16} />
                      Location: {appointment.buildingLocation}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">💻</span>
                      Mode: {appointment.mode === 'physical' ? 'In-Person Visit' : 'Virtual Tour'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No appointments scheduled</p>
          <Link to="/" className="btn-primary">
            Browse Properties to Book Appointments
          </Link>
        </div>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <motion.div
              className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name || 'User'}!
                  </h2>
                  <p className="text-white/90 text-lg">
                    Here's what's happening with your property search
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-full">
                  <User className="h-12 w-12" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bell className="text-primary-600" size={24} />
                  <span>Quick Actions</span>
                </h3>
                <button 
                  onClick={refreshDashboard}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Refresh Data
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/" className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <Home className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Browse Properties</h4>
                  <p className="text-sm text-gray-600">Discover new properties</p>
                </Link>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                >
                  <Heart className="h-8 w-8 text-red-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">My Favorites</h4>
                  <p className="text-sm text-gray-600">View saved properties</p>
                </button>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">Appointments</h4>
                  <p className="text-sm text-gray-600">Manage your visits</p>
                </button>
              </div>
            </motion.div>
          </div>
        )

      case 'favorites':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Heart className="text-red-500" size={28} />
                <span>Your Favorites ({favoriteBuildings.length})</span>
              </h3>
              <button 
                onClick={refreshDashboard}
                className="btn-secondary text-sm px-3 py-2"
              >
                Refresh
              </button>
            </div>
            {renderFavorites()}
          </motion.div>
        )

      case 'appointments':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderAppointments()}
          </motion.div>
        )

      case 'settings':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Settings className="text-primary-600" size={28} />
              <span>Account Settings</span>
            </h3>

            <div className="grid gap-6">
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-gray-900">Profile Information</h4>
                  <div className="text-sm text-gray-500">
                    User ID: {user?.id || user?.email}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="card p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-lg font-medium text-gray-900">Email Notifications</h5>
                      <p className="text-gray-600">Receive updates about new properties and appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="card p-8 bg-red-50 border-red-200">
                <h4 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h4>
                <p className="text-red-700 mb-4">Clear all your dashboard data (favorites, appointments, etc.)</p>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure? This will clear all your dashboard data.')) {
                      UserActivityService.clearUserData()
                      refreshDashboard()
                      toast.success('User data cleared successfully')
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear My Data
                </button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard