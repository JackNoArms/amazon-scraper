import express from 'express';
import cors from 'cors';
import { scrapeRouter } from './src/presentation/routes/scrapeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/scrape', scrapeRouter);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});