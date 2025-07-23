import { chromium } from 'playwright-core'
import type { ScreenshotOptions } from '@/types'

export async function captureScreenshot(
  url: string, 
  options: ScreenshotOptions = {}
): Promise<Buffer> {
  const {
    width = 1920,
    height = 1080,
    fullPage = true,
    quality = 90,
  } = options

  let browser = null

  try {
    // First, try Playwright approach
    return await captureWithPlaywright(url, { width, height, fullPage, quality })
  } catch (playwrightError) {
    console.warn('Playwright failed, trying htmlcsstoimage.com fallback:', playwrightError)
    
    // Fallback to htmlcsstoimage.com API
    try {
      return await captureWithHtmlCssToImage(url, { width, height, fullPage, quality })
    } catch (fallbackError) {
      console.error('Both screenshot methods failed:', { playwrightError, fallbackError })
      throw new Error(`All screenshot methods failed. Playwright: ${playwrightError instanceof Error ? playwrightError.message : 'Unknown error'}. Fallback: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`)
    }
  }
}

async function captureWithPlaywright(
  url: string, 
  options: ScreenshotOptions
): Promise<Buffer> {
  const { width = 1920, height = 1080, fullPage = true } = options
  let browser = null

  try {
    // Launch browser with Playwright
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    })

    const page = await browser.newPage({
      viewport: {
        width,
        height,
      },
    })

    // Set user agent to avoid bot detection
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    })

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for page to be fully loaded
    await page.waitForTimeout(2000)

    // Capture screenshot
    const screenshot = await page.screenshot({
      fullPage,
      type: 'png',
    })

    await browser.close()
    return screenshot

  } catch (error) {
    if (browser) {
      await browser.close()
    }
    throw error
  }
}

async function captureWithHtmlCssToImage(
  url: string, 
  options: ScreenshotOptions
): Promise<Buffer> {
  const { width = 1920, height = 1080 } = options

  // Check if API key is available
  if (!process.env.HTMLCSSTOIMAGE_API_KEY) {
    throw new Error('HTMLCSSTOIMAGE_API_KEY environment variable is required for fallback service')
  }

  try {
    const response = await fetch('https://hcti.io/v1/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.HTMLCSSTOIMAGE_API_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        url: url,
        viewport_width: width,
        viewport_height: height,
        device_scale: 2,
        format: 'png',
      }),
    })

    if (!response.ok) {
      throw new Error(`htmlcsstoimage.com API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.url) {
      throw new Error('No image URL returned from htmlcsstoimage.com')
    }

    // Download the image
    const imageResponse = await fetch(result.url)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image from htmlcsstoimage.com: ${imageResponse.status}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    return Buffer.from(arrayBuffer)

  } catch (error) {
    throw new Error(`htmlcsstoimage.com fallback failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Generate filename for screenshot
export function generateScreenshotFilename(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace(/^www\./, '')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `${hostname}-screenshot-${timestamp}.png`
  } catch {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `screenshot-${timestamp}.png`
  }
}

// Validate URL before capturing screenshot
export function validateScreenshotUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url)
    
    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' }
    }
    
    // Check if hostname is valid
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { valid: false, error: 'URL must have a valid hostname' }
    }
    
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}