/**
 * Domain model representing a product entity.
 * Contains core product attributes with no business logic.
 */
export default class Product {
  constructor({ title, rating, reviewCount, imageUrl }) {
    this.title = title;         // Product display name (max 200 chars typically)
    this.rating = rating;       // Star rating (0-5, may be null if unrated)
    this.reviewCount = reviewCount; // Total reviews (formatted as string in source)
    this.imageUrl = imageUrl;   // CDN URL for product thumbnail
  }
}