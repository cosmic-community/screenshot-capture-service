'use client'

import { useState } from 'react'
import type { CosmicMedia } from '@/types'

interface ScreenshotPreviewProps {
  media: CosmicMedia;
  sourceUrl: string;
  onNewScreenshot: () => void;
}

export default function ScreenshotPreview({ media, sourceUrl, onNewScreenshot }: ScreenshotPreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showFullSize, setShowFullSize] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = media.url
    link.download = media.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this screenshot?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/screenshot/${media.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete screenshot')
      }

      onNewScreenshot()
    } catch (error) {
      console.error('Error deleting screenshot:', error)
      alert('Failed to delete screenshot. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const optimizedImageUrl = `${media.imgix_url}?w=800&h=600&fit=max&auto=format,compress`
  const fullSizeImageUrl = `${media.imgix_url}?w=1600&h=1200&fit=max&auto=format,compress`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Screenshot Captured</h2>
            <p className="text-slate-600 mt-1">
              Source: <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {sourceUrl}
              </a>
            </p>
          </div>
          <button
            onClick={onNewScreenshot}
            className="btn-secondary"
          >
            Capture New Screenshot
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="relative">
            <img
              src={optimizedImageUrl}
              alt={`Screenshot of ${sourceUrl}`}
              className="w-full h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setShowFullSize(true)}
            />
            <button
              onClick={() => setShowFullSize(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 px-3 py-2 rounded-lg shadow-md transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              View Full Size
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Image
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(media.url)}
            className="btn-secondary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy URL
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Screenshot Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-700">File Name:</span>
              <span className="ml-2 text-slate-600">{media.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">File Size:</span>
              <span className="ml-2 text-slate-600">{(media.size / 1024).toFixed(1)} KB</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Created:</span>
              <span className="ml-2 text-slate-600">
                {new Date(media.created_at).toLocaleDateString()} at {new Date(media.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Media ID:</span>
              <span className="ml-2 text-slate-600 font-mono text-xs">{media.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Size Modal */}
      {showFullSize && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowFullSize(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-medium"
            >
              Close ✕
            </button>
            <img
              src={fullSizeImageUrl}
              alt={`Full size screenshot of ${sourceUrl}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}