import axios from 'axios';
import { RateLimiter } from './RateLimiter.js';

/**
 * Specialized HTTP client for Amazon scraping.
 * Handles: - Request throttling
 *          - Browser-like headers
 *          - Error translation
 * Note: Amazon frequently changes their anti-bot measures.
 */
export class AmazonHttpClient {
  constructor() {
    // Sliding window rate limiter (5 requests/10 seconds)
    this.rateLimiter = new RateLimiter(5, 10000); 
  }

  /**
   * Fetches search page HTML
   * @param {string} keyword - URL-encoded search term
   * @param {number} page - Pagination index
   * @returns {Promise<string>} Raw HTML response
   * @throws {Error} When request fails or gets blocked
   */
  async fetchSearchResults(keyword, page = 1) {
    await this.rateLimiter.wait(); // Enforces rate limit
    
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&page=${page}`;
    
    try {
      // Browser-like headers to avoid bot detection
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.amazon.com/'
        },
        timeout: 10000 // Fail fast if unresponsive
      });
      return response.data;
    } catch (error) {
      // Enhanced error logging for debugging
      console.error('Request failure:', {
        keyword,
        page,
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message
      });
      throw new Error(`Amazon request failed: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Translates low-level HTTP errors to user-friendly messages
   * @param {AxiosError} error - The original error
   * @returns {string} Business-readable error description
   */
  getErrorMessage(error) {
    if (error.response) {
      // Handle known Amazon anti-bot responses
      if (error.response.status === 503) return 'Service unavailable (bot detection triggered)';
      if (error.response.status === 404) return 'Search page not found';
      return `HTTP ${error.response.status} error`;
    }
    return error.message || 'Network request failed';
  }
}