import { NextRequest, NextResponse } from 'next/server'
import { captureScreenshot } from '@/lib/screenshot'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    // Validate the URL parameter
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Capture the screenshot
    const screenshotResult = await captureScreenshot(url)

    return NextResponse.json(screenshotResult)
  } catch (error) {
    console.error('Screenshot API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to capture screenshot',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}