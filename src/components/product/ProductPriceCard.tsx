
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductPriceCardProps {
  price: number;
  packUnit: string;
  packageQuantity?: number;
  pricePerItem: string | null;
}

const ProductPriceCard: React.FC<ProductPriceCardProps> = ({ 
  price, 
  packUnit, 
  packageQuantity, 
  pricePerItem 
}) => {
  return (
    <Card className="mt-3 mb-4 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex flex-col gap-1">
          {/* Price section with pack unit type */}
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-medium">${price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">per {packUnit}</p>
          </div>
          
          {/* Package quantity and price per item */}
          {packageQuantity && packageQuantity > 1 && (
            <div className="text-sm text-muted-foreground">
              Contains {packageQuantity} items at ${pricePerItem} per item
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPriceCard;
