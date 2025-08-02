import React, { useState, useEffect } from 'react'
import { Key, CheckCircle, AlertCircle, Zap, Activity } from 'lucide-react'
import { testOllamaConnection, getOllamaModels, availableModels, type ModelKey } from '../services/directOllama'

interface AuthSetupProps {
  onAuthComplete: () => void
}

const AuthSetup: React.FC<AuthSetupProps> = ({ onAuthComplete }) => {
  const [apiKey, setApiKey] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'connected' | 'disconnected' | 'unknown'>('unknown')
  const [availableModelsList, setAvailableModelsList] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelKey>('deepseek-coder:1.3b')

  useEffect(() => {
    // Check Ollama connection on component mount
    checkOllamaConnection()
  }, [])

  const checkOllamaConnection = async () => {
    setOllamaStatus('checking')
    try {
      const isConnected = await testOllamaConnection()
      if (isConnected) {
        setOllamaStatus('connected')
              const models = await getOllamaModels()
      setAvailableModelsList(models)
      } else {
        setOllamaStatus('disconnected')
      }
    } catch (error) {
      console.error('Ollama connection check failed:', error)
      setOllamaStatus('disconnected')
    }
  }

  useEffect(() => {
    // Check if there's already a valid token
    const existingToken = localStorage.getItem('token') || localStorage.getItem('openwebui_token')
    if (existingToken) {
      setApiKey(existingToken)
      checkToken(existingToken)
    }
  }, [])

  const checkToken = async (token: string) => {
    if (!token.trim()) {
      setIsValid(false)
      setError('')
      return
    }

    setIsChecking(true)
    setError('')

    try {
      // Test the token by making a simple API call
      const response = await fetch('http://localhost:8080/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsValid(true)
        localStorage.setItem('token', token)
        setError('')
      } else {
        setIsValid(false)
        setError(`Invalid token (Status: ${response.status})`)
      }
    } catch (err) {
      setIsValid(false)
      setError('Cannot connect to Open WebUI backend')
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onAuthComplete()
    } else {
      checkToken(apiKey)
    }
  }

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setApiKey(value)
    
    // Auto-check token after user stops typing
    setTimeout(() => checkToken(value), 500)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Key className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Open WebUI Authentication</h1>
          <p className="text-gray-400">Enter your Open WebUI API key or token to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              API Key / Token
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={handleKeyChange}
              placeholder="Enter your Open WebUI token..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {isChecking && (
            <div className="flex items-center text-yellow-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
              Checking token...
            </div>
          )}

          {isValid && (
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              Token is valid!
            </div>
          )}

          {error && (
            <div className="flex items-center text-red-400">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isChecking}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isValid && !isChecking
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isValid ? 'Continue to Code Tutor AI' : 'Validate Token'}
          </button>
        </form>

        {/* Ollama Status */}
        <div className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" />
            <h3 className="text-sm font-medium text-white">Ollama Connection Status</h3>
            <button 
              onClick={checkOllamaConnection}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300"
            >
              Refresh
            </button>
          </div>
          
          {ollamaStatus === 'checking' && (
            <div className="flex items-center text-yellow-400 text-xs">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-400 mr-2"></div>
              Checking Ollama connection...
            </div>
          )}
          
          {ollamaStatus === 'connected' && (
            <div className="text-xs">
              <div className="flex items-center text-green-400 mb-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ollama is running (port 11434)
              </div>
              <div className="text-gray-400">
                Models: {availableModels.length > 0 ? availableModels.join(', ') : 'Loading...'}
              </div>
            </div>
          )}
          
          {ollamaStatus === 'disconnected' && (
            <div className="text-xs">
              <div className="flex items-center text-red-400 mb-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                Ollama not running
              </div>
              <div className="text-gray-400">
                Start with: <code className="bg-gray-700 px-1 rounded">ollama serve</code>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className={`p-4 border rounded-md ${
            ollamaStatus === 'connected' 
              ? 'bg-green-900/20 border-green-600' 
              : 'bg-gray-800 border-gray-600 opacity-50'
          }`}>
            <h3 className="text-sm font-medium text-green-400 mb-2">🤖 Real AI Mode (Recommended)</h3>
            <p className="text-xs text-gray-300 mb-3">
              Choose your AI model for real coding assistance:
            </p>
            
            {/* Model Selection Dropdown */}
            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">Select AI Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelKey)}
                className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Select AI model for coding assistance"
              >
                {Object.entries(availableModels).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.icon} {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                const realToken = `real-ai-token-${selectedModel}-${Date.now()}`
                setApiKey(realToken)
                localStorage.setItem('token', realToken)
                localStorage.setItem('selectedModel', selectedModel)
                setIsValid(true)
                setError('')
              }}
              className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              {availableModels[selectedModel].icon} Use {availableModels[selectedModel].name}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              {ollamaStatus === 'connected' 
                ? `This connects to your Ollama backend with ${availableModels[selectedModel].name} for real coding help.`
                : 'Connection test may fail due to timeouts, but Ollama might still work. Try this button!'
              }
            </p>
          </div>

          <div className="p-4 bg-blue-900/20 border border-blue-600 rounded-md">
            <h3 className="text-sm font-medium text-blue-400 mb-2">🔧 Development Mode</h3>
            <p className="text-xs text-gray-300 mb-3">
              Use mock responses for testing (no real AI):
            </p>
            <button
              onClick={() => {
                const devToken = 'dev-mode-token-' + Date.now()
                setApiKey(devToken)
                localStorage.setItem('token', devToken)
                setIsValid(true)
                setError('')
              }}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
            >
              🚀 Use Development Mode
            </button>
            <p className="text-xs text-gray-400 mt-2">
              This uses mock responses for testing without connecting to AI.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-sm font-medium text-white mb-2">Manual Token Entry:</h3>
          <p className="text-xs text-gray-300 mb-2">
            If you have an API key from another Open WebUI instance, enter it above.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthSetup