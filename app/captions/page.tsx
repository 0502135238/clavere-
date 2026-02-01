'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Force dynamic rendering - this page requires client-side only features
export const dynamic = 'force-dynamic'
import { MultiSpeakerDisplay } from '@/components/MultiSpeakerDisplay'
import { ContextDisplay } from '@/components/ContextDisplay'
import { Sidebar } from '@/components/Sidebar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PermissionPrompt } from '@/components/PermissionPrompt'
import { UnsupportedBrowser } from '@/components/UnsupportedBrowser'
import { AIServiceFactory, AIServiceConfig } from '@/lib/aiServiceFactory'
import { DeepgramService } from '@/lib/deepgramService'
import { SpeechRecognitionStream } from '@/lib/speechRecognition'
import { OpenAIContextService } from '@/lib/openAIContext'
import { OverlapManager, SpeechSegment } from '@/lib/overlapManager'
import { getAppConfig } from '@/lib/config'
import { ConversationAnalyzer } from '@/lib/conversationAnalysis'
import { processTextForMode } from '@/lib/textProcessing'
import { TranscriptStorage } from '@/lib/transcriptStorage'
import { SessionService } from '@/lib/sessionService'
import { CaptionChunk } from '@/lib/types'
import { useSettings } from '@/lib/settings'
import { useToast } from '@/hooks/useToast'
import { ApiKeyStatus } from '@/components/ApiKeyStatus'
import { cleanupOldChunks } from '@/lib/performance'
import { handleError, logError } from '@/lib/errorHandler'

type PermissionState = 'checking' | 'granted' | 'denied' | 'unsupported'

export default function CaptionsPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const [chunks, setChunks] = useState<CaptionChunk[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionTitle] = useState('Live Session')
  const [sessionStartTime] = useState(new Date())
  
  // No browser check on initial render - assume supported to show UI instantly
  // Start with 'granted' to show UI immediately - check in background
  const [permissionState, setPermissionState] = useState<PermissionState>('granted')
  
  // Context state
  const [context, setContext] = useState<{
    topic?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    keywords?: string[]
  }>({})
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([])

  const aiServiceRef = useRef<DeepgramService | SpeechRecognitionStream | null>(null)
  const contextServiceRef = useRef<OpenAIContextService | null>(null)
  const overlapManagerRef = useRef<OverlapManager | null>(null)
  const analyzerRef = useRef<ConversationAnalyzer | null>(null)
  const sessionServiceRef = useRef<SessionService | null>(null)
  const segmentIdCounter = useRef(0)
  const { showToast, ToastContainer } = useToast()
  
  // Check unsupported browser in background - don't block UI
  const [showUnsupported, setShowUnsupported] = useState(false)

  // Log after all hooks (React Rules of Hooks)
  if (typeof window !== 'undefined') {
    console.log('[CAPTIONS PAGE] Component rendering - START')
  }

  // Initialize session service
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] useEffect: Initialize session service')
    }
    if (!sessionServiceRef.current) {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Creating SessionService')
      }
      sessionServiceRef.current = new SessionService(sessionTitle)
    }
  }, [sessionTitle])

  // Initialize AI transcription service ONLY when user clicks play (not on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] useEffect: AI service init check', { permissionState, isPaused, hasService: !!aiServiceRef.current })
    }
    // Don't initialize anything until user explicitly starts
    if (permissionState !== 'granted' || isPaused || !aiServiceRef.current) {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Skipping AI service init - conditions not met')
      }
      return
    }
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] Starting AI service initialization')
    }

    // Only initialize if service doesn't exist yet (user clicked play)
    const initializeService = async () => {
      try {
        // Get configuration
        const appConfig = getAppConfig()
        
        // Silent initialization - no logging

        const config: AIServiceConfig = {
          type: appConfig.aiService,
          deepgramApiKey: appConfig.deepgramApiKey,
          openaiApiKey: appConfig.openaiApiKey,
          assemblyaiApiKey: appConfig.assemblyaiApiKey,
          language: appConfig.language,
        }

        // Create transcription service
        let service
        try {
          service = AIServiceFactory.createTranscriptionService(config)
        } catch (error: any) {
          // Silent error handling - no logging
          showToast('We\'re having trouble connecting. This is our fault - we\'re working on it!', 'error')
          // Fallback to Web Speech API
          service = AIServiceFactory.createTranscriptionService({
            ...config,
            type: 'webspeech',
          })
        }
        
        // Create context service (optional)
        const contextService = AIServiceFactory.createContextService(config)
        if (contextService) {
          contextServiceRef.current = contextService
        }

        const analyzer = new ConversationAnalyzer()
        const overlapManager = new OverlapManager()

        aiServiceRef.current = service as any
        analyzerRef.current = analyzer
        overlapManagerRef.current = overlapManager

        // Extract callbacks to avoid type issues with async
        const onChunk = (chunk: CaptionChunk): void => {
          const processedText = processTextForMode(chunk, settings.captionMode)
          
          // Create speech segment for overlap management
          const segmentId = `seg-${++segmentIdCounter.current}`
          const segment: SpeechSegment = {
            id: segmentId,
            speakerId: chunk.speakerId || 'unknown',
            text: processedText,
            startTime: chunk.timestamp - 2000,
            endTime: chunk.timestamp,
            isComplete: true,
            confidence: 0.9,
          }

          // Add to overlap manager
          const { displayChunks } = overlapManager.addSegment(segment)

          // Extract context (async, don't block)
          if (contextServiceRef.current) {
            const recentText = displayChunks.slice(0, 5).map(c => c.text).join(' ')
            contextServiceRef.current.extractContext(recentText).then((ctx) => {
              setContext({
                topic: ctx.topic,
                sentiment: ctx.sentiment,
                keywords: ctx.keywords,
              })
            }).catch(() => {
              // Fallback to simple extraction
            })
          }

          // Update active speakers
          const speakers = overlapManager.getActiveSpeakers()
          setActiveSpeakers(speakers)

          // Analyze conversation
          analyzer.analyzeChunk(chunk)

          // Save to storage
          if (sessionServiceRef.current) {
            TranscriptStorage.saveChunk(sessionServiceRef.current.getSessionId(), chunk)
          }

          // Clean up old chunks to prevent memory leaks
          const cleanedChunks = cleanupOldChunks(displayChunks, 60000, 50)

          // Update display chunks
          setChunks(cleanedChunks)
          setCurrentIndex(0)
        }

        const onErrorCallback = (error: Error): void => {
          const appError = handleError(error)
          logError(appError, { component: 'CaptionsPage' })
          showToast('We\'re having trouble. This is our fault - we\'re working on it!', 'error')
        }

        // Start service - completely non-blocking, no await
        const startService = () => {
          // If Deepgram, initialize in background (don't await)
          if (service instanceof DeepgramService) {
            service.initialize().then(() => {
              // Start transcription after initialization
              service.start(onChunk, onErrorCallback)
            }).catch(() => {
              // If Deepgram fails, fallback to Web Speech API immediately
              const fallbackService = AIServiceFactory.createTranscriptionService({ ...config, type: 'webspeech' });
              (fallbackService as SpeechRecognitionStream).start(onChunk);
              showToast('We\'re having trouble connecting. This is our fault - we\'re working on it!', 'error')
            })
          } else {
            // Web Speech API - start immediately
            if (service instanceof SpeechRecognitionStream) {
              service.start(onChunk)
            }
          }
        }

        // Start in background - completely non-blocking
        setTimeout(startService, 0)

        // Cleanup old segments periodically
        const cleanupInterval = setInterval(() => {
          overlapManager.clearOldSegments(30000) // 30 seconds
        }, 5000)

        return () => {
          clearInterval(cleanupInterval)
        }
        } catch (error) {
          const appError = handleError(error)
          logError(appError, { component: 'CaptionsPage', action: 'initialize' })
          showToast('We\'re having trouble. This is our fault - we\'re working on it!', 'error')
          // Don't block - let user try again
        }
      }

    // Initialize in background without blocking
    initializeService()

    return () => {
      if (aiServiceRef.current) {
        aiServiceRef.current.stop()
      }
    }
  }, [permissionState, isPaused, settings.captionMode])

  // Initialize service ONLY when user clicks play button
  const handleStart = () => {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] handleStart called')
    }
    if (aiServiceRef.current) {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Service already started, returning')
      }
      return // Already started
    }

    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] Checking browser support')
    }
    // Check browser support silently
    if (typeof window !== 'undefined') {
      const hasRecognition = !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Browser support check:', { hasRecognition })
      }
      if (!hasRecognition) {
        if (typeof window !== 'undefined') {
          console.log('[CAPTIONS PAGE] Browser not supported, showing unsupported message')
        }
        setShowUnsupported(true)
        return
      }
    }

    // Request permission and start service
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Requesting microphone permission')
      }
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          if (typeof window !== 'undefined') {
            console.log('[CAPTIONS PAGE] Microphone permission granted')
          }
          stream.getTracks().forEach((track) => track.stop())
          setPermissionState('granted')
          
          if (typeof window !== 'undefined') {
            console.log('[CAPTIONS PAGE] Getting app config')
          }
          // Now initialize service
          const appConfig = getAppConfig()
          if (typeof window !== 'undefined') {
            console.log('[CAPTIONS PAGE] App config:', { serviceType: appConfig.aiService, hasDeepgram: !!appConfig.deepgramApiKey })
          }
          const config: AIServiceConfig = {
            type: appConfig.aiService,
            deepgramApiKey: appConfig.deepgramApiKey,
            openaiApiKey: appConfig.openaiApiKey,
            assemblyaiApiKey: appConfig.assemblyaiApiKey,
            language: appConfig.language,
          }

          let service
          try {
            if (typeof window !== 'undefined') {
              console.log('[CAPTIONS PAGE] Creating transcription service:', config.type)
            }
            service = AIServiceFactory.createTranscriptionService(config)
            if (typeof window !== 'undefined') {
              console.log('[CAPTIONS PAGE] Service created successfully')
            }
          } catch (error) {
            if (typeof window !== 'undefined') {
              console.error('[CAPTIONS PAGE] Failed to create service, falling back to webspeech:', error)
            }
            service = AIServiceFactory.createTranscriptionService({ ...config, type: 'webspeech' })
          }

          if (typeof window !== 'undefined') {
            console.log('[CAPTIONS PAGE] Creating analyzer and overlap manager')
          }
          const analyzer = new ConversationAnalyzer()
          const overlapManager = new OverlapManager()
          aiServiceRef.current = service as any
          analyzerRef.current = analyzer
          overlapManagerRef.current = overlapManager
          if (typeof window !== 'undefined') {
            console.log('[CAPTIONS PAGE] Service refs set')
          }

          const onChunk = (chunk: CaptionChunk): void => {
            const processedText = processTextForMode(chunk, settings.captionMode)
            const segmentId = `seg-${++segmentIdCounter.current}`
            const segment: SpeechSegment = {
              id: segmentId,
              speakerId: chunk.speakerId || 'unknown',
              text: processedText,
              startTime: chunk.timestamp - 2000,
              endTime: chunk.timestamp,
              isComplete: true,
              confidence: 0.9,
            }
            const { displayChunks } = overlapManager.addSegment(segment)
            const cleanedChunks = cleanupOldChunks(displayChunks, 60000, 50)
            setChunks(cleanedChunks)
            setCurrentIndex(0)
          }

          const onErrorCallback = (error: Error): void => {
            showToast('We\'re having trouble. This is our fault - we\'re working on it!', 'error')
          }

          if (service instanceof DeepgramService) {
            if (typeof window !== 'undefined') {
              console.log('[CAPTIONS PAGE] Initializing Deepgram service')
            }
            service.initialize().then(() => {
              if (typeof window !== 'undefined') {
                console.log('[CAPTIONS PAGE] Deepgram initialized, starting transcription')
              }
              service.start(onChunk, onErrorCallback)
            }).catch((error) => {
              if (typeof window !== 'undefined') {
                console.error('[CAPTIONS PAGE] Deepgram init failed, falling back:', error)
              }
              const fallback = AIServiceFactory.createTranscriptionService({ ...config, type: 'webspeech' });
              (fallback as SpeechRecognitionStream).start(onChunk);
            })
          } else if (service instanceof SpeechRecognitionStream) {
            if (typeof window !== 'undefined') {
              console.log('[CAPTIONS PAGE] Starting Web Speech API service')
            }
            service.start(onChunk)
          }
        })
        .catch((error) => {
          if (typeof window !== 'undefined') {
            console.error('[CAPTIONS PAGE] Microphone permission denied:', error)
          }
          setPermissionState('denied')
        })
    } else {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] navigator.mediaDevices not available')
      }
    }
  }

  const togglePause = () => {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] togglePause called', { hasService: !!aiServiceRef.current, isPaused })
    }
    if (!aiServiceRef.current) {
      // Start if not started yet
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] No service, calling handleStart')
      }
      handleStart()
      setIsPaused(false)
      return
    }
    if (isPaused) {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Resuming')
      }
      setIsPaused(false)
    } else {
      if (typeof window !== 'undefined') {
        console.log('[CAPTIONS PAGE] Pausing')
      }
      aiServiceRef.current.stop()
      setIsPaused(true)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handlePermissionGranted = () => {
    setPermissionState('granted')
  }

  const handlePermissionDenied = () => {
    setPermissionState('denied')
  }

  if (typeof window !== 'undefined') {
    console.log('[CAPTIONS PAGE] Render check:', { showUnsupported, permissionState })
  }

  // Always render something - add fallback for blank screen
  if (showUnsupported) {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] Rendering UnsupportedBrowser')
    }
    return (
      <ErrorBoundary>
        <UnsupportedBrowser />
      </ErrorBoundary>
    )
  }

  // Show permission prompt only if explicitly denied
  if (permissionState === 'denied') {
    if (typeof window !== 'undefined') {
      console.log('[CAPTIONS PAGE] Rendering PermissionPrompt')
    }
    return (
      <ErrorBoundary>
        <PermissionPrompt
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      </ErrorBoundary>
    )
  }

  // Safety check - if somehow we get here with an invalid state, show basic UI
  if (typeof window === 'undefined') {
    // SSR fallback
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  // Show UI immediately - don't wait for permission check
  // Permission check happens in background, will prompt if needed
  if (typeof window !== 'undefined') {
    console.log('[CAPTIONS PAGE] Rendering main UI', { permissionState, showUnsupported, chunks: chunks.length })
  }

  // Always render something - never return null or blank
  return (
    <ErrorBoundary>
      {/* Toast Notifications */}
      <ToastContainer />

      {/* API Key Status (development only) */}
      {process.env.NODE_ENV === 'development' && <ApiKeyStatus />}
      
      {/* Mobile-first layout */}
      <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden md:flex-row">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar currentView="live" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Mobile optimized */}
          <div className="h-14 md:h-16 border-b border-dark-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 rounded flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-sm md:text-lg font-semibold text-white">CLAVERE</span>
            </div>

            <div className="flex-1 flex flex-col items-center mx-2">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-lg font-semibold text-white truncate max-w-[120px] md:max-w-none">
                  {sessionTitle}
                </h1>
                {!isPaused && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] md:text-xs font-semibold rounded-full whitespace-nowrap">
                    LIVE
                  </span>
                )}
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                {formatTime(sessionStartTime)} • EN
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => router.push('/settings')}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Caption Display Area - Smart multi-speaker */}
          <div className="flex-1 overflow-hidden">
            <MultiSpeakerDisplay chunks={chunks} currentIndex={currentIndex} />
          </div>

          {/* Context Display - Always visible, expandable */}
          <ContextDisplay
            topic={context.topic}
            sentiment={context.sentiment}
            keywords={context.keywords}
            activeSpeakers={activeSpeakers}
          />

          {/* Bottom Controls - Mobile optimized */}
          <div className="h-16 md:h-20 border-t border-dark-border flex items-center justify-center gap-4 md:gap-6 px-4 md:px-6 flex-shrink-0">
            <button
              onClick={togglePause}
              className="w-12 h-12 md:w-14 md:h-14 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors shadow-lg flex-shrink-0"
            >
              {isPaused ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
