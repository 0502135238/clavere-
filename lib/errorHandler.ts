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
        'We need microphone access to work. This is our fault - we\'re working on a fix!',
        true
      )
    }

    if (error.message.includes('not supported') || error.message.includes('SpeechRecognition')) {
      return new AppError(
        error.message,
        ErrorCodes.BROWSER_NOT_SUPPORTED,
        'We\'re having trouble with your browser. This is our fault - we\'re working on it!',
        false
      )
    }

    if (error.message.includes('API') || error.message.includes('key')) {
      return new AppError(
        error.message,
        ErrorCodes.API_KEY_INVALID,
        'We\'re having trouble connecting. This is our fault - we\'re working hard to fix it!',
        true
      )
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(
        error.message,
        ErrorCodes.NETWORK_ERROR,
        'We\'re having connection issues. This is our fault - we\'re working on it!',
        true
      )
    }

    return new AppError(
      error.message, 
      ErrorCodes.SERVICE_ERROR, 
      'We\'re having a moment. This is our fault - we\'re working very hard to bring it back!', 
      true
    )
  }

  return new AppError('Unknown error', ErrorCodes.SERVICE_ERROR, 'An unexpected error occurred.', true)
}

export function logError(error: AppError, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error.code, error.message, context)
  }
  // In production, send to error tracking service (Sentry, etc.)
}
