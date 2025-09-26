import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import UserActivityService from '../services/UserActivityService'
import { MapPin, Home, Heart, Calendar, Eye } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { addFavoriteBuilding } from '../api/userApi'
import toast from 'react-hot-toast'

const BuildingCard = ({ building, onFavoriteToggle }) => {
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(() => {
    // Check localStorage for favorite status
    const favorites = UserActivityService.getFavorites()
    return favorites.some(fav => fav.id === building.id)
  })
  const [imageIndex, setImageIndex] = useState(0)

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return
    }

    try {
      if (isFavorite) {
        UserActivityService.removeFromFavorites(building.id)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        UserActivityService.addToFavorites(building.id, building)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
      
      // Also try the API call (will work when backend is available)
      try {
        await addFavoriteBuilding(user.id, building.id)
      } catch (apiError) {
        console.log('API call failed (expected without backend):', apiError.message)
      }
      
      if (onFavoriteToggle) onFavoriteToggle()
    } catch (error) {
      console.error('Failed to update favorites:', error)
      toast.error('Failed to update favorites')
    }
  }

  const formatPrice = (price) => {
    return '₹' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <motion.div
      className="card overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative">
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden">
          {building.images && building.images.length > 0 ? (
            <img
              src={building.images[imageIndex] || '/placeholder-property.jpg'}
              alt={building.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/placeholder-property.jpg'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Image Navigation */}
          {building.images && building.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {building.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    setImageIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === imageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            building.type === 'apartment' ? 'bg-blue-500' :
            building.type === 'office' ? 'bg-green-500' :
            'bg-purple-500'
          }`}>
            {building.type?.charAt(0).toUpperCase() + building.type?.slice(1)}
          </span>
        </div>

        {/* Availability Badge */}
        {building.available && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
              Available
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <motion.button
          onClick={handleFavoriteToggle}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
        </motion.button>
      </div>

      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {building.name}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{building.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {building.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(building.cost)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/building/${building.id}`}
            className="flex-1 btn-primary text-center flex items-center justify-center space-x-2"
          >
            <Eye size={18} />
            <span>View Details</span>
          </Link>
          {isAuthenticated && (
            <Link
              to={`/building/${building.id}#appointment`}
              className="btn-secondary flex items-center justify-center"
            >
              <Calendar size={18} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BuildingCard