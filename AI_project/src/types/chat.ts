// Chat types for multiple chat sessions
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatState {
  chats: Chat[]
  activeChat: string | null
  isLoading: boolean
  error: string | null
}