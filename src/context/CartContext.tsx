
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../data/products";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartOpen: boolean;
  itemCount: number;
  totalPrice: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Update item count and total price whenever the cart changes
  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setItemCount(count);
    setTotalPrice(total);
  }, [items]);

  // Add item to cart
  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Item exists, update quantity
        return prevItems.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item, add to cart
        return [...prevItems, { product, quantity }];
      }
    });

    // Open cart and show toast
    setCartOpen(true);
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}`
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Cart visibility controls
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleCart = () => setCartOpen(prev => !prev);

  return (
    <CartContext.Provider value={{
      items,
      cartOpen,
      itemCount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      openCart,
      closeCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
