import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Upload screenshot to Cosmic media library
export async function uploadScreenshot(
  imageBuffer: Buffer, 
  filename: string, 
  sourceUrl: string
) {
  try {
    // Create proper media object for Cosmic SDK
    const mediaFile = {
      originalname: filename,
      buffer: imageBuffer,
      mimetype: 'image/png'
    }

    const media = await cosmic.media.insertOne({
      media: mediaFile,
      folder: 'screenshots',
      metadata: {
        source_url: sourceUrl,
        capture_timestamp: new Date().toISOString()
      }
    })
    
    return media.media
  } catch (error) {
    console.error('Error uploading screenshot to Cosmic:', error)
    if (hasStatus(error) && error.status === 413) {
      throw new Error('Screenshot file too large')
    }
    throw new Error('Failed to upload screenshot')
  }
}

// Get all screenshots from media library
export async function getScreenshots() {
  try {
    const response = await cosmic.media.find({
      folder: 'screenshots'
    }).props(['id', 'name', 'url', 'imgix_url', 'created_at', 'metadata'])
    
    return response.media
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [] // Handle empty results
    }
    console.error('Error fetching screenshots:', error)
    throw new Error('Failed to fetch screenshots')
  }
}

// Delete screenshot from media library
export async function deleteScreenshot(mediaId: string) {
  try {
    await cosmic.media.deleteOne(mediaId)
    return { success: true }
  } catch (error) {
    console.error('Error deleting screenshot:', error)
    throw new Error('Failed to delete screenshot')
  }
}