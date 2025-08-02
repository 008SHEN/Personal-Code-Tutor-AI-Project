import axios from 'axios'
import { sendDirectOllamaMessage, type ModelKey } from './directOllama'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const API_BASE_URL = 'http://localhost:8080'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add authentication for Open WebUI
api.interceptors.request.use((config) => {
  // Try to get token from localStorage first
  let token = localStorage.getItem('token') || localStorage.getItem('openwebui_token')
  
  // Handle development mode
  if (token && token.startsWith('dev-mode-token-')) {
    console.log('Using development mode - bypassing Open WebUI authentication')
    return config
  }
  
  // Handle real AI mode - connect directly to Ollama through Open WebUI
  if (token && token.startsWith('real-ai-token-')) {
    console.log('Using real AI mode - direct Ollama connection')
    // Don't add authorization header for direct Ollama connection
    return config
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear any invalid tokens
      localStorage.removeItem('token')
      localStorage.removeItem('openwebui_token')
      
      // For now, provide helpful error message
      throw new Error('Authentication required. Please set up proper authentication with Open WebUI.')
    }
    return Promise.reject(error)
  }
)

// Add the coding tutor system prompt
const SYSTEM_PROMPT = `You are an expert AI coding tutor and debugging assistant. Your role is to help users understand and solve programming problems in any language, including but not limited to Python, JavaScript, C++, Java, Go, Rust, and TypeScript.

You only respond to programming-related questions.

Your behavior rules:

1. Only answer questions about:
   - Algorithms & data structures (e.g. LeetCode-style problems)
   - Code debugging and explanation
   - Syntax, logic, or runtime errors
   - Best practices in different programming languages
   - Comparing implementations in multiple languages

2. If the question is not about code, respond helpfully:
   "Hi there! 👋 I'm your AI coding tutor, and I specialize in helping with programming questions. 

   I'd love to help you with:
   • 🐍 **Algorithm problems** (like LeetCode challenges)
   • 🔧 **Code debugging** and error fixing  
   • 📚 **Programming concepts** in Python, JavaScript, Java, C++, etc.
   • 💡 **Best practices** and code optimization
   • 🧮 **Data structures** and algorithms

   Could you rephrase your question to include a coding aspect? For example, if you're curious about something, maybe ask how to implement it in code!

   What programming challenge can I help you solve today? 🚀"

When answering:

- Provide the **correct code solution**
- Use **the language the user is asking about** (default to Python if unspecified)
- Include **clear step-by-step explanations**
- Use **simple, beginner-friendly language**
- Always include **Big-O time and space complexity** for algorithms
- Use **comments in code** to explain logic
- Show multiple approaches only when useful, and explain which is better

**CODE STRUCTURE REQUIREMENTS:**
- For Python: ALWAYS use class-based solutions with simple, clean syntax
- Include class definitions with __init__ methods where appropriate  
- Use instance methods with 'self' parameter
- Structure code as: class Solution: def method(self, params): ...

**CRITICAL: NO TYPE ANNOTATIONS OF ANY KIND**
- DO NOT use type annotations: def method(self, s, p): NOT def method(self, s: str, p: str) -> bool:
- DO NOT use docstring type hints: NO :type param: str or :rtype: bool
- DO NOT use typing imports: NO from typing import List, Optional
- DO NOT use any form of type specification
- Keep it simple: just def method(self, param1, param2):

**Example Python structure:**
\`\`\`python
# Always include necessary imports at the top (NO typing imports)
from collections import defaultdict, deque
from heapq import heappush, heappop
import bisect

class Solution:
    def __init__(self):
        pass
    
    def solveProblem(self, param1, param2):
        # Clean code with no type hints anywhere
        return result
\`\`\`

**IMPORT REQUIREMENTS:**
- ALWAYS include necessary imports at the top of the code
- Be smart about which imports to include based on the algorithm:

**Heap/Priority Queue problems**: 
\`from heapq import heappush, heappop, heapify\`

**Hash maps/counting**: 
\`from collections import defaultdict, Counter\`

**BFS/Queue problems**: 
\`from collections import deque\`

**Binary search**: 
\`import bisect\`

**Math operations**: 
\`import math\`

**Combinations/permutations**: 
\`import itertools\`

**Memoization**: 
\`import functools\`

**Examples of when to include imports:**
- Merge K Sorted Lists → \`from heapq import heappush, heappop\`
- Two Sum → \`from collections import defaultdict\` (if using hash map approach)
- Binary Tree Level Order → \`from collections import deque\`
- Coin Change → \`import math\` (for infinity)
- Word Ladder → \`from collections import deque, defaultdict\`

**PROBLEM RECOGNITION:**
You should recognize these common problems even without "LeetCode" mentioned:
- "Regular Expression Matching" = LeetCode 10 - match string with pattern using . and *
- "Two Sum" = LeetCode 1 - find two numbers that add up to target
- "Valid Parentheses" = LeetCode 20 - check if brackets are properly closed
- "Merge Two Sorted Lists" = LeetCode 21 - merge two sorted linked lists
- "Binary Search" = LeetCode 704 - search in sorted array
- "Unique Paths" = LeetCode 62 - count paths in grid from top-left to bottom-right
- "Climbing Stairs" = LeetCode 70 - ways to reach top with 1 or 2 steps
- "House Robber" = LeetCode 198 - max money without robbing adjacent houses
- "Longest Common Subsequence" = LeetCode 1143 - LCS dynamic programming
- "Coin Change" = LeetCode 322 - minimum coins for amount
- "Word Break" = LeetCode 139 - check if string can be segmented
- "Edit Distance" = LeetCode 72 - minimum operations to convert strings
- "Maximum Subarray" = LeetCode 53 - Kadane's algorithm for max sum
- "Container With Most Water" = LeetCode 11 - two pointers for max area
- "3Sum" = LeetCode 15 - find triplets that sum to zero
- "Palindrome" problems - check or find palindromic strings/numbers
- "Reverse" problems - reverse strings, numbers, linked lists
- "Rotate" problems - rotate arrays, matrices
- "Sort" problems - various sorting algorithms and applications
- "Tree/Graph Traversal" - DFS, BFS, inorder, preorder, postorder
- "Dynamic Programming" - optimization problems with overlapping subproblems
- "Greedy Algorithms" - locally optimal choices
- "Sliding Window" - substring/subarray problems
- "Two Pointers" - array/string problems with pointers from different ends

**EXPLANATION REQUIREMENTS:**
- Provide EXTREMELY DETAILED step-by-step explanations
- Explain the intuition behind the approach
- Walk through examples with specific values
- Explain each line of code in detail
- Include multiple test cases and edge cases
- Provide time and space complexity analysis
- Mention alternative approaches when relevant

If given broken code:
- Diagnose errors line-by-line
- Explain what's wrong and how to fix it
- Offer a corrected version with explanation using proper class structure

You are not a general assistant. You do not answer questions about news, history, emotions, or anything unrelated to code or computer science.`

// Development mode handler for when Open WebUI frontend is not available
const handleDevelopmentMode = async (messages: Message[]): Promise<string> => {
  const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
  
  // Simulate a delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // Check if it's a coding question
  const codingKeywords = ['code', 'function', 'algorithm', 'leetcode', 'python', 'javascript', 'java', 'debug', 'error', 'program', 'solve', 'implement']
  const isCodingRelated = codingKeywords.some(keyword => userMessage.includes(keyword))
  
  if (!isCodingRelated) {
    // Non-coding response
    return `Hi there! 👋 I'm your AI coding tutor, and I specialize in helping with programming questions. 

I'd love to help you with:
• 🐍 **Algorithm problems** (like LeetCode challenges)
• 🔧 **Code debugging** and error fixing  
• 📚 **Programming concepts** in Python, JavaScript, Java, C++, etc.
• 💡 **Best practices** and code optimization
• 🧮 **Data structures** and algorithms

Could you rephrase your question to include a coding aspect? For example, if you're curious about something, maybe ask how to implement it in code!

What programming challenge can I help you solve today? 🚀

*Note: Running in development mode - Open WebUI backend not fully connected.*`
  }
  
  // Coding-related mock responses
  if (userMessage.includes('leetcode') || userMessage.includes('merge') || userMessage.includes('21')) {
    return `# LeetCode 21: Merge Two Sorted Lists

Here's a complete solution for merging two sorted linked lists:

## Python Implementation

\`\`\`python
# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1, list2):
        # Create a dummy node to simplify the logic
        dummy = ListNode(0)
        current = dummy
        
        # Compare nodes from both lists
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        # Attach remaining nodes
        current.next = list1 or list2
        
        return dummy.next
\`\`\`

## Step-by-Step Explanation

1. **Dummy Node**: We create a dummy node to avoid edge cases
2. **Two Pointers**: Compare values from both lists
3. **Link Smaller**: Always link the smaller value to our result
4. **Advance Pointers**: Move to the next node in the chosen list
5. **Remaining Nodes**: Attach any leftover nodes

## Complexity Analysis

- **Time**: O(m + n) where m, n are the lengths of the lists
- **Space**: O(1) - only using a few pointers

## Test Case

\`\`\`python
# Example: [1,2,4] + [1,3,4] = [1,1,2,3,4,4]
list1 = ListNode(1, ListNode(2, ListNode(4)))
list2 = ListNode(1, ListNode(3, ListNode(4)))
result = Solution().mergeTwoLists(list1, list2)
\`\`\`

*Note: This is a development mode response. Connect to Open WebUI backend for live AI responses.*`
  }
  
  // General coding response
  return `I'd be happy to help with your coding question! 

Here are some ways I can assist:
- **Algorithm solutions** with detailed explanations
- **Code debugging** and error fixing
- **Best practices** and optimization tips
- **Multiple language implementations**
- **Time/space complexity analysis**

Could you provide more specific details about what you're trying to solve? For example:
- What programming language?
- What's the specific problem or error?
- Do you have any code you'd like me to review?

*Note: Running in development mode - Open WebUI backend not fully connected.*`
}

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const token = localStorage.getItem('token')
    
    // Check if user wants Real AI mode
    if (token && token.startsWith('real-ai-token-')) {
      console.log('🤖 Using Real AI mode - Direct Ollama connection')
      
      // Extract model from token (format: real-ai-token-{model}-{timestamp})
      const tokenParts = token.split('-')
      let selectedModel: ModelKey = 'deepseek-coder:1.3b' // Default to fast model
      
      // Try to extract model from token or localStorage
      const storedModel = localStorage.getItem('selectedModel') as ModelKey
      if (storedModel) {
        selectedModel = storedModel
      } else if (tokenParts.length >= 5) {
        // Token format: real-ai-token-{model}:{version}-{timestamp}
        const modelPart = tokenParts.slice(3, -1).join('-') + ':' + tokenParts[tokenParts.length - 2]
        if (modelPart.includes('deepseek') || modelPart.includes('mistral') || modelPart.includes('llama')) {
          selectedModel = modelPart as ModelKey
        }
      }
      
      console.log(`🎯 Selected model: ${selectedModel}`)
      
      // Add system prompt to the beginning of the conversation
      const messagesWithSystem = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]
      
      try {
        // Use direct Ollama connection (bypasses Open WebUI entirely)
        return await sendDirectOllamaMessage(messagesWithSystem, selectedModel)
      } catch (directError) {
        console.error('Direct Ollama connection failed, trying backend proxy...', directError)
        
        // Fallback: Try using backend as proxy to Ollama
        try {
          const response = await api.post('/ollama/v1/chat/completions', {
            model: selectedModel,
            messages: messagesWithSystem,
            stream: false,
            temperature: 0.7,
            max_tokens: selectedModel.includes('deepseek') ? 2048 : 4096
          })
          
          if (response.data?.choices?.[0]?.message?.content) {
            console.log('✅ Backend proxy to Ollama successful')
            return response.data.choices[0].message.content
          } else {
            throw new Error('Invalid response from backend proxy')
          }
        } catch (proxyError) {
          console.error('Backend proxy also failed:', proxyError)
          // Re-throw the original direct connection error with more context
          throw new Error(`🚨 Real AI Mode Failed:\n\nDirect Connection: ${directError instanceof Error ? directError.message : 'Unknown error'}\n\nBackend Proxy: ${proxyError instanceof Error ? proxyError.message : 'Unknown error'}\n\n💡 Try Development Mode if issues persist.`)
        }
      }
    }
    
    // Check if user wants development mode
    if (token && token.startsWith('dev-mode-token-')) {
      console.log('🔧 Using Development mode - Mock responses')
      return handleDevelopmentMode(messages)
    }
    
    // Default: Try Open WebUI proxy (for users with real API keys)
    console.log('🔗 Using Open WebUI proxy')
    const messagesWithSystem = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]
    
    const response = await api.post('/ollama/v1/chat/completions', {
      model: 'mistral:latest',
      messages: messagesWithSystem,
      stream: false,
      temperature: 0.7,
      max_tokens: 2048
    })
    
    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content
    } else {
      throw new Error('Invalid response format from Open WebUI API')
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // Check if we should fall back to development mode
    const token = localStorage.getItem('token')
    if (token && token.startsWith('dev-mode-token-')) {
      console.log('Falling back to development mode due to API error')
      return handleDevelopmentMode(messages)
    }
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to backend server. Please check if Ollama and Open WebUI are running properly.')
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication failed. Please check your API token or try using development mode.')
      } else if (error.response?.status === 400) {
        throw new Error('Bad request. This might be an authentication or model issue. Try using development mode.')
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Please check the backend configuration.')
      } else if (error.response && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else {
        throw new Error(`HTTP ${error.response?.status || 'Unknown'}: ${error.message}`)
      }
    }
    
    throw new Error('Failed to send message. Please try again.')
  }
}

export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await api.get('/v1/models')
    return response.data?.data?.map((model: any) => model.id) || []
  } catch (error) {
    console.error('Error fetching models:', error)
    return ['llama3.2:latest'] // Fallback
  }
}

export const testConnection = async (): Promise<boolean> => {
  try {
    await api.get('/v1/models')
    return true
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}