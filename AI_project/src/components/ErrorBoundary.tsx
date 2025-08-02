import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              The Code Tutor AI encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReload}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mx-auto transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
            {this.state.error && (
              <details className="mt-4 text-left bg-gray-800 p-4 rounded text-sm">
                <summary className="cursor-pointer text-gray-300">Error Details</summary>
                <pre className="mt-2 text-red-300 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary