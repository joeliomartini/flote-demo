
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

/**
 * Get brand by ID
 */
export const getBrandById = async (brandId: string) => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .single();

  if (error) {
    console.error('Error fetching brand:', error);
    return null;
  }

  return data;
};

/**
 * Get all brands
 */
export const getAllBrands = async () => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return data;
};

/**
 * Get products by brand ID with category names
 */
export const getProductsByBrandId = async (brandId: string): Promise<Product[]> => {
  const { data: products, error } = await supabase
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
    .eq('brand_id', brandId)
    .order('name');

  if (error) {
    console.error('Error fetching products by brand:', error);
    return [];
  }

  // Get categories to map category_id to names
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('id, name');
  
  if (categoryError) {
    console.error('Error fetching categories:', categoryError);
    return [];
  }

  // Create a map of category ids to names
  const categoryMap = new Map(
    categories.map(category => [category.id, category.name])
  );

  // Map the Supabase data to match our Product interface
  return products.map(item => {
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
      category: item.category_id ? categoryMap.get(item.category_id) || "" : "",
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
