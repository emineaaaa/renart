export function filterProducts(products, filters) {
    let filtered = products;
  
    const { minPrice, maxPrice, minPopularity, maxPopularity } = filters;
  
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (minPopularity) {
      filtered = filtered.filter(p => p.popularityScore >= parseFloat(minPopularity));
    }
    if (maxPopularity) {
      filtered = filtered.filter(p => p.popularityScore <= parseFloat(maxPopularity));
    }
  
    return filtered;
  }
  