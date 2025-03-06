
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Import the smaller components
import ProductImageSection from "./product/ProductImageSection";
import ProductBreadcrumb from "./product/ProductBreadcrumb";
import ProductPriceCard from "./product/ProductPriceCard";
import ProductDetails from "./product/ProductDetails";
import ProductActions from "./product/ProductActions";
import BackorderForm from "./product/BackorderForm";
import { capitalize, calculatePricePerItem, getPackUnit } from "./product/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setQuantity(1); // Reset quantity
  };

  // Calculate price per item if package quantity exists
  const pricePerItem = calculatePricePerItem(product.price, product.packageQuantity);

  // Get pack unit display name (lowercase)
  const packUnit = getPackUnit(product.pack_unit, product.packageQuantity);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Product Details: {product.name}</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col lg:flex-row">
          {/* Product Image - White background */}
          <ProductImageSection image={product.image} name={product.name} />

          {/* Product Details */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col h-[80vh] lg:h-auto">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <div className="flex-1 overflow-auto pr-2">
              {/* Breadcrumb-style category hierarchy */}
              <ProductBreadcrumb categoryPath={product.categoryPath} />
              
              {/* Backordered badge if applicable */}
              {product.backordered && (
                <Badge variant="destructive" className="mb-3 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Backordered</span>
                </Badge>
              )}
              
              <h2 className="text-2xl font-medium tracking-tight">{product.name}</h2>
              
              <p className="text-sm text-muted-foreground mb-4 mt-3">{product.description}</p>
              
              {/* Packaging info card */}
              <ProductPriceCard 
                price={product.price} 
                packUnit={packUnit}
                packageQuantity={product.packageQuantity}
                pricePerItem={pricePerItem}
                inventory={product.inventory}
                backordered={product.backordered}
              />
            </div>
            
            {/* Product Actions or Backorder Form */}
            {product.backordered ? (
              <BackorderForm productName={product.name} />
            ) : (
              <ProductActions 
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
              />
            )}
            
            {/* Product Details Accordion */}
            <div className="mt-4">
              <ProductDetails product={product} capitalize={capitalize} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
