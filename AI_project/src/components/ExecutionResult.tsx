import React from 'react'
import { CheckCircle, XCircle, Clock, X } from 'lucide-react'
import { clsx } from 'clsx'

interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

interface ExecutionResultProps {
  result: ExecutionResult
  onClose: () => void
}

const ExecutionResult: React.FC<ExecutionResultProps> = ({ result, onClose }) => {
  return (
    <div className={clsx(
      'border rounded-lg p-4 relative',
      result.success 
        ? 'bg-green-900/20 border-green-700' 
        : 'bg-red-900/20 border-red-700'
    )}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        title="Close execution result"
        aria-label="Close execution result"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center space-x-2 mb-3">
        {result.success ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
        <span className={clsx(
          'font-medium',
          result.success ? 'text-green-400' : 'text-red-400'
        )}>
          {result.success ? 'Execution Successful' : 'Execution Failed'}
        </span>
        <div className="flex items-center space-x-1 text-gray-400 text-sm">
          <Clock className="w-3 h-3" />
          <span>{result.executionTime}ms</span>
        </div>
      </div>
      
      {result.success && result.output && (
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-300 mb-1">Output:</h4>
          <pre className="bg-gray-800 text-green-300 p-3 rounded text-sm overflow-x-auto">
            {result.output}
          </pre>
        </div>
      )}
      
      {result.error && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Error:</h4>
          <pre className="bg-gray-800 text-red-300 p-3 rounded text-sm overflow-x-auto">
            {result.error}
          </pre>
        </div>
      )}
      
      {result.success && !result.output && (
        <p className="text-gray-400 text-sm italic">
          Code executed successfully with no output.
        </p>
      )}
    </div>
  )
}

export default ExecutionResult