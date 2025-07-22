'use client'

import { useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { isValidUrl } from '@/types'
import type { CosmicMedia, ScreenshotResponse } from '@/types'

interface ScreenshotFormProps {
  onScreenshotCapture: (media: CosmicMedia, url: string) => void;
}

export default function ScreenshotForm({ onScreenshotCapture }: ScreenshotFormProps) {
  const [url, setUrl] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!isValidUrl(url.trim())) {
      setError('Please enter a valid URL (including http:// or https://)')
      return
    }

    setIsCapturing(true)

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data: ScreenshotResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture screenshot')
      }

      if (data.success && data.media) {
        onScreenshotCapture(data.media, url.trim())
        setUrl('')
      } else {
        throw new Error(data.error || 'Failed to capture screenshot')
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      setError(error instanceof Error ? error.message : 'Failed to capture screenshot')
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-field"
            disabled={isCapturing}
            required
          />
          <p className="text-sm text-slate-500 mt-2">
            Enter the complete URL including http:// or https://
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg 
                className="w-5 h-5 text-red-400 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-red-800 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isCapturing || !url.trim()}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center"
        >
          {isCapturing ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-3">Capturing Screenshot...</span>
            </>
          ) : (
            <>
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              Capture Screenshot
            </>
          )}
        </button>
      </form>

      {isCapturing && (
        <div className="mt-6 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-600 mt-4">
            This may take a few moments while we capture and process your screenshot...
          </p>
        </div>
      )}
    </div>
  )
}