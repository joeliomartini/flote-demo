
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import QuantityCounter from "./QuantityCounter";
import { Separator } from "@/components/ui/separator";
import AuthModal from "./AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartDrawer: React.FC = () => {
  const {
    items,
    cartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    itemCount
  } = useCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const handleProceedToCheckout = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = async () => {
    setIsProcessingCheckout(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication required");
        setAuthModalOpen(true);
        return;
      }
      
      // Here you would create an order in your database
      // For now, we'll just show a success message
      toast.success("Proceeding to checkout!", {
        description: "You've successfully authenticated."
      });
      
      // In a real app, you'd redirect to a checkout page or process the order
      console.log("Creating order for user", user.id);
      console.log("Order items:", items);
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={open => !open && closeCart()}>
        <SheetContent className="flex flex-col w-[90vw] sm:max-w-md overflow-hidden p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Your Cart {itemCount > 0 && `(${itemCount})`}</span>
              </SheetTitle>
            </div>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground mt-1">Add items to your cart to see them here.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto px-6 py-2">
                <div className="space-y-4 py-2">
                  {items.map(item => (
                    <div key={item.product.id} className="animate-fade-in">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-secondary/30">
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                            <p className="text-muted-foreground text-xs">{item.product.category}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <QuantityCounter 
                              value={item.quantity} 
                              onChange={newQty => updateQuantity(item.product.id, newQty)} 
                              min={1} 
                              max={10} 
                            />
                            
                            <span className="font-medium text-sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 self-start" 
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fulfillment</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator className="my-[16px]" />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleProceedToCheckout}
                  disabled={isProcessingCheckout}
                >
                  {isProcessingCheckout ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthSuccess}
      />
    </>
  );
};

export default CartDrawer;
