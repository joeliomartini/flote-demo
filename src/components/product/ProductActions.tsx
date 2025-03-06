
import React from "react";
import { Button } from "@/components/ui/button";
import QuantityCounter from "../QuantityCounter";

interface ProductActionsProps {
  quantity: number;
  onQuantityChange: (value: number) => void;
  onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  quantity, 
  onQuantityChange, 
  onAddToCart 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <QuantityCounter
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={10}
        />
      </div>
      
      <Button 
        onClick={onAddToCart} 
        className="w-full"
        size="lg"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductActions;
