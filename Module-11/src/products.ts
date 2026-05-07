// src/product.ts

// --- Product Interface ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food';
  inStock: boolean;
  description?: string; // optional
}

// --- Sample Products ---
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'electronics', inStock: true },
  { id: 2, name: 'T-Shirt', price: 19.99, category: 'clothing', inStock: false },
  { id: 3, name: 'Chocolate Bar', price: 2.49, category: 'food', inStock: true },
  { id: 4, name: 'Headphones', price: 199.99, category: 'electronics', inStock: true },
  { id: 5, name: 'Jeans', price: 49.99, category: 'clothing', inStock: false }
];

// --- Functions ---
function getByCategory(products: Product[], cat: string): Product[] {
  return products.filter(p => p.category === cat);
}

function getAvailable(products: Product[]): Product[] {
  return products.filter(p => p.inStock);
}

function getTotalValue(products: Product[]): number {
  return products.reduce((total, p) => p.inStock ? total + p.price : total, 0);
}

// --- Print Results ---
console.log('Electronics:', getByCategory(products, 'electronics'));
console.log('Available Products:', getAvailable(products));
console.log('Total Value of In-Stock Items:', getTotalValue(products));