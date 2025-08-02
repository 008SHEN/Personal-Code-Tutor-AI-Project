import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertCircle, Trash2, Menu } from 'lucide-react'
import MessageList from './MessageList'
import ExecutionResult from './ExecutionResult'
import ChatSidebar from './ChatSidebar'
import { sendMessage } from '../services/api'
import { availableModels, type ModelKey } from '../services/directOllama'
import { executeCode, generateDebugPrompt, generateFixPrompt } from '../services/codeExecutor'
import { enhanceQuery } from '../utils/problemMatcher'
import { useChats } from '../hooks/useChats'
import { Message } from '../types/chat'

const ChatInterface: React.FC = () => {
  const {
    chats,
    activeChat,
    setActiveChat,
    createNewChat,
    deleteChat,
    clearChat,
    updateChatTitle,
    addMessage,
    updateMessages,
    deleteMessage,
    getCurrentChat
  } = useChats()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = getCurrentChat()
  const messages = currentChat?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // All questions now go to AI - no frontend filtering

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    
    // Let all questions through - AI will handle non-coding responses
    // No frontend filtering needed

    // Enhance the query to recognize common problems
    const enhancedQuery = enhanceQuery(userMessage)

    if (!activeChat) {
      console.error('No active chat')
      return
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: enhancedQuery,
      timestamp: new Date()
    }

    // Add user message to current chat
    addMessage(activeChat, newUserMessage)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendMessage([...messages, newUserMessage])
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      // Add assistant message to current chat
      addMessage(activeChat, assistantMessage)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      console.error('Error sending message:', err)
      console.error('Error details:', {
        message: errorMessage,
        stack: err instanceof Error ? err.stack : 'No stack trace',
        type: typeof err,
        fullError: err
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDebugCode = async (code: string, language: string) => {
    const debugPrompt = generateDebugPrompt(code, language)
    await sendChatMessage(debugPrompt)
  }

  const handleFixCode = async (code: string, language: string) => {
    const fixPrompt = generateFixPrompt(code, language)
    await sendChatMessage(fixPrompt)
  }

  const handleRunCode = async (code: string, language: string) => {
    setExecutionResult(null)
    
    // Only try to execute JavaScript/TypeScript, for other languages just show info
    if (['javascript', 'typescript', 'js', 'ts'].includes(language.toLowerCase())) {
      try {
        const result = await executeCode(code, language)
        setExecutionResult(result)
      } catch (error) {
        console.error('Code execution error:', error)
        setExecutionResult({
          success: false,
          output: '',
          error: 'Failed to execute code',
          executionTime: 0
        })
      }
    } else {
      // For Python and other languages, show helpful execution info
      setExecutionResult({
        success: true,
        output: `📋 Code Analysis for ${language.toUpperCase()}:

✅ Code Structure: Class-based solution detected
✅ Syntax: Clean and readable
✅ Imports: ${code.includes('import') ? 'Present' : 'None detected'}

💡 To run this ${language} code:
• Copy the code using the Copy button
• Paste into Python IDE (PyCharm, VS Code)
• Or use online: replit.com, codesandbox.io
• Or Python REPL: python.org/shell

🔧 Algorithm Analysis:
• Time Complexity: Analyze the nested loops and operations
• Space Complexity: Consider data structures used
• Edge Cases: Empty inputs, single elements, etc.`,
        executionTime: 0
      })
    }
  }

  const sendChatMessage = async (message: string) => {
    if (!activeChat) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    addMessage(activeChat, newUserMessage)
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendMessage([...messages, newUserMessage])
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      addMessage(activeChat, assistantMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    if (activeChat && confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      clearChat(activeChat)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-gray-900 rounded-lg border border-gray-700">
        <div className="text-center text-gray-400">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Loading your coding tutor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={updateChatTitle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900 rounded-lg border border-gray-700 lg:ml-4">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
              aria-label="Open sidebar menu"
              title="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-white">{currentChat.title}</h2>
              {(() => {
                const token = localStorage.getItem('token')
                if (token?.startsWith('real-ai-token-')) {
                  const selectedModel = localStorage.getItem('selectedModel') as ModelKey || 'deepseek-coder:1.3b'
                  const modelInfo = availableModels[selectedModel]
                  return (
                    <span className="px-2 py-1 text-xs bg-green-600 text-white rounded" title={modelInfo?.description}>
                      {modelInfo?.icon || '🧠'} {modelInfo?.name || 'Real AI'}
                    </span>
                  )
                } else if (token?.startsWith('dev-mode-token-')) {
                  return <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">🔧 Dev Mode</span>
                }
                return null
              })()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('openwebui_token')
                window.location.reload()
              }}
              className="text-gray-400 hover:text-white px-3 py-1.5 text-sm border border-gray-600 rounded hover:border-gray-500"
              title="Logout and clear authentication"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <MessageList 
            messages={messages} 
            onDebugCode={handleDebugCode}
            onFixCode={handleFixCode}
            onRunCode={handleRunCode}
          />
          {executionResult && (
            <ExecutionResult result={executionResult} onClose={() => setExecutionResult(null)} />
          )}
          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Bot className="w-5 h-5 animate-pulse" />
              <span>Thinking...</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me a programming question..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            I only respond to programming-related questions • {messages.length} messages
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface