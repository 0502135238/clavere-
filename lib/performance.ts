/**
 * Performance utilities
 * Optimizes rendering and memory usage
 */

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Clean up old chunks to prevent memory leaks
 */
export function cleanupOldChunks<T extends { timestamp: number }>(
  chunks: T[],
  maxAge: number = 60000, // 1 minute
  maxCount: number = 50
): T[] {
  const now = Date.now()
  return chunks
    .filter((chunk) => now - chunk.timestamp <= maxAge)
    .slice(0, maxCount)
}
