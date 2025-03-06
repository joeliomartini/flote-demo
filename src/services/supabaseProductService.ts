
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
      pack_unit_id,
      pack_units:pack_unit_id(name),
      backordered,
      inventory
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

    // Extract pack unit name if available
    let packUnit = null;
    if (item.pack_units && typeof item.pack_units === 'object') {
      packUnit = item.pack_units.name;
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
      pack_unit_id: item.pack_unit_id,
      pack_unit: packUnit,
      backordered: item.backordered || false,
      inventory: item.inventory
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
      pack_unit_id,
      pack_units:pack_unit_id(name),
      backordered,
      inventory
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

  // Extract pack unit name if available
  let packUnit = null;
  if (data.pack_units && typeof data.pack_units === 'object') {
    packUnit = data.pack_units.name;
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
    pack_unit_id: data.pack_unit_id,
    pack_unit: packUnit,
    backordered: data.backordered || false,
    inventory: data.inventory
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
    .select('id, name, parent_id');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return products;
  }

  // Create a map of category ids to names and full category objects
  const categoryMap = new Map(
    categories.map(category => [category.id, category])
  );

  // Add the category name to each product and build category path
  return products.map(product => {
    // Build category path array
    const categoryPath = [];
    let currentCategoryId = product.category_id;
    
    // Build the category path from the current category up to root
    while (currentCategoryId && categoryMap.has(currentCategoryId)) {
      const category = categoryMap.get(currentCategoryId);
      if (category) {
        categoryPath.unshift({
          id: category.id,
          name: category.name
        });
        currentCategoryId = category.parent_id;
      } else {
        break;
      }
    }

    return {
      ...product,
      category: product.category_id ? (categoryMap.get(product.category_id)?.name || "") : "",
      categoryPath: categoryPath
    };
  });
};
