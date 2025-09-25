// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Search, Filter, MapPin, TrendingUp, Home, Users, Award, ArrowRight } from 'lucide-react'
import BuildingCard from '../components/BuildingCard'
import { getAllBuildings } from '../api/buildingApi'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [buildings, setBuildings] = useState([])
  const [filteredBuildings, setFilteredBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    minCost: '',
    maxCost: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const data = await getAllBuildings()
      setBuildings(data)
      setFilteredBuildings(data)
    } catch (error) {
      console.error('Failed to load properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(async () => {
    let result = buildings

    // Apply search
    if (searchTerm) {
      result = result.filter(building =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.type) {
      result = result.filter(building => building.type === filters.type)
    }

    if (filters.minCost) {
      result = result.filter(building => building.cost >= parseFloat(filters.minCost))
    }

    if (filters.maxCost) {
      result = result.filter(building => building.cost <= parseFloat(filters.maxCost))
    }

    setFilteredBuildings(result)
  }, [buildings, searchTerm, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      minCost: '',
      maxCost: ''
    })
    setSearchTerm('')
  }

  const stats = [
    { icon: Home, label: 'Properties', value: '500+' },
    { icon: Users, label: 'Happy Clients', value: '1000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: MapPin, label: 'Cities', value: '10+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Find Your
              <span className="block text-accent-400">Dream Property</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover premium real estate opportunities with Clement Regency Developers
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-gray-900 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  />
                </div>
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center space-x-2 text-gray-900"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </motion.button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-200"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-4 py-2 text-gray-900 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="office">Office</option>
                        <option value="villa">Villa</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Min Cost"
                        value={filters.minCost}
                        onChange={(e) => handleFilterChange('minCost', e.target.value)}
                        className="px-4 py-2 text-gray-900 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max Cost"
                        value={filters.maxCost}
                        onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                        className="px-4 py-2 text-gray-900 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600">
                Discover our handpicked selection of premium properties
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredBuildings.length} of {buildings.length} properties
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredBuildings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredBuildings.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    onFavoriteToggle={fetchBuildings}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Home className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who found their perfect home with Clement Regency Developers
            </p>
            <motion.button
              className="bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started Today</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage