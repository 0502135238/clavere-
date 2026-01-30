'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { GroupFeedbackPanel } from '@/components/GroupFeedbackPanel'
import { MockCaptionStream } from '@/lib/mockStream'
import { ConversationAnalyzer } from '@/lib/conversationAnalysis'
import { CaptionChunk, GroupFeedback } from '@/lib/types'
import { useSettings } from '@/lib/settings'

export default function GroupFeedbackPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const [feedbacks, setGroupFeedbacks] = useState<GroupFeedback[]>([])
  const streamRef = useRef<MockCaptionStream | null>(null)
  const analyzerRef = useRef<ConversationAnalyzer | null>(null)

  useEffect(() => {
    const stream = new MockCaptionStream()
    const analyzer = new ConversationAnalyzer()
    streamRef.current = stream
    analyzerRef.current = analyzer

    stream.start((chunk: CaptionChunk) => {
      analyzer.analyzeChunk(chunk)
      
      // Check for group feedback
      const newFeedbacks = analyzer.checkGroupFeedback()
      if (newFeedbacks.length > 0) {
        setGroupFeedbacks((prev) => {
          // Remove duplicates and keep latest
          const combined = [...newFeedbacks, ...prev]
          const unique = combined.filter(
            (f, index, self) =>
              index === self.findIndex((t) => t.type === f.type && Math.abs(t.timestamp - f.timestamp) < 1000)
          )
          return unique.slice(0, 5) // Keep last 5
        })
      }
    })

    return () => {
      stream.stop()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Feedback</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Back"
        >
          ← Back
        </button>
      </div>

      {/* Info Section */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ambient Conversation Awareness
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This page provides subtle, non-intrusive feedback about conversation dynamics. 
            It helps hearing people be more aware of turn-taking, overlaps, and inclusion 
            without shaming or calling anyone out.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No feedback yet. Start a conversation to see helpful nudges.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Feedback appears automatically when conversation dynamics are detected.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Feedback
              </h3>
              {feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {feedback.type === 'overlap' ? '⚡' : feedback.type === 'exclusion' ? '👤' : '🔄'}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{feedback.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(feedback.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Feedback Panel (for real-time updates) */}
      <GroupFeedbackPanel feedbacks={feedbacks.slice(0, 3)} />
    </div>
  )
}
