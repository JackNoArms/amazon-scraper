/**
 * Implements sliding window rate limiting algorithm.
 * Ensures compliant scraping by maintaining request intervals.
 */
export class RateLimiter {
  constructor(maxRequests, intervalMs) {
    this.maxRequests = maxRequests; // Max allowed requests
    this.intervalMs = intervalMs;   // Time window in milliseconds
    this.queue = [];               // Timestamps of recent requests
  }

  /**
   * Blocks until next available request slot
   * @returns {Promise<void>} Resolves when request can proceed
   */
  async wait() {
    const now = Date.now();
    
    // Purge old timestamps outside current window
    this.queue = this.queue.filter(timestamp => timestamp > now - this.intervalMs);
    
    if (this.queue.length >= this.maxRequests) {
      // Calculate delay needed to maintain rate limit
      const oldest = this.queue[0];
      const waitTime = this.intervalMs - (now - oldest);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.wait(); // Recursively check again after waiting
    }
    
    this.queue.push(now); // Record new request timestamp
  }
}