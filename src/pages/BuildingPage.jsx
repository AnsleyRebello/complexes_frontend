import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import UserActivityService from '../services/UserActivityService'

import { 
  MapPin, Home, Calendar, Heart, ArrowLeft, 
  Bath, Bed, Car, Wifi, Shield, Dumbbell, ChevronLeft, ChevronRight
} from 'lucide-react'
import { getBuildingById } from '../api/buildingApi'
import { addFavoriteBuilding } from '../api/userApi'
import { useAuth } from '../context/AuthContext'
import AppointmentForm from '../components/AppointmentForm'
import toast from 'react-hot-toast'

const BuildingPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [building, setBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const fetchBuilding = useCallback(async () => {
    if (!id || id === 'null' || id === 'undefined') {
      console.error('No valid building ID provided')
      toast.error('Invalid property ID')
      setLoading(false)
      return
    }

    try {
      const data = await getBuildingById(id)
      setBuilding(data)
    } catch (error) {
      console.error('Failed to load property details:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBuilding()
  }, [fetchBuilding])

  useEffect(() => {
    if (user && building) {
      setIsFavorite(user.favoriteBuildingIds?.includes(building.id) || false)
    }
  }, [user, building])

  // Track property view when building loads
  useEffect(() => {
    if (building) {
      UserActivityService.trackPropertyView(building.id, building.name)
    }
  }, [building])

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return
    }

    try {
      await addFavoriteBuilding(user.id, building.id)
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      console.error('Failed to update favorites:', error)
      toast.error('Failed to update favorites')
    }
  }

  const nextImage = () => {
    if (building.images && building.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === building.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (building.images && building.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? building.images.length - 1 : prev - 1
      )
    }
  }

  const formatPrice = (price) => {
    return '₹' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price)
  }

  const amenities = [
    { icon: Wifi, label: 'High-Speed Internet' },
    { icon: Shield, label: '24/7 Security' },
    { icon: Car, label: 'Parking Available' },
    { icon: Dumbbell, label: 'Fitness Center' },
    { icon: Bath, label: 'Modern Bathrooms' },
    { icon: Bed, label: 'Spacious Bedrooms' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {building.images && building.images.length > 0 ? (
                <>
                  <img
                    src={building.images[currentImageIndex]}
                    alt={building.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-property.jpg'
                    }}
                  />
                  
                  {building.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {building.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Home className="h-24 w-24 text-gray-400" />
                </div>
              )}

              {/* Property Type Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                  building.type === 'apartment' ? 'bg-blue-500' :
                  building.type === 'office' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  {building.type?.charAt(0).toUpperCase() + building.type?.slice(1)}
                </span>
              </div>

              {/* Favorite Button */}
              {isAuthenticated && (
                <motion.button
                  onClick={handleFavoriteToggle}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </motion.button>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              className="card p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {building.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={20} className="mr-2" />
                    <span className="text-lg">{building.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-4xl font-bold text-green-600">
                      {formatPrice(building.cost)}
                    </span>
                  </div>
                  {building.available && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Available Now
                    </span>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {building.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <amenity.icon className="text-primary-600" size={20} />
                      <span className="text-gray-700">{amenity.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Appointment Form */}
            {isAuthenticated ? (
              <AppointmentForm building={building} />
            ) : (
              <motion.div
                className="card p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Book an Appointment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Login to schedule a viewing for this property
                  </p>
                  <div className="space-y-3">
                    <Link to="/login" className="w-full btn-primary block text-center">
                      Login to Book
                    </Link>
                    <Link to="/register" className="w-full btn-secondary block text-center">
                      Create Account
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Property Info Card */}
            <motion.div
              className="card p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="font-medium">{building.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{building.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${building.available ? 'text-green-600' : 'text-red-600'}`}>
                    {building.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              className="card p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Have questions about this property? Our expert team is here to help.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">📞 +1 (555) 123-4567</div>
                  <div className="text-sm text-gray-600">✉️ info@clementregency.com</div>
                </div>
                <button 
                  onClick={() => window.open('tel:+15551234567', '_self')}
                  className="w-full btn-secondary text-sm py-2"
                >
                  Contact Agent
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingPage