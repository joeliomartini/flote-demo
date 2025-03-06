
import React from "react";
import { Product } from "../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductClick,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-md mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No products found matching your criteria.</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('resetFilters'))}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
