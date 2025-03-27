import { JSDOM } from 'jsdom';

/**
 * HTML parser specialized for Amazon search results.
 * Extracts product data from DOM using CSS selectors.
 * Note: Selectors may break if Amazon changes markup.
 */
export class AmazonParser {
  /**
   * Parses HTML into structured product data
   * @param {string} html - Raw HTML from search page
   * @returns {Object[]} Array of product objects
   */
  parse(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const products = [];
    
    // Selector targets individual product cards
    const items = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');
    
    items.forEach(item => {
      try {
        // Extract data points with null checks
        const titleElement = item.querySelector('h2 a') || item.querySelector('.a-text-normal');
        const title = titleElement?.textContent?.trim();
        const url = titleElement?.href;
        
        const ratingText = item.querySelector('.a-icon-star-small .a-icon-alt')?.textContent;
        const rating = ratingText ? parseFloat(ratingText.split(' ')[0]) : null;
        
        const reviewCountText = item.querySelector('.a-size-small .a-link-normal')?.textContent;
        const reviewCount = reviewCountText ? reviewCountText.replace(/,/g, '') : null;
        
        const imageUrl = item.querySelector('.s-image')?.src;
        const price = item.querySelector('.a-price .a-offscreen')?.textContent;
        const isPrime = !!item.querySelector('.a-icon-prime');
        
        if (title) {
          products.push({
            title,
            url: url ? `https://www.amazon.com${url}` : null,
            rating,
            reviewCount,
            imageUrl,
            price,
            prime: isPrime
          });
        }
      } catch (error) {
        console.error('Failed to parse product element:', error);
      }
    });
    
    return products;
  }
}