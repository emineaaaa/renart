// Gerekli modülleri import et
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path'; // <--- EKLENDİ
import { fileURLToPath } from 'url'; // <--- EKLENDİ
import { getGoldPricePerGram, calculateProductPrice } from './services/goldPriceService.js';
import { filterProducts } from './utils/productFilter.js';

// --- GÜVENİLİR DOSYA YOLU OLUŞTURMA ---
// 1. Bu dosyanın (server.js) tam yolunu al
const __filename = fileURLToPath(import.meta.url);
// 2. Bu dosyanın bulunduğu klasörün yolunu al
const __dirname = path.dirname(__filename);
// 3. products.json için tam ve hatasız bir yol oluştur
const productsPath = path.join(__dirname, 'products.json');
// --- BİTTİ ---

const app = express();

app.use(cors());
app.use(express.json());

let productsData = [];

// Ana uygulama mantığı
(async () => {
    app.get('/favicon.ico', (req, res) => res.status(204).end());

  try {
    // Dosyayı güvenilir tam yolu kullanarak oku
    const rawData = await fs.readFile(productsPath, 'utf-8'); // <--- DEĞİŞTİRİLDİ
    productsData = JSON.parse(rawData);
    console.log("products.json başarıyla yüklendi.");

    // Rotalar
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