import { FetchAmazonProductsUseCase } from '../../domain/useCases/FetchAmazonProductsUseCase.js';

/**
 * HTTP controller for product scraping endpoint.
 * Handles request/response cycle and error formatting.
 */
export class ScrapeController {
  constructor(fetchProductsUseCase = new FetchAmazonProductsUseCase()) {
    this.fetchProductsUseCase = fetchProductsUseCase; // Use case dependency
  }

  /**
   * Handles GET /scrape requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async scrapeProducts(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ 
          error: 'Missing required parameter: keyword',
          example: '/scrape?keyword=iphone'
        });
      }
      
      const products = await this.fetchProductsUseCase.execute(keyword);
    
      if (products.length === 0) {
        return res.status(404).json({ 
          message: 'No products found',
          suggestion: 'Try adjusting search terms or check Amazon availability'
        });
      }

      res.json(products);
    } catch (error) {
      console.error('Scraping failed:', error);
      res.status(500).json({ 
        error: error.message,
        details: 'Amazon may have blocked the request. Try again later.'
      });
    }
  }
}