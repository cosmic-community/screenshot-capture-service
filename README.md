# Screenshot Capture Service

![Screenshot Capture Service](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=300&fit=crop&auto=format)

A powerful web application that captures high-quality screenshots from any website URL and automatically saves them to your Cosmic bucket's media library. Features both a user-friendly web interface and RESTful API endpoint for programmatic access.

## ✨ Features

- 🌐 **URL Screenshot Capture** - Enter any website URL to generate high-quality screenshots
- ☁️ **Cosmic Media Integration** - Automatic upload to your Cosmic bucket's media library
- 🔗 **RESTful API Endpoint** - `/api/screenshot` for programmatic screenshot generation
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 👀 **Preview & Download** - View screenshots before saving and download locally
- ⚡ **Real-time Processing** - Live status updates during screenshot capture
- 🛡️ **Error Handling** - Robust validation and error handling for invalid URLs
- 📋 **Screenshot History** - Track and manage all captured screenshots
- 🔄 **Dual Screenshot Methods** - Playwright primary with htmlcsstoimage.com fallback

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=6880179201d6b9914ef1f05e&clone_repository=688021ac17ea59ba72238335)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Build a webapp that can capture a screenshot from a webpage URL and save to the cosmic bucket media. Make a UI located on the home page with text input and an API endpoint that functions the same to take a URL and upload screenshot.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Playwright** - Modern browser automation for screenshot capture
- **htmlcsstoimage.com** - Fallback API service for screenshot generation
- **Cosmic SDK** - Content and media management
- **React** - UI component library

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- Bun package manager
- Cosmic account and bucket
- Optional: htmlcsstoimage.com API key for fallback service

### Installation

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd screenshot-capture-service
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Cosmic credentials:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   
   # Optional: For fallback service
   HTMLCSSTOIMAGE_API_KEY=your-htmlcsstoimage-api-key
   ```

4. **Run the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 Screenshot Methods

This application uses a dual-method approach for maximum reliability:

### Primary Method: Playwright
- **Modern browser automation** - More reliable than Puppeteer
- **Better performance** - Faster screenshot generation
- **Enhanced stability** - Better handling of complex websites
- **Local processing** - No external API dependencies

### Fallback Method: htmlcsstoimage.com API
- **Cloud-based service** - External API for screenshot generation
- **High reliability** - Professional screenshot service
- **Automatic fallback** - Activates when Playwright fails
- **Requires API key** - Sign up at [htmlcsstoimage.com](https://htmlcsstoimage.com)

## 📡 Cosmic SDK Examples

### Screenshot Media Upload

```typescript
import { cosmic } from '@/lib/cosmic'

// Upload screenshot to Cosmic media library
const uploadScreenshot = async (imageBuffer: Buffer, filename: string, sourceUrl: string) => {
  const formData = new FormData()
  const blob = new Blob([imageBuffer], { type: 'image/png' })
  formData.append('media', blob, filename)
  formData.append('folder', 'screenshots')
  
  const media = await cosmic.media.insertOne(formData)
  return media
}
```

### Retrieve Screenshot Media

```typescript
// Get all screenshots from media library
const getScreenshots = async () => {
  const media = await cosmic.media.find({
    folder: 'screenshots'
  }).props(['id', 'name', 'url', 'imgix_url', 'created_at'])
  
  return media.media
}
```

## 🌐 API Endpoint

### POST /api/screenshot

Capture a screenshot from a URL and save to Cosmic media library.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "media": {
    "id": "screenshot-id",
    "name": "example-com-screenshot.png",
    "url": "https://cdn.cosmicjs.com/...",
    "imgix_url": "https://imgix.cosmicjs.com/..."
  }
}
```

**Example Usage:**
```bash
curl -X POST http://localhost:3000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🎨 Cosmic CMS Integration

This application integrates with Cosmic's media management system to:

- **Store Screenshots** - All captured screenshots are automatically uploaded to your Cosmic bucket
- **Organize Media** - Screenshots are stored in a dedicated 'screenshots' folder
- **Optimize Images** - Leverage Cosmic's imgix integration for image optimization
- **Track Metadata** - Store source URL and capture timestamp with each screenshot

## 🚀 Deployment Options

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the deploy button above
2. Connect your GitHub repository
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the deploy button above
2. Connect your GitHub repository
3. Add environment variables in Netlify dashboard
4. Build command: `bun run build`
5. Publish directory: `out`

### Environment Variables

Make sure to set these environment variables in your hosting platform:

**Required:**
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

**Optional (for fallback service):**
```
HTMLCSSTOIMAGE_API_KEY=your-htmlcsstoimage-api-key
```

## 🔧 Troubleshooting

### Screenshot Issues
- **Playwright fails**: The app automatically falls back to htmlcsstoimage.com API
- **Both methods fail**: Check your environment variables and network connectivity
- **Memory issues**: Reduce screenshot dimensions or enable fullPage: false

### API Key Setup
1. Visit [htmlcsstoimage.com](https://htmlcsstoimage.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your environment variables

<!-- README_END -->