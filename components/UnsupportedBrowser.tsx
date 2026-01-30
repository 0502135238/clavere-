'use client'

export function UnsupportedBrowser() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Browser Not Supported</h2>
          <p className="text-gray-400 mb-6">
            CLAVERE requires a browser with speech recognition support. Please use one of the
            following browsers:
          </p>

          <div className="space-y-2 text-left mb-6">
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Google Chrome (recommended)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Microsoft Edge</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-yellow-400">⚠</span>
              <span>Safari (limited support)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-red-400">✗</span>
              <span>Firefox (not supported)</span>
            </div>
          </div>

          <a
            href="https://www.google.com/chrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Download Chrome
          </a>
        </div>
      </div>
    </div>
  )
}
