import React from 'react'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { clsx } from 'clsx'
import CodeActions from './CodeActions'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MessageListProps {
  messages: Message[]
  onDebugCode: (code: string, language: string) => void
  onFixCode: (code: string, language: string) => void
  onRunCode: (code: string, language: string) => void
}

const MessageList: React.FC<MessageListProps> = ({ messages, onDebugCode, onFixCode, onRunCode }) => {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx(
            'flex items-start space-x-3 p-4 rounded-lg',
            message.role === 'user' 
              ? 'bg-blue-900/30 ml-12' 
              : 'bg-gray-800/50 mr-12'
          )}
        >
          <div className="flex-shrink-0">
            {message.role === 'user' ? (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-300">
                {message.role === 'user' ? 'You' : 'Code Tutor AI'}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : ''
                    const codeContent = String(children).replace(/\n$/, '')
                    
                    return !inline ? (
                      <div className="my-4 border border-gray-600 rounded-lg overflow-hidden">
                        <CodeActions
                          code={codeContent}
                          language={language}
                          onDebug={(code) => onDebugCode(code, language)}
                          onFix={(code) => onFixCode(code, language)}
                          onRun={(code) => onRunCode(code, language)}
                        />
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language || 'text'}
                          PreTag="div"
                          className="!mt-0 !rounded-none"
                          {...props}
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="bg-gray-700 text-blue-300 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre: ({ children }) => (
                    <div className="overflow-x-auto">
                      {children}
                    </div>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-white mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold text-white mb-1">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-200 mb-2 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-200 mb-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-200 mb-2 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-200">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-2">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default MessageList