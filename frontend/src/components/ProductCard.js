/**
 * UI component that renders a single product card with:
 * - Product image (with fallback)
 * - Title (truncated if too long)
 * - Rating stars visualization
 * - Price display
 * - Prime badge (if applicable)
 */
export class ProductCard {
  constructor(product) {
    this.product = product; // Product data object
  }

  /**
   * Creates DOM element for the product card
   * @returns {HTMLElement} Fully constructed card element
   */
  render() {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Using innerHTML for cleaner template (sanitization handled by browser)
    card.innerHTML = `
      <div class="product-image-container">
        <img src="${this.product.imageUrl || 'https://via.placeholder.com/150'}" 
             alt="${this.product.title}" 
             class="product-image"
             onerror="this.src='https://via.placeholder.com/150'">
      </div>
      <div class="product-details">
        <h3 class="product-title">${this.truncateTitle(this.product.title)}</h3>
        <div class="product-rating">
          ${this.renderRatingStars()}
          ${this.product.reviewCount ? `<span class="review-count">(${this.product.reviewCount})</span>` : ''}
        </div>
        <div class="price-section">
          ${this.product.price ? `<span class="price">${this.product.price}</span>` : '<span class="price-na">Price not available</span>'}
        </div>
        ${this.product.prime ? '<div class="prime-badge"><span class="prime-icon">✓</span> Prime</div>' : ''}
      </div>
    `;
    
    return card;
  }

  /**
   * Generates star rating visualization
   * @returns {string} HTML string of stars (★, ½, ☆)
   */
  renderRatingStars() {
    if (!this.product.rating) return '<span class="no-rating">No ratings</span>';
    
    const fullStars = Math.floor(this.product.rating);
    const hasHalfStar = this.product.rating % 1 >= 0.5;
    let stars = '';
    
    // Build 5-star representation
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★'; // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars += '½'; // Half star
      } else {
        stars += '☆'; // Empty star
      }
    }
    
    return `<span class="stars">${stars}</span>`;
  }

  /**
   * Shortens long product titles
   * @param {string} title - Original title
   * @param {number} maxLength - Maximum allowed characters
   * @returns {string} Truncated title with ellipsis if needed
   */
  truncateTitle(title, maxLength = 60) {
    return title.length > maxLength 
      ? `${title.substring(0, maxLength)}...` 
      : title;
  }
}