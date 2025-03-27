import { AmazonHttpClient } from '../../infrastructure/http/AmazonHttpClient.js';
import { AmazonParser } from '../../infrastructure/parsers/AmazonParser.js';

/**
 * Core business use case for product search.
 * Coordinates between network layer (HTTP) and data layer (Parser).
 * Implements Command Pattern for operation encapsulation.
 */
export class FetchAmazonProductsUseCase {
  constructor() {
    // Concrete dependencies - consider injecting these for testing
    this.httpClient = new AmazonHttpClient(); // Handles HTTP transport
    this.parser = new AmazonParser();         // Handles HTML data extraction
  }

  /**
   * Executes product search pipeline
   * @param {string} keyword - Search phrase (min 2 chars)
   * @param {number} page - Pagination index (1-based)
   * @returns {Promise<Object[]>} List of product data objects
   * @throws {Error} When input validation fails or network errors occur
   */
  async execute(keyword, page = 1) {
    // Early validation prevents unnecessary HTTP calls
    if (!keyword || keyword.trim().length < 2) {
      throw new Error('Search keyword must contain at least 2 characters');
    }
    
    // Pipeline: Network call → Data parsing → Normalization
    const html = await this.httpClient.fetchSearchResults(keyword, page);
    return this.parser.parse(html);
  }
}