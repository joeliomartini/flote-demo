
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";
import { getProducts } from "./productQueries";
import { handleSupabaseError } from "./client";

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
    handleSupabaseError(error, 'Failed to fetch categories');
  }

  // Create a map of category ids to category objects
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
