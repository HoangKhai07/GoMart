// utils/productData.js
import fs from 'fs';
import path from 'path';

export const getProductsData = () => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileData);
    return products;
  } catch (error) {
    console.error('Lỗi khi đọc file sản phẩm:', error);
    return [];
  }
};

export const searchProducts = (keyword) => {
  const products = getProductsData();
  
  if (!keyword) return [];
  
  keyword = keyword.toLowerCase();
  
  return products.filter(product => {
    if (product.name && product.name.toLowerCase().includes(keyword)) return true;
    
    if (product.description && product.description.toLowerCase().includes(keyword)) return true;
    
    if (product.brand && product.brand.toLowerCase().includes(keyword)) return true;
    
    return false;
  });
};

export const getProductById = (productId) => {
  const products = getProductsData();
  return products.find(product => product._id.toString() === productId);
};