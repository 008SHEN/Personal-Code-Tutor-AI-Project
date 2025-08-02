import { useState, useCallback, useEffect } from 'react'
import { Chat, Message } from '../types/chat'

const STORAGE_KEY = 'code-tutor-chats'
const ACTIVE_CHAT_KEY = 'code-tutor-active-chat'

const getInitialMessage = (): Message => ({
  id: '1',
  role: 'assistant',
  content: 'Hello! I\'m your coding tutor AI. I can help you with:\n\n- Algorithm & data structure problems\n- Code debugging and explanation\n- Syntax, logic, or runtime errors\n- Best practices in programming languages\n- Comparing implementations across languages\n\nWhat programming question can I help you with today?',
  timestamp: new Date()
})

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY)
    const savedActiveChat = localStorage.getItem(ACTIVE_CHAT_KEY)
    
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setChats(parsedChats)
        
        if (savedActiveChat && parsedChats.find((c: Chat) => c.id === savedActiveChat)) {
          setActiveChat(savedActiveChat)
        } else if (parsedChats.length > 0) {
          setActiveChat(parsedChats[0].id)
        }
      } catch (error) {
        console.error('Failed to load chats from localStorage:', error)
        // Create default chat if loading fails
        createNewChat()
      }
    } else {
      // Create first chat if no saved chats
      createNewChat()
    }
  }, [])

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    }
  }, [chats])

  // Save active chat to localStorage
  useEffect(() => {
    if (activeChat) {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChat)
    }
  }, [activeChat])

  const createNewChat = useCallback((title?: string) => {
    const now = new Date()
    const newChat: Chat = {
      id: Date.now().toString(),
      title: title || `Chat ${chats.length + 1}`,
      messages: [getInitialMessage()],
      createdAt: now,
      updatedAt: now
    }
    
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
    return newChat.id
  }, [chats.length])

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId)
      
      // If we deleted the active chat, switch to another one
      if (chatId === activeChat) {
        if (newChats.length > 0) {
          setActiveChat(newChats[0].id)
        } else {
          // If no chats left, we'll create a new one after this state update
          setTimeout(() => createNewChat(), 0)
          setActiveChat(null)
        }
      }
      
      return newChats
    })
  }, [activeChat, createNewChat])

  const clearChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [getInitialMessage()],
            updatedAt: new Date()
          }
        : chat
    ))
  }, [])

  const updateChatTitle = useCallback((chatId: string, title: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title, updatedAt: new Date() }
        : chat
    ))
  }, [])

  const addMessage = useCallback((chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, message],
            updatedAt: new Date()
          }
        : chat
    ))
  }, [])

  const updateMessages = useCallback((chatId: string, messages: Message[]) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages,
            updatedAt: new Date()
          }
        : chat
    ))
  }, [])

  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: chat.messages.filter(msg => msg.id !== messageId),
            updatedAt: new Date()
          }
        : chat
    ))
  }, [])

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === activeChat) || null
  }, [chats, activeChat])

  return {
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
  }
}