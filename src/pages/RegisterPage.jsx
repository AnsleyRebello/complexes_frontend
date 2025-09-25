// src/pages/RegisterPage.jsx
import React from 'react'
import { motion } from 'framer-motion'

import { Link } from 'react-router-dom'
import { Home, Star, TrendingUp, Award, Users } from 'lucide-react'
import RegisterForm from '../components/RegisterForm'

const RegisterPage = () => {
  const stats = [
    { label: 'Properties Listed', value: '500+' },
    { label: 'Happy Clients', value: '1000+' },
    { label: 'Cities Covered', value: '10+' },
    { label: 'Awards Won', value: '25+' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      content: 'Clement Regency Developers made finding my dream home incredibly easy. The platform is intuitive and the team is very professional.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Investor',
      content: 'The best real estate platform I\'ve used. Great property selection and excellent customer service.',
      rating: 5
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Get real-time market data and property trends'
    },
    {
      icon: Award,
      title: 'Premium Service',
      description: 'Award-winning customer service and support'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Professional agents to guide you through your journey'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">Clement Regency Developers</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Start Your
                <span className="block text-primary-600">Property Journey</span>
              </h1>
              <p className="text-xl text-gray-600">
                Join thousands of users who trust Clement Regency Developers for their real estate needs
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                What Our Users Say
              </h3>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl"
                >
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2 italic">"{testimonial.content}"</p>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <span className="text-gray-600"> - {testimonial.role}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="p-6 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Already have an account?
              </h3>
              <p className="text-gray-600 mb-4">
                Sign in to access your dashboard and saved properties.
              </p>
              <Link to="/login" className="btn-secondary inline-block">
                Sign In Instead
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Register Form */}
          <div className="flex justify-center">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage