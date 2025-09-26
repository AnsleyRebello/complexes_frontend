import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, Eye, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllBuildings } from '../api/buildingApi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FavoritesList = () => {
  const { user } = useAuth()
  const [favoriteBuildings, setFavoriteBuildings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavoriteBuildings = useCallback(async () => {
    try {
      if (user?.favoriteBuildingIds?.length > 0) {
        const allBuildings = await getAllBuildings()
        const favorites = allBuildings.filter(building => 
          user.favoriteBuildingIds.includes(building.id)
        )
        setFavoriteBuildings(favorites)
      } else {
        setFavoriteBuildings([])
      }
    } catch (error) {
      console.error('Failed to load favorite buildings:', error)
      toast.error('Failed to load favorite buildings')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFavoriteBuildings()
  }, [fetchFavoriteBuildings])

  const removeFavorite = (buildingId) => {
    setFavoriteBuildings(prev => prev.filter(building => building.id !== buildingId))
    toast.success('Removed from favorites')
  }

  const formatPrice = (price) => {
    return '₹' + new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (favoriteBuildings.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600 mb-6">
          Start exploring properties and add them to your favorites for quick access
        </p>
        <Link to="/" className="btn-primary">
          Browse Properties
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
        <Heart className="text-red-500" size={28} />
        <span>Your Favorites ({favoriteBuildings.length})</span>
      </h3>

      <div className="grid gap-6">
        <AnimatePresence>
          {favoriteBuildings.map((building) => (
            <motion.div
              key={building.id}
              className="card p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              {/* Image */}
              <div className="w-full md:w-48 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                {building.images && building.images.length > 0 ? (
                  <img
                    src={building.images[0]}
                    alt={building.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-property.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Home className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">{building.name}</h4>
                    <p className="text-gray-600 mb-2">{building.location}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{building.description}</p>
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

                  {/* Actions */}
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
                    <motion.button
                      onClick={() => removeFavorite(building.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FavoritesList