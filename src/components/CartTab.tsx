
import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartTab: React.FC = () => {
  const { toggleCart, itemCount } = useCart();

  return (
    <div 
      className="cart-tab group hover:shadow-xl hover:translate-x-0"
      onClick={toggleCart}
      aria-label="Open cart"
      style={{ transform: itemCount === 0 ? 'translateX(100%)' : 'translateX(0)' }}
    >
      <div className="flex flex-col items-center">
        <ShoppingBag className="h-6 w-6 mb-1 group-hover:animate-float" />
        
        {itemCount > 0 && (
          <div className="relative">
            <span className="text-xs font-medium">({itemCount})</span>
          </div>
        )}
        
        <span className="text-xs font-medium whitespace-nowrap mt-1">Checkout</span>
      </div>
    </div>
  );
};

export default CartTab;
