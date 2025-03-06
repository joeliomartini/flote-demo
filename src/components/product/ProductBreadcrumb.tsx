
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  categoryPath?: Array<{ id: string; name: string }>;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ categoryPath }) => {
  if (!categoryPath || categoryPath.length === 0) return null;
  
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Shop</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        
        {categoryPath.map((category, index) => (
          <React.Fragment key={category.id}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${category.id}`}>
                {category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {index < categoryPath.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;
