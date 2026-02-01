'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppSettings, TextSize, Theme, ChunkLength, SpeakerColorMode, CaptionMode, DisplayMode } from './types'

const defaultSettings: AppSettings = {
  textSize: 'medium',
  theme: 'light',
  chunkLength: 'medium',
  speakerColorMode: 'colorful',
  showHistory: true,
  captionMode: 'social',
  displayMode: 'personal',
  groupFeedbackEnabled: false,
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('caption-settings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (e) {
          // Silent fail - use defaults
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    // Save settings to localStorage
    try {
      localStorage.setItem('caption-settings', JSON.stringify(settings))
    } catch (e) {
      // Silent fail if localStorage unavailable
    }
    
    // Apply theme
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'high-contrast')
    
    if (settings.theme === 'high-contrast') {
      root.classList.add('high-contrast', 'dark')
      root.style.colorScheme = 'dark'
    } else if (settings.theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
  }, [settings, mounted])

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  // Always provide context value, even before mounted
  // This prevents "must be used within SettingsProvider" errors
  const contextValue = {
    settings: mounted ? settings : defaultSettings,
    updateSettings,
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  // Always return default settings if context is undefined (shouldn't happen, but safe fallback)
  if (context === undefined) {
    // Return default settings instead of throwing - prevents crashes
    return {
      settings: defaultSettings,
      updateSettings: () => {},
    }
  }
  return context
}
