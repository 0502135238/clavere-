/**
 * Session management service
 * Handles session creation, tracking, and management
 */

import { TranscriptStorage, StoredSession } from './transcriptStorage'

export class SessionService {
  private currentSessionId: string
  private sessionTitle: string

  constructor(title: string = 'Live Session') {
    this.sessionTitle = title
    this.currentSessionId = TranscriptStorage.getCurrentSessionId()
    
    // Create session if it doesn't exist
    if (!TranscriptStorage.getSession(this.currentSessionId)) {
      TranscriptStorage.createSession(this.currentSessionId, title)
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): StoredSession | null {
    return TranscriptStorage.getSession(this.currentSessionId)
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.currentSessionId
  }

  /**
   * Update session title
   */
  updateTitle(title: string): void {
    this.sessionTitle = title
    const session = TranscriptStorage.getSession(this.currentSessionId)
    if (session) {
      session.title = title
      TranscriptStorage.saveSession(session)
    }
  }

  /**
   * End current session
   */
  endSession(): void {
    TranscriptStorage.endSession(this.currentSessionId)
  }

  /**
   * Start new session
   */
  startNewSession(title?: string): string {
    this.endSession()
    this.currentSessionId = `session-${Date.now()}`
    this.sessionTitle = title || 'Live Session'
    TranscriptStorage.createSession(this.currentSessionId, this.sessionTitle)
    return this.currentSessionId
  }

  /**
   * Get all sessions
   */
  getAllSessions(): StoredSession[] {
    return TranscriptStorage.getAllSessions()
  }

  /**
   * Export session
   */
  exportSession(sessionId?: string): string | null {
    const id = sessionId || this.currentSessionId
    return TranscriptStorage.exportSession(id)
  }
}
