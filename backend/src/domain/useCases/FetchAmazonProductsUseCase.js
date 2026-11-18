import { AmazonHttpClient } from '../../infrastructure/http/AmazonHttpClient.js';
import { AmazonParser } from '../../infrastructure/parsers/AmazonParser.js';

export class FetchAmazonProductsUseCase {
  constructor({ httpClient = new AmazonHttpClient(), parser = new AmazonParser() } = {}) {
    this.httpClient = httpClient;
    this.parser = parser;
  }
  async execute(keyword, page = 1) {
    const query = typeof keyword === 'string' ? keyword.trim() : '';
    if (query.length < 2 || query.length > 90) {
      throw new RangeError('Informe entre 2 e 90 caracteres para a busca.');
    }
    if (!Number.isSafeInteger(page) || page < 1 || page > 3) {
      throw new RangeError('A página deve estar entre 1 e 3.');
    }
    const html = await this.httpClient.fetchSearchResults(query, page);
    return this.parser.parse(html);
  }
}
