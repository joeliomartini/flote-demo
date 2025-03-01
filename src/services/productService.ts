
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

// Helper function to map database fields to our Product interface
const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    price: dbProduct.price,
    image: dbProduct.image || '',
    category: dbProduct.category || (dbProduct.category_id ? 'Unknown' : ''), // Handle category mapping
    featured: dbProduct.featured || false,
    brand: dbProduct.brand || (dbProduct.brand_id ? 'Unknown' : ''),
    type: dbProduct.type || '',
    thcContent: dbProduct.thc_content || '',
    weight: dbProduct.weight || '',
    packageQuantity: dbProduct.package_quantity || 0,
    details: dbProduct.details || {},
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    brand_id: dbProduct.brand_id,
    category_id: dbProduct.category_id
  };
};

// Fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return (data || []).map(mapDbProductToProduct);
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
  
  return data ? mapDbProductToProduct(data) : null;
};

// Insert a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  // Convert product object to match database schema
  const dbProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    featured: product.featured || false,
    brand: product.brand,
    type: product.type,
    thc_content: product.thcContent,
    weight: product.weight,
    package_quantity: product.packageQuantity,
    details: product.details
  };

  const { data, error } = await supabase
    .from('products')
    .insert(dbProduct)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  return mapDbProductToProduct(data);
};

// Update an existing product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  // Convert product object to match database schema
  const dbProduct: any = {};
  
  if (product.name) dbProduct.name = product.name;
  if (product.description) dbProduct.description = product.description;
  if (product.price) dbProduct.price = product.price;
  if (product.image) dbProduct.image = product.image;
  if (product.category) dbProduct.category = product.category;
  if (product.featured !== undefined) dbProduct.featured = product.featured;
  if (product.brand) dbProduct.brand = product.brand;
  if (product.type) dbProduct.type = product.type;
  if (product.thcContent) dbProduct.thc_content = product.thcContent;
  if (product.weight) dbProduct.weight = product.weight;
  if (product.packageQuantity) dbProduct.package_quantity = product.packageQuantity;
  if (product.details) dbProduct.details = product.details;

  const { data, error } = await supabase
    .from('products')
    .update(dbProduct)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return mapDbProductToProduct(data);
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Migrate products from local data to Supabase
export const migrateProductsToSupabase = async (): Promise<boolean> => {
  try {
    const { products } = await import('@/data/products');
    
    // Check if products already exist in Supabase
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking products:', countError);
      throw countError;
    }
    
    if (count && count > 0) {
      console.log(`Products already exist in Supabase (${count} found). Skipping migration.`);
      return false;
    }
    
    // Proceed with migration if no products exist
    const dbProducts = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      featured: product.featured || false,
      brand: product.brand,
      type: product.type,
      thc_content: product.thcContent,
      weight: product.weight,
      package_quantity: product.packageQuantity,
      details: product.details
    }));
    
    const { data, error } = await supabase
      .from('products')
      .insert(dbProducts)
      .select();
    
    if (error) {
      console.error('Migration error:', error);
      return false;
    }
    
    console.log(`Successfully migrated ${data.length} products to Supabase`);
    return true;
    
  } catch (err) {
    console.error('Migration error:', err);
    return false;
  }
};

