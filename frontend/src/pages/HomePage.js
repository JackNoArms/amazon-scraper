import { SearchForm } from '../components/SearchForm.js';
import { ProductCard } from '../components/ProductCard.js';
import { ApiClient } from '../core/api/apiClient.js';

/**
 * Main page component orchestrating:
 * - Search functionality
 * - Product display
 * - Pagination
 * - Loading states
 */
export class HomePage {
  constructor() {
    this.apiClient = new ApiClient();
    this.productsContainer = document.createElement('div');
    this.productsContainer.className = 'products-container';
    
    // Loading indicator component
    this.loading = document.createElement('div');
    this.loading.className = 'loading hidden';
    this.loading.innerHTML = '<div class="spinner"></div><p>Searching products...</p>';
    
    // State management
    this.currentProducts = [];
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.currentKeyword = '';
    this.totalPages = 1;
  }

  /**
   * Handles search execution and state updates
   * @param {string} keyword - Search term
   * @param {number} page - Page number (default: 1)
   */
  async handleSearch(keyword, page = 1) {
    if (page < 1) return;

    // Show loading state
    this.loading.classList.remove('hidden');
    this.currentKeyword = keyword;
    this.currentPage = page;
    
    try {
      const response = await this.apiClient.scrapeProducts(keyword, page);

      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response format');
      }
      
      // Calculate pagination
      this.totalPages = Math.ceil(response.length / this.itemsPerPage);
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.currentProducts = response.slice(start, end);

      this.displayProducts(this.currentProducts);
      this.renderPagination();
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.loading.classList.add('hidden');
    }
  }

  /**
   * Renders product cards in container
   * @param {Object[]} products - Product data array
   */
  displayProducts(products) {
    this.productsContainer.innerHTML = '';
    
    if (!products || products.length === 0) {
      this.productsContainer.innerHTML = '<p class="no-results">No products found. Try a different search.</p>';
      return;
    }
    
    products.forEach(product => {
      const card = new ProductCard(product).render();
      this.productsContainer.appendChild(card);
    });
  }

  /**
   * Creates pagination controls
   */
  renderPagination() {
    // Clear existing pagination
    document.querySelector('.pagination')?.remove();

    if (this.totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '&larr; Previous';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => 
      this.handleSearch(this.currentKeyword, this.currentPage - 1)
    );
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Next &rarr;';
    nextBtn.disabled = this.currentPage >= this.totalPages;
    nextBtn.addEventListener('click', () => 
      this.handleSearch(this.currentKeyword, this.currentPage + 1)
    );
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    
    pagination.append(prevBtn, pageInfo, nextBtn);
    document.querySelector('.home-page').appendChild(pagination);
  }

  /**
   * Displays error message
   * @param {string} message - Error text
   */
  showError(message) {
    this.productsContainer.innerHTML = `
      <p class="error-message">
        ${message}
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </p>
    `;
  }

  /**
   * Builds page structure
   * @returns {HTMLElement} Complete page DOM
   */
  render() {
    const page = document.createElement('div');
    page.className = 'home-page';
    
    // Header with title
    const title = document.createElement('h1');
    title.textContent = 'Amazon';
    
    const span = document.createElement('span');
    span.textContent = ' Scraper';
    span.className = 'scraper-text';
    title.appendChild(span);
    
    // Search form
    const searchForm = new SearchForm(keyword => {
      this.handleSearch(keyword);
    }).render();
    
    // Assemble page
    page.append(
      title,
      searchForm,
      this.loading,
      this.productsContainer
    );
    
    return page;
  }
}