
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  subcategories?: Category[];
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  
  // Build hierarchical structure
  const categories = data as Category[];
  const categoryMap = new Map<string, Category>();
  
  // First, map all categories by ID
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, subcategories: [] });
  });
  
  // Then, build the hierarchy
  const rootCategories: Category[] = [];
  
  categories.forEach(category => {
    const mappedCategory = categoryMap.get(category.id);
    
    if (category.parent_id) {
      // This is a subcategory, add it to its parent
      const parent = categoryMap.get(category.parent_id);
      if (parent && parent.subcategories) {
        parent.subcategories.push(mappedCategory as Category);
      }
    } else {
      // This is a root category
      rootCategories.push(mappedCategory as Category);
    }
  });
  
  return rootCategories;
};

export const getAllFlatCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  
  return data as Category[];
};
