import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the frontend URL from environment variable or fallback
 * Used for generating embed URLs and unique links
 */
export function getFrontendUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: prefer env variable, fallback to window.location.origin
    return process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin;
  }
  // Server-side: use env variable or fallback
  return process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
}

/**
 * Generate embed URL for a testimonial form
 */
export function getEmbedUrl(embedKey: string): string {
  const baseUrl = getFrontendUrl();
  return `${baseUrl}/embed/${embedKey}`;
}
