// Enhanced problem recognition for Code Tutor AI
export const recognizeProblem = (input: string): string | null => {
  const lowerInput = input.toLowerCase().trim()
  
  // Common problem patterns
  const patterns = [
    // Exact matches
    { pattern: /^l\d+$/i, transform: (match: string) => `LeetCode ${match.substring(1)}` },
    { pattern: /^leetcode\s*(\d+)$/i, transform: (match: string) => match },
    
    // Problem name matches
    { pattern: /regular expression matching/i, problem: "LeetCode 10: Regular Expression Matching" },
    { pattern: /two sum/i, problem: "LeetCode 1: Two Sum" },
    { pattern: /valid parentheses/i, problem: "LeetCode 20: Valid Parentheses" },
    { pattern: /merge.*sorted.*lists?/i, problem: "LeetCode 21: Merge Two Sorted Lists" },
    { pattern: /binary search/i, problem: "LeetCode 704: Binary Search" },
    { pattern: /unique paths/i, problem: "LeetCode 62: Unique Paths" },
    { pattern: /climbing stairs/i, problem: "LeetCode 70: Climbing Stairs" },
    { pattern: /house robber/i, problem: "LeetCode 198: House Robber" },
    { pattern: /longest common subsequence/i, problem: "LeetCode 1143: Longest Common Subsequence" },
    { pattern: /coin change/i, problem: "LeetCode 322: Coin Change" },
    { pattern: /word break/i, problem: "LeetCode 139: Word Break" },
    { pattern: /edit distance/i, problem: "LeetCode 72: Edit Distance" },
    { pattern: /maximum subarray/i, problem: "LeetCode 53: Maximum Subarray" },
    { pattern: /container.*most water/i, problem: "LeetCode 11: Container With Most Water" },
    { pattern: /3sum|three sum/i, problem: "LeetCode 15: 3Sum" },
    { pattern: /reverse.*string/i, problem: "String Reversal Problem" },
    { pattern: /reverse.*linked.*list/i, problem: "LeetCode 206: Reverse Linked List" },
    { pattern: /palindrome/i, problem: "Palindrome Problems" },
    { pattern: /fibonacci/i, problem: "Fibonacci Sequence Problems" },
    { pattern: /quicksort|quick sort/i, problem: "QuickSort Algorithm" },
    { pattern: /mergesort|merge sort/i, problem: "MergeSort Algorithm" },
    { pattern: /binary tree/i, problem: "Binary Tree Problems" },
    { pattern: /graph traversal/i, problem: "Graph Traversal (DFS/BFS)" },
  ]
  
  for (const { pattern, problem, transform } of patterns) {
    const match = lowerInput.match(pattern)
    if (match) {
      if (transform) {
        return transform(match[0])
      }
      return problem || null
    }
  }
  
  return null
}

export const enhanceQuery = (query: string): string => {
  const recognizedProblem = recognizeProblem(query)
  
  if (recognizedProblem) {
    return `${recognizedProblem}: ${query}

Please provide a complete solution with:
1. Class-based Python implementation using simple syntax: def method(self, params):
2. Detailed step-by-step explanation
3. Algorithm complexity analysis  
4. Example walkthrough with test cases
5. Edge cases consideration`
  }
  
  return query
}