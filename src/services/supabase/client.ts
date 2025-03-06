
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to handle Supabase errors consistently
 */
export const handleSupabaseError = (error: any, message: string): never => {
  console.error(`${message}:`, error);
  throw new Error(message);
};

/**
 * Common query parameters and configurations
 */
export const PRODUCT_SELECT_QUERY = `
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
`;
