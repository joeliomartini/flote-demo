
import React from "react";
import { Product } from "../data/products";

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
        {product.featured && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white">
              Featured
            </span>
          </div>
        )}
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
