
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";
import { handleSupabaseError, PRODUCT_SELECT_QUERY } from "./client";
import { formatProductData } from "./productFormatters";

/**
 * Fetches all products from the Supabase database
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT_QUERY)
    .order('name');

  if (error) {
    handleSupabaseError(error, 'Failed to fetch products');
  }

  return data.map(item => formatProductData(item));
};

/**
 * Fetches a single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT_QUERY)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  if (!data) return null;

  return formatProductData(data);
};
