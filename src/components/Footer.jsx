import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'


const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Clement Regency Developers</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted partner in finding the perfect property. We connect dreams with reality through premium real estate solutions.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {['Properties', 'About Us', 'Services', 'Contact', 'Blog'].map((link, index) => (
                <Link
                  key={index}
                  to="/"
                  className="block text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={18} />
                <span>Shop No. 5 & 6, The Woods, Juniper, Wing-A, Brahman Ali, Papdy, Vasai</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={18} />
                <span>+91 98500 19171</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={18} />
                <span>rebelloneville@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>&copy; {currentYear} Clement Regency Developers. All rights reserved. Built with ❤️ for your real estate needs.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer;