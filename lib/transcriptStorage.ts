/**
 * Transcript storage service
 * Stores transcripts in localStorage for persistence
 */

import { CaptionChunk } from './types'

const STORAGE_KEY = 'clavare-transcripts'
const SESSION_KEY = 'clavare-session'
const MAX_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB limit

export interface StoredSession {
  id: string
  title: string
  startTime: number
  endTime?: number
  chunks: CaptionChunk[]
  language: string
}

export class TranscriptStorage {
  /**
   * Save transcript chunk
   */
  static saveChunk(sessionId: string, chunk: CaptionChunk): void {
    try {
      const session = this.getSession(sessionId)
      if (!session) {
        this.createSession(sessionId, 'Live Session')
      }

      const updatedSession = this.getSession(sessionId)!
      updatedSession.chunks.push(chunk)
      
      // Limit chunks to prevent storage overflow
      if (updatedSession.chunks.length > 1000) {
        updatedSession.chunks = updatedSession.chunks.slice(-1000)
      }

      this.saveSession(updatedSession)
    } catch (error) {
      console.warn('Failed to save transcript chunk:', error)
    }
  }

  /**
   * Get session
   */
  static getSession(sessionId: string): StoredSession | null {
    try {
      const sessions = this.getAllSessions()
      return sessions.find((s) => s.id === sessionId) || null
    } catch (error) {
      console.warn('Failed to get session:', error)
      return null
    }
  }

  /**
   * Create new session
   */
  static createSession(sessionId: string, title: string, language: string = 'en-US'): StoredSession {
    const session: StoredSession = {
      id: sessionId,
      title,
      startTime: Date.now(),
      chunks: [],
      language,
    }
    this.saveSession(session)
    return session
  }

  /**
   * Save session
   */
  static saveSession(session: StoredSession): void {
    try {
      const sessions = this.getAllSessions()
      const index = sessions.findIndex((s) => s.id === session.id)
      
      if (index >= 0) {
        sessions[index] = session
      } else {
        sessions.push(session)
      }

      // Keep only last 10 sessions
      const recentSessions = sessions.slice(-10)
      
      const data = JSON.stringify(recentSessions)
      if (data.length > MAX_STORAGE_SIZE) {
        // Remove oldest sessions if too large
        const trimmed = recentSessions.slice(-5)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
      } else {
        localStorage.setItem(STORAGE_KEY, data)
      }

      // Save current session ID
      localStorage.setItem(SESSION_KEY, session.id)
    } catch (error) {
      console.warn('Failed to save session:', error)
      // Clear old data if storage is full
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldSessions()
      }
    }
  }

  /**
   * Get all sessions
   */
  static getAllSessions(): StoredSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      return JSON.parse(data) as StoredSession[]
    } catch (error) {
      console.warn('Failed to get sessions:', error)
      return []
    }
  }

  /**
   * Get current session ID
   */
  static getCurrentSessionId(): string {
    return localStorage.getItem(SESSION_KEY) || `session-${Date.now()}`
  }

  /**
   * End session
   */
  static endSession(sessionId: string): void {
    const session = this.getSession(sessionId)
    if (session) {
      session.endTime = Date.now()
      this.saveSession(session)
    }
  }

  /**
   * Clear old sessions
   */
  private static clearOldSessions(): void {
    const sessions = this.getAllSessions()
    // Keep only last 3 sessions
    const recent = sessions.slice(-3)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
  }

  /**
   * Export session as JSON
   */
  static exportSession(sessionId: string): string | null {
    const session = this.getSession(sessionId)
    if (!session) return null
    return JSON.stringify(session, null, 2)
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions()
    const filtered = sessions.filter((s) => s.id !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }
}
