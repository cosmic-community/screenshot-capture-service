'use client'

import { useState } from 'react'
import ScreenshotForm from '@/components/ScreenshotForm'
import ScreenshotPreview from '@/components/ScreenshotPreview'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { CosmicMedia } from '@/types'

export default function HomePage() {
  const [capturedScreenshot, setCapturedScreenshot] = useState<CosmicMedia | null>(null)
  const [sourceUrl, setSourceUrl] = useState<string>('')

  const handleScreenshotCapture = (media: CosmicMedia, url: string) => {
    setCapturedScreenshot(media)
    setSourceUrl(url)
  }

  const handleNewScreenshot = () => {
    setCapturedScreenshot(null)
    setSourceUrl('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Screenshot Capture Service
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Enter any website URL to capture a high-quality screenshot and automatically save it to your Cosmic bucket media library.
          </p>
        </div>

        {!capturedScreenshot ? (
          <ScreenshotForm onScreenshotCapture={handleScreenshotCapture} />
        ) : (
          <ScreenshotPreview 
            media={capturedScreenshot} 
            sourceUrl={sourceUrl}
            onNewScreenshot={handleNewScreenshot}
          />
        )}

        <div className="mt-16 bg-white rounded-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">API Endpoint</h2>
          <p className="text-slate-600 mb-6">
            Use our RESTful API endpoint to capture screenshots programmatically:
          </p>
          
          <div className="bg-slate-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
            <div className="mb-4">
              <div className="text-slate-400 mb-2">POST /api/screenshot</div>
              <div className="text-green-400">
                curl -X POST {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/screenshot \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-d '{"{"}"url": "https://example.com"{"}"}'
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-4">
              <div className="text-slate-400 mb-2">Response:</div>
              <div className="text-blue-400">
                {`{
  "success": true,
  "media": {
    "id": "screenshot-id",
    "name": "example-com-screenshot.png",
    "url": "https://cdn.cosmicjs.com/...",
    "imgix_url": "https://imgix.cosmicjs.com/..."
  }
}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}