import React, { useState } from 'react'
import { Plus, MessageSquare, Trash2, Edit2, X, Check } from 'lucide-react'
import { Chat } from '../types/chat'
import { clsx } from 'clsx'

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onRenameChat: (chatId: string, newTitle: string) => void
  isOpen: boolean
  onClose: () => void
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isOpen,
  onClose
}) => {
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleStartEdit = (chat: Chat) => {
    setEditingChat(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveEdit = () => {
    if (editingChat && editTitle.trim()) {
      onRenameChat(editingChat, editTitle.trim())
    }
    setEditingChat(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingChat(null)
    setEditTitle('')
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0 lg:z-auto'
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chats
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No chats yet. Create your first chat!
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={clsx(
                    'group relative p-3 rounded-lg cursor-pointer transition-colors',
                    activeChat === chat.id
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'hover:bg-gray-800'
                  )}
                  onClick={() => onSelectChat(chat.id)}
                >
                  {editingChat === chat.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit()
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-400 hover:text-green-300 p-1"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate text-sm">
                            {chat.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(chat.updatedAt)} • {chat.messages.length} messages
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartEdit(chat)
                            }}
                            className="text-gray-400 hover:text-white p-1"
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm('Are you sure you want to delete this chat?')) {
                                onDeleteChat(chat.id)
                              }
                            }}
                            className="text-gray-400 hover:text-red-400 p-1"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Preview of last message */}
                      {chat.messages.length > 1 && (
                        <p className="text-gray-500 text-xs mt-2 truncate">
                          {chat.messages[chat.messages.length - 1].content.slice(0, 50)}...
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Code Tutor AI v1.0
          </p>
        </div>
      </div>
    </>
  )
}

export default ChatSidebar