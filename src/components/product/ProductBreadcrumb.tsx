
import React from "react";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductBreadcrumbProps {
  categoryPath?: Array<Category>;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ categoryPath }) => {
  if (!categoryPath || categoryPath.length === 0) return null;

  return (
    <div className="mb-3 flex items-center text-xs text-muted-foreground">
      {categoryPath.map((cat, index) => (
        <React.Fragment key={cat.id}>
          <span className="font-medium">{cat.name}</span>
          {index < categoryPath.length - 1 && (
            <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground/70" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductBreadcrumb;
