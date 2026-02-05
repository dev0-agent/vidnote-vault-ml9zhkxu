
/**
 * Extracts the YouTube video ID from various URL formats.
 * Supports: standard, short, embed, shorts, and mobile URLs.
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;

  // Pattern to match various YouTube URL formats
  const pattern = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})(?:[&?].*)?$/;
  
  const match = url.match(pattern);
  return match ? match[1] : null;
};

/**
 * Fetches the video title using the noembed.com oEmbed endpoint.
 * This avoids needing a YouTube Data API key.
 */
export const fetchVideoTitle = async (videoId: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const data = await response.json();
    
    if (data.error) {
      console.warn('noembed error:', data.error);
      return null;
    }
    
    return data.title || null;
  } catch (error) {
    console.error('Failed to fetch video title:', error);
    return null;
  }
};

/**
 * Validates if a string is a valid YouTube URL.
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  return extractYoutubeId(url) !== null;
};
