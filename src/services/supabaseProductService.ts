
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

/**
 * Fetches all products from the Supabase database
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image,
      featured,
      brand_id,
      category_id,
      thc_content,
      weight,
      package_quantity,
      type,
      details
    `)
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  // Map the Supabase data to match our Product interface
  return data.map(item => {
    const product: Product = {
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: Number(item.price),
      image: item.image || "https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "", // Will be populated later with category name
      featured: item.featured || false,
      brand_id: item.brand_id,
      category_id: item.category_id,
      thcContent: item.thc_content,
      weight: item.weight,
      packageQuantity: item.package_quantity,
      type: item.type,
      details: typeof item.details === 'object' ? item.details : {}
    };
    return product;
  });
};

/**
 * Fetches a single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price,
      image,
      featured,
      brand_id,
      category_id,
      thc_content,
      weight,
      package_quantity,
      type,
      details
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  // Map the Supabase data to match our Product interface
  const product: Product = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    price: Number(data.price),
    image: data.image || "https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "", // Will be populated later with category name
    featured: data.featured || false,
    brand_id: data.brand_id,
    category_id: data.category_id,
    thcContent: data.thc_content,
    weight: data.weight,
    packageQuantity: data.package_quantity,
    type: data.type,
    details: typeof data.details === 'object' ? data.details : {}
  };

  return product;
};

/**
 * Fetches products with category names included
 */
export const getProductsWithCategories = async (): Promise<Product[]> => {
  // First get all products
  const products = await getProducts();
  
  // Get all categories for reference
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return products;
  }

  // Create a map of category ids to names
  const categoryMap = new Map(
    categories.map(category => [category.id, category.name])
  );

  // Add the category name to each product
  return products.map(product => ({
    ...product,
    category: product.category_id ? categoryMap.get(product.category_id) || "" : ""
  }));
};
