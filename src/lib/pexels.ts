interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

export class PexelsAPI {
  private apiKey: string;
  private baseUrl = 'https://api.pexels.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchPhotos(query: string, perPage: number = 1): Promise<PexelsPhoto[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            'Authorization': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      return data.photos;
    } catch (error) {
      console.error('Error fetching photos from Pexels:', error);
      return [];
    }
  }

  async getCuratedPhotos(perPage: number = 15): Promise<PexelsPhoto[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/curated?per_page=${perPage}`,
        {
          headers: {
            'Authorization': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      return data.photos;
    } catch (error) {
      console.error('Error fetching curated photos from Pexels:', error);
      return [];
    }
  }

  // Extract keywords from slide content to search for relevant images
  extractImageKeywords(slideTitle: string, slideContent: string[]): string {
    // Combine title and content
    const allText = [slideTitle, ...slideContent].join(' ').toLowerCase();
    
    // Remove common words and focus on meaningful keywords
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'this', 'that', 'these', 'those', 'a', 'an'];
    
    const words = allText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Take the first few meaningful words as search query
    const keywords = words.slice(0, 3).join(' ');
    
    // If no good keywords found, use the slide title
    return keywords || slideTitle;
  }
}

export type { PexelsPhoto };