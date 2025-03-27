/**
 * Service class for API communication
 * Handles:
 * - Request construction
 * - Error handling
 * - Response parsing
 */
export class ApiClient {
  /**
   * @param {string} baseURL - API base URL
   */
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  /**
   * Fetches products from scraping API
   * @param {string} keyword - Search term
   * @returns {Promise<Object[]>} Array of product objects
   * @throws {Error} On network issues or API errors
   */
  async scrapeProducts(keyword) {
    try {
      const response = await fetch(`${this.baseURL}/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error fetching products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('ApiClient error:', error);
      throw error; // Re-throw for error boundary handling
    }
  }
}