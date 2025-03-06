
/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Calculates the price per item when package quantity exists
 */
export const calculatePricePerItem = (price: number, packageQuantity?: number): string | null => {
  if (packageQuantity && packageQuantity > 1) {
    return (price / packageQuantity).toFixed(2);
  }
  return null;
};

/**
 * Determines the pack unit display name (lowercase)
 */
export const getPackUnit = (packUnit?: string, packageQuantity?: number): string => {
  return packUnit 
    ? packUnit.toLowerCase()
    : (packageQuantity && packageQuantity > 1 ? 'case' : 'single');
};
