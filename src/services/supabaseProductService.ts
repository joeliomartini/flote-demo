
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
      details,
      packaging_type_id,
      packaging_types:packaging_type_id(name)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }

  // Map the Supabase data to match our Product interface
  return data.map(item => {
    // Safely handle the details field
    let processedDetails = {};
    if (item.details && typeof item.details === 'object' && !Array.isArray(item.details)) {
      processedDetails = {
        material: item.details.material as string | undefined,
        dimensions: item.details.dimensions as string | undefined,
        weight: item.details.weight as string | undefined,
        color: Array.isArray(item.details.color) 
          ? item.details.color as string[] 
          : undefined
      };
    }

    // Extract packaging type name if available
    let packagingType = null;
    if (item.packaging_types && typeof item.packaging_types === 'object') {
      packagingType = item.packaging_types.name;
    }

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
      details: processedDetails,
      packaging_type_id: item.packaging_type_id,
      packaging_type: packagingType
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
      details,
      packaging_type_id,
      packaging_types:packaging_type_id(name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  // Safely handle the details field
  let processedDetails = {};
  if (data.details && typeof data.details === 'object' && !Array.isArray(data.details)) {
    processedDetails = {
      material: data.details.material as string | undefined,
      dimensions: data.details.dimensions as string | undefined,
      weight: data.details.weight as string | undefined,
      color: Array.isArray(data.details.color) 
        ? data.details.color as string[] 
        : undefined
    };
  }

  // Extract packaging type name if available
  let packagingType = null;
  if (data.packaging_types && typeof data.packaging_types === 'object') {
    packagingType = data.packaging_types.name;
  }

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
    details: processedDetails,
    packaging_type_id: data.packaging_type_id,
    packaging_type: packagingType
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
