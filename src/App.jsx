import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import EmailService from './services/EmailService'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const BuildingPage = lazy(() => import('./pages/BuildingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function App() {
  useEffect(() => {
    // Initialize EmailJS when app starts
    EmailService.init()
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen gradient-bg">
          <Header />
          <main className="min-h-screen">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/building/:id" element={<BuildingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App