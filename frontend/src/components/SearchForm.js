/**
 * Reusable search input component with:
 * - Input validation
 * - Submit handler
 * - Search icon SVG
 */
export class SearchForm {
  /**
   * @param {Function} onSearch - Callback when form is submitted
   */
  constructor(onSearch) {
    this.onSearch = onSearch; // Parent component callback
  }

  /**
   * Builds search form DOM
   * @returns {HTMLElement} Form element with event listeners
   */
  render() {
    const form = document.createElement('form');
    form.className = 'search-form';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for products...';
    input.className = 'search-input';
    input.required = true;
    
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'search-button';
    button.innerHTML = `
      <svg class="search-icon" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    `;
    
    form.appendChild(input);
    form.appendChild(button);
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = input.value.trim();
      if (searchTerm.length >= 2) {
        this.onSearch(searchTerm);
      } else {
        input.setCustomValidity('Minimum 2 characters required');
        input.reportValidity();
      }
    });
    
    return form;
  }
}