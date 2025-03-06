
// Re-export all product-related functions from the refactored modules
// This maintains backward compatibility with existing imports

export { getProducts, getProductById } from './supabase/productQueries';
export { getProductsWithCategories } from './supabase/productCategoryOperations';
export { formatProductData } from './supabase/productFormatters';
