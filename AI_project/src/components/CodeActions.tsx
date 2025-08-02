import React, { useState } from 'react'
import { Play, Bug, Wrench, Copy, Check } from 'lucide-react'

interface CodeActionsProps {
  code: string
  language: string
  onDebug: (code: string) => void
  onFix: (code: string) => void
  onRun: (code: string) => void
}

const CodeActions: React.FC<CodeActionsProps> = ({ 
  code, 
  language, 
  onDebug, 
  onFix, 
  onRun 
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code)
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
      // Try fallback method
      try {
        const textArea = document.createElement('textarea')
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('All copy methods failed:', fallbackErr)
      }
    }
  }

  const canRun = ['python', 'javascript', 'typescript', 'js', 'ts', 'py'].includes(language.toLowerCase())

  return (
    <div className="flex items-center justify-between bg-gray-700 px-3 py-2 text-xs">
      <span className="text-gray-300">{language || 'code'}</span>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onDebug(code)}
          className="flex items-center space-x-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
          title="Debug this code"
        >
          <Bug className="w-3 h-3" />
          <span>Debug</span>
        </button>
        
        <button
          onClick={() => onFix(code)}
          className="flex items-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          title="Auto-fix issues"
        >
          <Wrench className="w-3 h-3" />
          <span>Fix</span>
        </button>
        
        {canRun && (
          <button
            onClick={() => onRun(code)}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            title="Run this code"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
        )}
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CodeActions