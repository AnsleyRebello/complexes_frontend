import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'ui-vendor': ['react-hot-toast', 'lucide-react'],
          
          // Feature-based chunks
          'auth-features': [
            './src/context/AuthContext.jsx',
            './src/pages/LoginPage.jsx',
            './src/pages/RegisterPage.jsx'
          ],
          'dashboard-features': [
            './src/pages/Dashboard.jsx',
            './src/pages/AdminPage.jsx'
          ],
          'property-features': [
            './src/pages/HomePage.jsx',
            './src/pages/BuildingPage.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase warning limit to 1MB
  }
})
