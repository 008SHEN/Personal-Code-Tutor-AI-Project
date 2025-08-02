import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import AuthSetup from './components/AuthSetup'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user has a valid token on app load
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('openwebui_token')
    
    if (!token) {
      setIsAuthenticated(false)
      setIsChecking(false)
      return
    }

    try {
      // Verify the token is still valid
      const response = await fetch('http://localhost:8080/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('openwebui_token')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleAuthComplete = () => {
    setIsAuthenticated(true)
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AuthSetup onAuthComplete={handleAuthComplete} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
          <header className="text-center py-4 px-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-blue-400">Code Tutor AI</h1>
            <p className="text-gray-400 mt-1 text-sm">Your programming mentor powered by Ollama</p>
          </header>
          <main className="flex-1 p-4">
            <ChatInterface />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App