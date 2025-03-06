
import { Product } from "@/data/products";

/**
 * Formats raw Supabase product data to match our Product interface
 */
export const formatProductData = (item: any): Product => {
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
};
