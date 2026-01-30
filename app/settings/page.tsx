'use client'

import { useRouter } from 'next/navigation'
import { useSettings } from '@/lib/settings'
import { TextSize, Theme, ChunkLength, SpeakerColorMode, CaptionMode, DisplayMode } from '@/lib/types'
import { BionicText } from '@/components/BionicText'

export default function SettingsPage() {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Back"
          >
            ← Back
          </button>
        </div>

        <div className="space-y-8">
          {/* Text Size */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Caption Text Size
            </h2>
            <div className="space-y-3">
              {(['small', 'medium', 'large'] as TextSize[]).map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  style={{
                    borderColor:
                      settings.textSize === size
                        ? '#0ea5e9'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="textSize"
                    value={size}
                    checked={settings.textSize === size}
                    onChange={(e) => updateSettings({ textSize: e.target.value as TextSize })}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                      {size}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <BionicText
                        text="This is a preview of how the text will look"
                        size={size}
                      />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Theme</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'high-contrast'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettings({ theme })}
                  className={`p-4 border-2 rounded-lg font-medium transition-colors capitalize ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {theme === 'high-contrast' ? 'High Contrast' : theme}
                </button>
              ))}
            </div>
          </section>

          {/* Chunk Length */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Chunk Length Preference
            </h2>
            <div className="space-y-3">
              {(['short', 'medium', 'long'] as ChunkLength[]).map((length) => (
                <label
                  key={length}
                  className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  style={{
                    borderColor:
                      settings.chunkLength === length
                        ? '#0ea5e9'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="chunkLength"
                    value={length}
                    checked={settings.chunkLength === length}
                    onChange={(e) =>
                      updateSettings({ chunkLength: e.target.value as ChunkLength })
                    }
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                      {length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {length === 'short'
                        ? 'Fewer words per chunk, easier to glance'
                        : length === 'medium'
                        ? 'Balanced chunk size for most conversations'
                        : 'More words per chunk, better for longer thoughts'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Speaker Color Mode */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Speaker Display
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(['colorful', 'minimal'] as SpeakerColorMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ speakerColorMode: mode })}
                  className={`p-4 border-2 rounded-lg font-medium transition-colors capitalize ${
                    settings.speakerColorMode === mode
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {mode === 'colorful'
                    ? 'Colorful (with colors)'
                    : 'Minimal (labels only)'}
                </button>
              ))}
            </div>
          </section>

          {/* Show History Toggle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Transcript History
            </h2>
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Show transcript history
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Enable the history button in the captions view
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showHistory}
                onChange={(e) => updateSettings({ showHistory: e.target.checked })}
                className="w-6 h-6"
              />
            </label>
          </section>

          {/* Caption Mode */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Caption Mode
            </h2>
            <div className="space-y-3">
              {(['social', 'accuracy'] as CaptionMode[]).map((mode) => (
                <label
                  key={mode}
                  className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  style={{
                    borderColor:
                      settings.captionMode === mode
                        ? '#0ea5e9'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="captionMode"
                    value={mode}
                    checked={settings.captionMode === mode}
                    onChange={(e) => updateSettings({ captionMode: e.target.value as CaptionMode })}
                    className="w-5 h-5 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                      {mode === 'social' ? '💬 Social Mode' : '📝 Accuracy Mode'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mode === 'social'
                        ? 'Slower, summarized, emotionally aware. Better for social connection.'
                        : 'Precise captions with all details. Best for technical or detailed conversations.'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Display Mode */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Display Mode
            </h2>
            <div className="space-y-3">
              {(['personal', 'shared'] as DisplayMode[]).map((mode) => (
                <label
                  key={mode}
                  className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  style={{
                    borderColor:
                      settings.displayMode === mode
                        ? '#0ea5e9'
                        : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="displayMode"
                    value={mode}
                    checked={settings.displayMode === mode}
                    onChange={(e) => updateSettings({ displayMode: e.target.value as DisplayMode })}
                    className="w-5 h-5 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white capitalize mb-1">
                      {mode === 'personal' ? '📱 Personal Device' : '📺 Shared Surface'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mode === 'personal'
                        ? 'Optimized for your phone or personal device.'
                        : 'For shared tablet, table display, or TV. Makes accessibility collective, not isolating.'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Group Feedback Toggle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Group Feedback
            </h2>
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Enable group feedback
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Show subtle nudges to hearing people about conversation dynamics (overlap, turn-taking, etc.)
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.groupFeedbackEnabled}
                onChange={(e) => updateSettings({ groupFeedbackEnabled: e.target.checked })}
                className="w-6 h-6"
              />
            </label>
            {settings.groupFeedbackEnabled && (
              <div className="mt-2 ml-4 text-sm text-blue-600 dark:text-blue-400">
                💡 Tip: Hearing people can view feedback at{' '}
                <button
                  onClick={() => router.push('/group-feedback')}
                  className="underline"
                >
                  /group-feedback
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
