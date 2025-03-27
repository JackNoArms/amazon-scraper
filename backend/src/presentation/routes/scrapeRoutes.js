import { Router } from 'express';
import { ScrapeController } from '../controllers/ScrapeController.js';
import { FetchAmazonProductsUseCase } from '../../domain/useCases/FetchAmazonProductsUseCase.js';

const router = Router();
const scrapeController = new ScrapeController(new FetchAmazonProductsUseCase());

/**
 * Route configuration for scraping endpoint
 * GET /scrape?keyword=:query - Triggers product search
 */
router.get('/', scrapeController.scrapeProducts.bind(scrapeController));

export const scrapeRouter = router;