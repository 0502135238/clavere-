'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
import { CaptionChunk } from '@/lib/types'
import { useSettings } from '@/lib/settings'

type PermissionState = 'checking' | 'granted' | 'denied' | 'unsupported'

export default function CaptionsPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const [chunks, setChunks] = useState<CaptionChunk[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionTitle] = useState('Live Session')
  const [sessionStartTime] = useState(new Date())
  const [permissionState, setPermissionState] = useState<PermissionState>('checking')
  const [isSupported, setIsSupported] = useState<boolean | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  
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
  const segmentIdCounter = useRef(0)
  const { showToast, ToastContainer } = useToast()

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
  }, [])

  // Check microphone permission
  useEffect(() => {
    if (isSupported === false) {
      setPermissionState('unsupported')
      return
    }

    if (isSupported === true) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop())
          setPermissionState('granted')
        })
        .catch(() => {
          setPermissionState('denied')
        })
    }
  }, [isSupported])

  // Initialize AI transcription service with overlap management
  useEffect(() => {
    if (permissionState !== 'granted' || isPaused || isInitializing) {
      return
    }

    const initializeService = async () => {
      setIsInitializing(true)
      try {
        // Get configuration
        const appConfig = getAppConfig()

        const config: AIServiceConfig = {
          type: appConfig.aiService,
          deepgramApiKey: appConfig.deepgramApiKey,
          openaiApiKey: appConfig.openaiApiKey,
          assemblyaiApiKey: appConfig.assemblyaiApiKey,
          language: appConfig.language,
        }

        // Create transcription service
        const service = AIServiceFactory.createTranscriptionService(config)
        
        // Create context service (optional)
        const contextService = AIServiceFactory.createContextService(config)
        if (contextService) {
          contextServiceRef.current = contextService
        }

        // Initialize service
        if ('initialize' in service && typeof service.initialize === 'function') {
          await service.initialize()
        }

        const analyzer = new ConversationAnalyzer()
        const overlapManager = new OverlapManager()

        aiServiceRef.current = service as any
        analyzerRef.current = analyzer
        overlapManagerRef.current = overlapManager

        // Start transcription
        service.start(
          async (chunk: CaptionChunk) => {
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

            // Clean up old chunks to prevent memory leaks
            const cleanedChunks = cleanupOldChunks(displayChunks, 60000, 50)

            // Update display chunks
            setChunks(cleanedChunks)
            setCurrentIndex(0)
          },
          (error: Error) => {
            const appError = handleError(error)
            logError(appError, { component: 'CaptionsPage' })
            showToast(appError.userMessage || 'Transcription error occurred', 'error')
          }
        )

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
        showToast(appError.userMessage || 'Failed to initialize transcription service', 'error')
        setPermissionState('denied')
      } finally {
        setIsInitializing(false)
      }
    }

    initializeService()

    return () => {
      if (aiServiceRef.current) {
        aiServiceRef.current.stop()
      }
    }
  }, [permissionState, isPaused, settings.captionMode, isInitializing])

  const togglePause = () => {
    if (!aiServiceRef.current) return
    if (isPaused) {
      setIsPaused(false)
    } else {
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

  // Show unsupported browser
  if (isSupported === false) {
    return (
      <ErrorBoundary>
        <UnsupportedBrowser />
      </ErrorBoundary>
    )
  }

  // Show permission prompt
  if (permissionState === 'denied') {
    return (
      <ErrorBoundary>
        <PermissionPrompt
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      </ErrorBoundary>
    )
  }

  // Show loading while checking or initializing
  if (permissionState === 'checking' || isSupported === null || isInitializing) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text={isInitializing ? 'Initializing AI transcription...' : 'Checking browser support...'}
        />
      </div>
    )
  }

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
