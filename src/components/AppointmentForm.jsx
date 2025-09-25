import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { Calendar, Clock, MapPin, Monitor, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { bookAppointment } from '../api/appointmentApi'
import { useAuth } from '../context/AuthContext'
import UserActivityService from '../services/UserActivityService'
import EmailService from '../services/EmailService'
import toast from 'react-hot-toast'

const AppointmentForm = ({ building }) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    appointmentTime: '',
    mode: 'physical'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const appointmentData = {
        userId: user.id,
        userName: user.name || user.email.split('@')[0],
        userEmail: user.email,
        userPhone: user.phone || '+91 98765 43210', // Default phone if not available
        buildingId: building.id,
        buildingName: building.name,
        buildingLocation: building.location,
        appointmentTime: formData.appointmentTime,
        mode: formData.mode,
        message: formData.message || 'Looking forward to viewing this property.'
      }

      // Store appointment locally
      const savedAppointment = UserActivityService.storeAppointment(appointmentData)
      
      // Send email notification to admin
      const emailResult = await EmailService.sendAppointmentNotification(appointmentData)
      
      if (emailResult.success) {
        if (emailResult.message.includes('EmailJS')) {
          toast.success('✅ Appointment booked! Real email sent to admin.')
        } else {
          toast.success('📝 Appointment booked! Email logged to console (EmailJS not configured).')
          console.info('🔧 To enable real emails, check EMAIL_SETUP_GUIDE.md')
        }
      } else {
        toast.success('Appointment booked successfully!')
        console.warn('Email notification failed:', emailResult.message)
      }

      // Try to book via API (optional - will work with backend when available)
      try {
        await bookAppointment(appointmentData)
      } catch (apiError) {
        console.log('API booking failed (expected without backend):', apiError.message)
      }

      setFormData({
        appointmentTime: '',
        mode: 'physical',
        message: ''
      })
    } catch (error) {
      console.error('Failed to book appointment:', error)
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const minDateTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)

  return (
    <motion.div
      id="appointment"
      className="card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="text-primary-600" size={28} />
        <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-1">{building.name}</h4>
            <p className="text-gray-600 mb-2">{building.location}</p>
            <p className="text-sm text-gray-500">
              Schedule a visit to explore this amazing {building.type} property
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Date & Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="datetime-local"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              min={minDateTime}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Meeting Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Meeting Preference
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.label
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.mode === 'physical'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="mode"
                value="physical"
                checked={formData.mode === 'physical'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex flex-col items-center text-center">
                <MapPin className={`mb-2 ${formData.mode === 'physical' ? 'text-primary-600' : 'text-gray-400'}`} size={24} />
                <span className={`font-medium ${formData.mode === 'physical' ? 'text-primary-900' : 'text-gray-700'}`}>
                  In-Person Visit
                </span>
                <span className="text-sm text-gray-500 mt-1">Visit the property</span>
              </div>
            </motion.label>

            <motion.label
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.mode === 'online'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="mode"
                value="online"
                checked={formData.mode === 'online'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex flex-col items-center text-center">
                <Monitor className={`mb-2 ${formData.mode === 'online' ? 'text-primary-600' : 'text-gray-400'}`} size={24} />
                <span className={`font-medium ${formData.mode === 'online' ? 'text-primary-900' : 'text-gray-700'}`}>
                  Virtual Tour
                </span>
                <span className="text-sm text-gray-500 mt-1">Online meeting</span>
              </div>
            </motion.label>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Calendar size={18} />
              <span>Book Appointment</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Booking Information</p>
            <p>• Appointments must be scheduled at least 24 hours in advance</p>
            <p>• You'll receive an email confirmation with further details</p>
            <p>• Our team will contact you to confirm the appointment</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AppointmentForm