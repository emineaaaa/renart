import 'dotenv/config';  

const GOLD_API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_BASE_URL = process.env.GOLD_API_BASE_URL;
const GOLD_API_CURRENCIES = process.env.GOLD_API_CURRENCIES || 'XAU';

const GOLD_API_URL = `${GOLD_API_BASE_URL}?api_key=${GOLD_API_KEY}&base=USD&currencies=${GOLD_API_CURRENCIES}`;//dinamik api oluşturdum


export async function getGoldPricePerGram() {
  if (!GOLD_API_KEY || !GOLD_API_BASE_URL) {
    console.error("Hata: GOLD_API_KEY veya GOLD_API_BASE_URL .env dosyasında ayarlanmamış.");
    return null;
  }

  try {
    const response = await fetch(GOLD_API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Hatası! Durum kodu: ${response.status}, Mesaj: ${errorText}`);
    }

    const data = await response.json();
    console.log("API'den gelen ham veri:", data);

    if (data && data.rates && data.rates.XAU) {
        const goldPricePerOunce = data.rates.USDXAU; 
        const troyOunceToGram = 31.1035;
      const goldPricePerGram = goldPricePerOunce / troyOunceToGram; //Gram başına düşen hesabı

      console.log(`Güncel altın fiyatı (gram başına): ${goldPricePerGram.toFixed(2)} USD`);
      return goldPricePerGram;
    } else {
      console.error('API yanıt yapısı hatalı veya XAU kuru bulunamadı:', data);
      return null;
    }
  } catch (error) {
    console.error('Altın fiyatı çekilirken hata oluştu:', error.message);
    return null;
  }
}

export function calculateProductPrice(product, goldPricePerGram) {
  if (goldPricePerGram === null || isNaN(goldPricePerGram) || !product || isNaN(product.popularityScore) || isNaN(product.weight)) {
    console.warn("Ürün fiyatı hesaplanamadı: Geçersiz altın fiyatı, popülerlik skoru veya ağırlık.");
    return 0;
  }

  const price = (product.popularityScore + 1) * product.weight * goldPricePerGram;
  return parseFloat(price.toFixed(2));
}
