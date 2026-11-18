import express from 'express';
import cors from 'cors';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { scrapeRouter } from './src/presentation/routes/scrapeRoutes.js';

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'product-discovery-lab' }));
app.use('/api/scrape', scrapeRouter);
app.use((err, _req, res, _next) => {
  console.error('API request failed:', err?.name || 'UnknownError');
  res.status(500).json({ message: 'Erro interno temporário.' });
});

const PORT = Number(process.env.PORT || 3000);
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  app.listen(PORT, '127.0.0.1', () => console.log('API local em http://127.0.0.1:' + PORT));
}
export { app };
