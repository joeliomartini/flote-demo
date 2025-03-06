
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Product } from "../../data/products";

interface ProductDetailsProps {
  product: Product;
  capitalize: (str: string) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, capitalize }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Product Details Accordion */}
      <AccordionItem value="details">
        <AccordionTrigger className="text-sm">Additional Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm">
            {product.brand && (
              <div className="flex gap-2">
                <span className="font-medium">Brand:</span>
                <span className="text-muted-foreground">{product.brand}</span>
              </div>
            )}
            
            {product.pack_unit && (
              <div className="flex gap-2">
                <span className="font-medium">Pack Unit:</span>
                <span className="text-muted-foreground">{capitalize(product.pack_unit)}</span>
              </div>
            )}
            
            {product.packageQuantity && product.packageQuantity > 1 && (
              <div className="flex gap-2">
                <span className="font-medium">Items per {product.pack_unit?.toLowerCase() || 'case'}:</span>
                <span className="text-muted-foreground">{product.packageQuantity}</span>
              </div>
            )}
            
            {product.type && product.type !== "Accessory" && (
              <div className="flex gap-2">
                <span className="font-medium">Type:</span>
                <span className="text-muted-foreground">{product.type}</span>
              </div>
            )}
            
            {product.thcContent && (
              <div className="flex gap-2">
                <span className="font-medium">THC Content:</span>
                <span className="text-muted-foreground">{product.thcContent}</span>
              </div>
            )}
            
            {product.weight && (
              <div className="flex gap-2">
                <span className="font-medium">Weight:</span>
                <span className="text-muted-foreground">{product.weight}</span>
              </div>
            )}
            
            {product.details?.material && (
              <div className="flex gap-2">
                <span className="font-medium">Material:</span>
                <span className="text-muted-foreground">{product.details.material}</span>
              </div>
            )}
            
            {product.details?.dimensions && (
              <div className="flex gap-2">
                <span className="font-medium">Dimensions:</span>
                <span className="text-muted-foreground">{product.details.dimensions}</span>
              </div>
            )}
            
            {product.details?.weight && (
              <div className="flex gap-2">
                <span className="font-medium">Weight:</span>
                <span className="text-muted-foreground">{product.details.weight}</span>
              </div>
            )}
            
            {product.details?.color && (
              <div className="space-y-2">
                <span className="font-medium">Available Colors:</span>
                <div className="flex flex-wrap gap-2">
                  {product.details.color.map((color) => (
                    <span key={color} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* Usage Instructions Accordion - Static content */}
      <AccordionItem value="usage">
        <AccordionTrigger className="text-sm">Usage Instructions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>For adult use only. Keep out of reach of children and pets.</p>
            <p>Follow local regulations regarding use and consumption.</p>
            {product.type === "Edibles" && (
              <p>Start with a small amount and wait at least 90 minutes before consuming more.</p>
            )}
            {product.type === "Flower" && (
              <p>Store in a cool, dry place away from direct sunlight.</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* Legal Information Accordion - Static content */}
      <AccordionItem value="legal">
        <AccordionTrigger className="text-sm">Legal Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Products contain cannabis which can be intoxicating and may be habit forming.</p>
            <p>Cannabis can impair concentration, coordination, and judgment.</p>
            <p>Do not operate a vehicle or machinery under the influence of this drug.</p>
            <p>There may be health risks associated with consumption of these products.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductDetails;
