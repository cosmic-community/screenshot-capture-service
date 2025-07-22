// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Cosmic Media interface
interface CosmicMedia {
  id: string;
  name: string;
  original_name: string;
  url: string;
  imgix_url: string;
  size: number;
  type: string;
  folder?: string;
  metadata?: {
    source_url?: string;
    capture_timestamp?: string;
  };
  created_at: string;
  modified_at: string;
}

// Screenshot capture types
interface ScreenshotRequest {
  url: string;
  options?: ScreenshotOptions;
}

interface ScreenshotOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
}

interface ScreenshotResponse {
  success: boolean;
  media?: CosmicMedia;
  error?: string;
  message?: string;
}

// API response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
interface ScreenshotFormProps {
  onScreenshotCapture: (media: CosmicMedia) => void;
}

interface ScreenshotPreviewProps {
  media: CosmicMedia;
  sourceUrl: string;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Type guards
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isCosmicMedia(obj: any): obj is CosmicMedia {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.imgix_url === 'string';
}

// Utility types
type CreateScreenshotData = Omit<CosmicMedia, 'id' | 'created_at' | 'modified_at'>;

export type {
  CosmicObject,
  CosmicMedia,
  ScreenshotRequest,
  ScreenshotOptions,
  ScreenshotResponse,
  ApiResponse,
  ScreenshotFormProps,
  ScreenshotPreviewProps,
  LoadingSpinnerProps,
  CreateScreenshotData,
};

export {
  isValidUrl,
  isCosmicMedia,
};