
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../data/products";

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*');
  
  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
  
  return data as Brand[];
};

export const getBrandById = async (id: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching brand with ID ${id}:`, error);
    return null;
  }
  
  return data as Brand;
};

export const getProductsByBrandId = async (brandId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId);
  
  if (error) {
    console.error(`Error fetching products for brand ID ${brandId}:`, error);
    return [];
  }
  
  return data as unknown as Product[];
};
