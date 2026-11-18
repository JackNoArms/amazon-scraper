import { FetchAmazonProductsUseCase } from '../../domain/useCases/FetchAmazonProductsUseCase.js';

export class ScrapeController {
  constructor(fetchProductsUseCase = new FetchAmazonProductsUseCase()) {
    this.fetchProductsUseCase = fetchProductsUseCase;
  }
  async scrapeProducts(req, res) {
    const keyword = req.query?.keyword;
    const rawPage = req.query?.page ?? '1';
    const page = /^\d+$/.test(String(rawPage)) ? Number(rawPage) : NaN;
    try {
      const products = await this.fetchProductsUseCase.execute(keyword, page);
      return res.json({ products, page, count: products.length, source: 'amazon-public-search' });
    } catch (error) {
      if (error instanceof RangeError) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(502).json({
        message: 'Busca não disponível. O provedor pode restringir coleta automatizada.',
      });
    }
  }
}
