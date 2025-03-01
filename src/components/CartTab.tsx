
import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartTab: React.FC = () => {
  const { toggleCart, itemCount } = useCart();

  return (
    <div 
      className="cart-tab group hover:shadow-xl hover:translate-x-0 relative"
      onClick={toggleCart}
      aria-label="Open cart"
      style={{ transform: itemCount === 0 ? 'translateX(100%)' : 'translateX(0)' }}
    >
      {itemCount > 0 && (
        <>
          {/* Pulsing background circle positioned at top left */}
          <div className="absolute -top-2 -left-2 badge-pulse rounded-full bg-red-500 h-5 w-5" />
          
          {/* Static badge with counter positioned at top left */}
          <div className="absolute -top-2 -left-2 flex items-center justify-center bg-red-500 text-white rounded-full h-5 w-5 text-xs font-bold">
            {itemCount}
          </div>
        </>
      )}
      
      <div className="flex flex-col items-center">
        <div className="relative">
          <ShoppingBag className="h-6 w-6 mb-1 group-hover:animate-float" />
        </div>
        
        <span className="text-xs font-medium whitespace-nowrap mt-1">Checkout</span>
      </div>
    </div>
  );
};

export default CartTab;
