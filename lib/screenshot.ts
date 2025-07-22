import puppeteer from 'puppeteer'
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
    // Launch browser with optimal settings for screenshot capture
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    // Set viewport size
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2, // For high-resolution screenshots
    })

    // Set user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    )

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for page to be fully loaded
    await page.waitForTimeout(2000)

    // Capture screenshot
    const screenshot = await page.screenshot({
      fullPage,
      type: 'png',
      quality: quality,
    })

    await browser.close()
    return screenshot as Buffer

  } catch (error) {
    if (browser) {
      await browser.close()
    }
    console.error('Error capturing screenshot:', error)
    throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`)
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