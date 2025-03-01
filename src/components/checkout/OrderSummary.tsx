
import React from "react";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/checkout";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" />
        Order Summary
      </h2>

      <Separator className="mb-4" />

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-1">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>Your cart is empty</p>
            <p className="text-xs mt-1">This is a preview of the checkout page</p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${items.length > 0 ? totalPrice.toFixed(2) : "0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-medium text-lg">
        <span>Total</span>
        <span>${items.length > 0 ? totalPrice.toFixed(2) : "0.00"}</span>
      </div>
    </div>
  );
};
