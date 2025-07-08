import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGoldPricePerGram, calculateProductPrice } from './services/goldPriceService.js';
import { filterProducts } from './utils/productFilter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, 'products.json');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://renart-nh39.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

let productsData = [];

(async () => {
  app.get('/favicon.ico', (req, res) => res.status(204).end());

  try {
    const rawData = await fs.readFile(productsPath, 'utf-8');
    productsData = JSON.parse(rawData);
    console.log("products.json başarıyla yüklendi.");

    app.get('/', (req, res) => {
      res.send('Product Listing API is running!');
    });

    app.get('/api/products', async (req, res) => {
      try {
        const goldPrice = await getGoldPricePerGram();

        if (goldPrice === null) {
          return res.status(500).json({ message: 'Altın fiyatı alınamadı.' });
        }

        let productsWithPrice = productsData.map(product => ({
          ...product,
          price: calculateProductPrice(product, goldPrice)
        }));

        const filteredProducts = filterProducts(productsWithPrice, req.query);
        res.json(filteredProducts);
      } catch (error) {
        console.error("API /api/products rotasında bir hata oluştu:", error);
        res.status(500).json({ message: 'Sunucuda beklenmedik bir hata oluştu.' });
      }
    });

  } catch (error) {
    console.error("products.json dosyası okunamadı:", error);
  }
})();

export default app;
