import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { getGoldPricePerGram, calculateProductPrice } from './services/goldPriceService.js';
import { filterProducts } from './utils/productFilter.js';

const app = express();


app.use(cors());
app.use(express.json());

let productsData = [];

(async () => {
    app.get('/favicon.ico', (req, res) => res.status(204).end());

  try {
    const rawData = await fs.readFile('./products.json', 'utf-8');
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

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });

  } catch (error) {
    console.error("products.json dosyası okunamadı:", error);
    process.exit(1);
  }
})();
