import { useState, useEffect } from 'react';
import { menuData, type MenuItem } from './menu-data';

export function useMenuStock() {
  const [dessertsWithStock, setDessertsWithStock] = useState<MenuItem[]>(menuData.desserts);

  useEffect(() => {
    const fetchAndMergeStock = async () => {
      try {
        const response = await fetch('/api/stock/desserts');
        if (response.ok) {
          const stockData = await response.json();
          const stockMap: Record<string, number> = {};
          stockData.forEach((item: { slug: string; stock: number }) => {
            stockMap[item.slug] = item.stock;
          });

          // Merge stock data with menu data
          const mergedDesserts = menuData.desserts.map((dessert) => {
            if (dessert.slug && stockMap[dessert.slug] !== undefined) {
              return { ...dessert, stock: stockMap[dessert.slug] };
            }
            return dessert;
          });

          setDessertsWithStock(mergedDesserts);
        }
      } catch (error) {
        console.error('Error fetching stock:', error);
        // Keep default menu data if fetch fails
      }
    };

    fetchAndMergeStock();
  }, []);

  return dessertsWithStock;
}

