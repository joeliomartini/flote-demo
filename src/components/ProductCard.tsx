
import React from "react";
import { Product } from "../data/products";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="product-card group cursor-pointer" 
      onClick={onClick}
      aria-label={`View ${product.name} details`}
    >
      <div className="product-image-container aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="product-image animate-blur-in h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {product.featured && (
            <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white">
              Featured
            </span>
          )}
          {product.backordered && (
            <Badge className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Backordered</span>
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-1 pt-2">
        <h3 className="font-medium text-base leading-tight text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="font-medium">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
