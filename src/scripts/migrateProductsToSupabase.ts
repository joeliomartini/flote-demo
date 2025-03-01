
/**
 * This is a utility script to migrate local product data to Supabase.
 * It can be run manually when needed with:
 * 
 * import { migrateProductsToSupabase } from './scripts/migrateProductsToSupabase';
 * migrateProductsToSupabase();
 */

import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { toast } from "sonner";

export const migrateProductsToSupabase = async () => {
  try {
    // First check if products already exist in Supabase
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log(`Products already exist in Supabase (${count} found). Skipping migration.`);
      return false;
    }
    
    // Proceed with migration if no products exist
    const { data, error } = await supabase
      .from('products')
      .insert(products.map(product => ({
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
      })))
      .select();
    
    if (error) {
      console.error('Migration error:', error);
      toast.error('Failed to migrate products to Supabase');
      return false;
    }
    
    console.log(`Successfully migrated ${data.length} products to Supabase`);
    toast.success(`Successfully migrated ${data.length} products to Supabase`);
    return true;
    
  } catch (err) {
    console.error('Migration error:', err);
    toast.error('Failed to migrate products to Supabase');
    return false;
  }
};
