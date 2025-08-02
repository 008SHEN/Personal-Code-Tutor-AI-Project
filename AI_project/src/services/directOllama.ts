import axios from 'axios'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Available models
export const availableModels = {
  'deepseek-coder:1.3b': { name: 'DeepSeek Coder 1.3b', description: '⚡ Fast & Lightweight (776MB)', icon: '🚀' },
  'mistral:latest': { name: 'Mistral Latest', description: '🧠 Powerful but Slower (4.4GB)', icon: '🤖' },
  'llama3.2:latest': { name: 'Llama 3.2', description: '🦙 Balanced Performance (2GB)', icon: '🦙' }
} as const

export type ModelKey = keyof typeof availableModels

// Direct connection to Ollama bypassing Open WebUI entirely
export const sendDirectOllamaMessage = async (messages: Message[], model: ModelKey = 'deepseek-coder:1.3b'): Promise<string> => {
  try {
    console.log('🤖 Connecting directly to Ollama (bypassing Open WebUI)...')
    console.log('📤 Sending messages:', messages)
    
    const requestBody = {
      model: model,
      messages: messages,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: model.includes('deepseek') ? 2048 : 4096 // Smaller context for faster models
      }
    }
    
    console.log(`🎯 Using model: ${availableModels[model].name} (${model})`)
    
    console.log('📋 Request body:', JSON.stringify(requestBody, null, 2))
    
    // Try direct connection first, then proxy fallback
    let response
    try {
      console.log('🔗 Attempting direct connection to Ollama...')
      response = await axios.post('http://localhost:11434/api/chat', requestBody, {
        timeout: 120000, // 2 minute timeout for complex questions
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: false,
      })
    } catch (directError) {
      console.log('🔄 Direct connection failed, trying proxy...', directError)
      // Fallback to Vite dev server proxy
      response = await axios.post('/direct-ollama/api/chat', requestBody, {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: false,
      })
    }

    console.log('📥 Ollama response:', response.data)
    
    if (response.data?.message?.content) {
      console.log('✅ Successfully extracted response content')
      return response.data.message.content
    } else {
      console.error('❌ Invalid response format:', response.data)
      throw new Error(`Invalid response format from Ollama. Got: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    console.error('Direct Ollama connection error:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('❌ Cannot connect to Ollama. Please start Ollama:\n\n1. Run: ollama serve\n2. Make sure Mistral is installed: ollama pull mistral')
      } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        throw new Error('⏱️ Connection timeout. Ollama might be processing a complex request. Please try again.')
      } else if (error.response?.status === 404) {
        throw new Error('🔍 Model not found. Please install Mistral: ollama pull mistral')
      } else {
        throw new Error(`🚨 Ollama error: ${error.message}`)
      }
    }
    
    throw new Error('🔧 Failed to connect to Ollama. Please check that Ollama is running.')
  }
}

// Test connection to Ollama
export const testOllamaConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get('http://localhost:11434/api/version', {
      timeout: 10000, // Increased timeout to 10 seconds
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('Ollama connection test successful:', response.data)
    return response.status === 200
  } catch (error) {
    console.error('Ollama connection test failed:', error)
    // Even if test fails, Ollama might still be working
    // Let's try a simple version check
    try {
      const fallbackResponse = await fetch('http://localhost:11434/api/version')
      return fallbackResponse.ok
    } catch (fallbackError) {
      console.error('Fallback test also failed:', fallbackError)
      return false
    }
  }
}

// Get available models from Ollama
export const getOllamaModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 10000
    })
    
    if (response.data?.models) {
      return response.data.models.map((model: any) => model.name)
    }
    return []
  } catch (error) {
    console.error('Failed to get Ollama models:', error)
    return []
  }
}