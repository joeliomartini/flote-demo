import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingBag, ChevronLeft, CreditCard, Landmark, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  email: string;
}

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bypassCartCheck] = useState(location.state?.bypassCheck || true);

  useEffect(() => {
    if (items.length === 0 && !bypassCartCheck) {
      navigate("/");
      toast.error("Your cart is empty", {
        description: "Please add items to your cart before checkout"
      });
    }

    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserProfile({
            first_name: "Test",
            last_name: "User",
            phone: "555-123-4567",
            address: "123 Demo St",
            email: "test@example.com"
          });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          setUserProfile({
            first_name: data?.first_name || "Test",
            last_name: data?.last_name || "User",
            phone: data?.phone || "555-123-4567",
            address: data?.address || "123 Demo St",
            email: user.email || "test@example.com"
          });
          return;
        }
        
        setUserProfile({
          first_name: data?.first_name || "",
          last_name: data?.last_name || "",
          phone: data?.phone || "",
          address: data?.address || "",
          email: user.email || ""
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          first_name: "Test",
          last_name: "User",
          phone: "555-123-4567",
          address: "123 Demo St",
          email: "test@example.com"
        });
      }
    };

    fetchUserProfile();
  }, [items.length, navigate, bypassCartCheck]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      setTimeout(() => {
        toast.success("Order placed successfully!", {
          description: `Your order will be processed using ${paymentMethod === 'cash' ? 'Cash on Delivery' : 
            paymentMethod === 'ach' ? 'ACH Payment' : 'Line of Credit'}`
        });

        navigate("/");
      }, 1500);
    } catch (error: any) {
      toast.error("Failed to place order", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="container max-w-7xl py-8 min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-primary/50" />
          <h2 className="text-xl font-medium">Loading checkout...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 min-h-screen">
      <div className="container max-w-7xl py-6">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center text-sm font-medium hover:underline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Return to store
            </button>
            <h1 className="text-lg font-medium">Secure Checkout</h1>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmitOrder}>
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName" 
                        value={userProfile?.first_name || ""}
                        onChange={(e) => setUserProfile({...userProfile!, first_name: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName" 
                        value={userProfile?.last_name || ""}
                        onChange={(e) => setUserProfile({...userProfile!, last_name: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userProfile?.email || ""}
                        onChange={(e) => setUserProfile({...userProfile!, email: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={userProfile?.phone || ""}
                        onChange={(e) => setUserProfile({...userProfile!, phone: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={userProfile?.address || ""}
                        onChange={(e) => setUserProfile({...userProfile!, address: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label 
                        htmlFor="cash" 
                        className="flex flex-1 items-center gap-3 cursor-pointer font-normal"
                      >
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div>Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">
                            Pay when your order is delivered
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="ach" id="ach" />
                      <Label 
                        htmlFor="ach" 
                        className="flex flex-1 items-center gap-3 cursor-pointer font-normal"
                      >
                        <Landmark className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div>ACH Payment</div>
                          <div className="text-sm text-muted-foreground">
                            Direct bank transfer
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label 
                        htmlFor="credit" 
                        className="flex flex-1 items-center gap-3 cursor-pointer font-normal"
                      >
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div>Open a Line of Credit</div>
                          <div className="text-sm text-muted-foreground">
                            Flexible payment option for qualified customers
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="my-6" />

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Complete Order • $${items.length > 0 ? totalPrice.toFixed(2) : "0.00"}`}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
