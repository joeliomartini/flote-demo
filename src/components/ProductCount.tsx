
import React from "react";

interface ProductCountProps {
  filteredCount: number;
  totalCount: number;
}

const ProductCount: React.FC<ProductCountProps> = ({ filteredCount, totalCount }) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} products
      </p>
    </div>
  );
};

export default ProductCount;
