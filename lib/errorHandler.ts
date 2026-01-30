/**
 * Centralized error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage?: string,
    public recoverable: boolean = false
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ErrorCodes = {
  MICROPHONE_DENIED: 'MICROPHONE_DENIED',
  BROWSER_NOT_SUPPORTED: 'BROWSER_NOT_SUPPORTED',
  API_KEY_INVALID: 'API_KEY_INVALID',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_ERROR: 'SERVICE_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
} as const

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // Map common errors to user-friendly messages
    if (error.message.includes('microphone') || error.message.includes('permission')) {
      return new AppError(
        error.message,
        ErrorCodes.MICROPHONE_DENIED,
        'Microphone access is required. Please allow microphone access in your browser settings.',
        true
      )
    }

    if (error.message.includes('not supported') || error.message.includes('SpeechRecognition')) {
      return new AppError(
        error.message,
        ErrorCodes.BROWSER_NOT_SUPPORTED,
        'Your browser does not support speech recognition. Please use Chrome or Edge.',
        false
      )
    }

    if (error.message.includes('API') || error.message.includes('key')) {
      return new AppError(
        error.message,
        ErrorCodes.API_KEY_INVALID,
        'API key is invalid or missing. Please check your configuration.',
        true
      )
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(
        error.message,
        ErrorCodes.NETWORK_ERROR,
        'Network error. Please check your internet connection.',
        true
      )
    }

    return new AppError(error.message, ErrorCodes.SERVICE_ERROR, 'An unexpected error occurred.', true)
  }

  return new AppError('Unknown error', ErrorCodes.SERVICE_ERROR, 'An unexpected error occurred.', true)
}

export function logError(error: AppError, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error.code, error.message, context)
  }
  // In production, send to error tracking service (Sentry, etc.)
}
