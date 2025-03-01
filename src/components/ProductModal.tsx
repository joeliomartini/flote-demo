
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "../data/products";
import QuantityCounter from "./QuantityCounter";
import { useCart } from "../context/CartContext";
import { Separator } from "@/components/ui/separator";

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
  const pricePerItem = product.packageQuantity && product.packageQuantity > 1
    ? (product.price / product.packageQuantity).toFixed(2)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 bg-secondary/30">
            <div className="relative aspect-square w-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover animate-blur-in"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            
            <div className="flex-1 overflow-auto pr-2">
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {product.category}
                </span>
                {product.type && product.type !== "Accessory" && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {product.type}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-medium tracking-tight">{product.name}</h2>
              
              {/* Price section with per item calculation */}
              <div className="mt-2 mb-4">
                <p className="text-2xl font-medium">${product.price.toFixed(2)}</p>
                {pricePerItem && (
                  <p className="text-sm text-muted-foreground">
                    ${pricePerItem} per item
                  </p>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4">{product.description}</p>
              
              {/* Product attributes */}
              <div className="space-y-3 mb-4">
                {product.brand && (
                  <div className="flex gap-2">
                    <span className="text-sm font-medium">Brand:</span>
                    <span className="text-sm text-muted-foreground">{product.brand}</span>
                  </div>
                )}
                
                {product.thcContent && (
                  <div className="flex gap-2">
                    <span className="text-sm font-medium">THC Content:</span>
                    <span className="text-sm text-muted-foreground">{product.thcContent}</span>
                  </div>
                )}
                
                {product.weight && (
                  <div className="flex gap-2">
                    <span className="text-sm font-medium">Weight:</span>
                    <span className="text-sm text-muted-foreground">{product.weight}</span>
                  </div>
                )}
                
                {product.packageQuantity && product.packageQuantity > 1 && (
                  <div className="flex gap-2">
                    <span className="text-sm font-medium">Package Quantity:</span>
                    <span className="text-sm text-muted-foreground">{product.packageQuantity} items</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              {/* Product details */}
              {product.details && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Additional Details</h3>
                  
                  {product.details.material && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Material:</span>
                      <span className="text-sm text-muted-foreground">{product.details.material}</span>
                    </div>
                  )}
                  
                  {product.details.dimensions && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Dimensions:</span>
                      <span className="text-sm text-muted-foreground">{product.details.dimensions}</span>
                    </div>
                  )}
                  
                  {product.details.weight && (
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Weight:</span>
                      <span className="text-sm text-muted-foreground">{product.details.weight}</span>
                    </div>
                  )}
                  
                  {product.details.color && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Available Colors:</span>
                      <div className="flex gap-2">
                        {product.details.color.map((color) => (
                          <span key={color} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <QuantityCounter
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
