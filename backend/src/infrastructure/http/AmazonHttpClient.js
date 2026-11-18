import axios from 'axios';
import { RateLimiter } from './RateLimiter.js';

/** Simple public-page client. No proxy rotation, CAPTCHA bypass or login automation. */
export class AmazonHttpClient {
  constructor({ client = axios, rateLimiter = new RateLimiter(3, 10000) } = {}) {
    this.client = client;
    this.rateLimiter = rateLimiter;
  }

  async fetchSearchResults(keyword, page = 1) {
    await this.rateLimiter.wait();
    const url = new URL('https://www.amazon.com/s');
    url.searchParams.set('k', keyword);
    url.searchParams.set('page', String(page));
    try {
      const response = await this.client.get(url.toString(), {
        headers: { 'Accept-Language': 'en-US,en;q=0.7' },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403 || status === 429 || status === 503) {
        throw new Error('Consulta limitada pelo provedor; não tente contornar o bloqueio.');
      }
      throw new Error('Falha ao consultar dados públicos do provedor.');
    }
  }
}
