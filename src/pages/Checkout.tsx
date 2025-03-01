
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, ChevronLeft, CreditCard, Landmark, Clock, PlusCircle, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  email: string;
}

interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bypassCartCheck] = useState(location.state?.bypassCheck || true);
  const [selectedAddress, setSelectedAddress] = useState<string>("default");
  const [newAddress, setNewAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA"
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Default address for demo purposes
  const defaultAddress: Address = {
    id: "default",
    line1: "416 N Ida Ave",
    city: "Bozeman",
    state: "MT",
    zip: "59715",
    country: "USA",
    isDefault: true
  };

  const [addresses, setAddresses] = useState<Address[]>([defaultAddress]);

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

  const handleAddNewAddress = () => {
    const newAddr: Address = {
      id: `address-${Date.now()}`,
      line1: newAddress.line1,
      line2: newAddress.line2,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      country: newAddress.country,
      isDefault: false
    };

    setAddresses([...addresses, newAddr]);
    setSelectedAddress(newAddr.id);
    setAddressModalOpen(false);
    
    // Reset form
    setNewAddress({
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    });
    
    toast.success("New address added", {
      description: "Your shipping address has been updated"
    });
  };

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
                      <div className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                        {userProfile.first_name || "Test"}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <div className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                        {userProfile.last_name || "User"}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                        {userProfile.email}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                        {userProfile.phone || "555-123-4567"}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                  <RadioGroup 
                    value={selectedAddress} 
                    onValueChange={setSelectedAddress}
                    className="space-y-2"
                  >
                    {addresses.map(address => (
                      <div 
                        key={address.id}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {address.isDefault && <span className="inline-block bg-primary/10 text-xs rounded px-2 py-0.5 mr-2">Default</span>}
                            Shipping Address
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {address.line1}
                            {address.line2 && `, ${address.line2}`}
                            <br />
                            {address.city}, {address.state} {address.zip}
                          </div>
                        </div>
                        <RadioGroupItem value={address.id} className="ml-3" />
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="mt-3 w-full flex items-center justify-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                          Enter your shipping address details below
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input 
                            id="street" 
                            placeholder="123 Main St" 
                            value={newAddress.line1}
                            onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="apt">Apartment, suite, etc. (optional)</Label>
                          <Input 
                            id="apt" 
                            placeholder="Apt 4B" 
                            value={newAddress.line2 || ""}
                            onChange={(e) => setNewAddress({...newAddress, line2: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                              id="city" 
                              placeholder="New York" 
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="state">State</Label>
                            <Input 
                              id="state" 
                              placeholder="NY" 
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input 
                              id="zip" 
                              placeholder="10001" 
                              value={newAddress.zip}
                              onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input 
                              id="country" 
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setAddressModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleAddNewAddress}
                          disabled={!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.zip}
                        >
                          Save Address
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">
                            Pay when your order is delivered
                          </div>
                        </div>
                      </div>
                      <RadioGroupItem value="cash" className="ml-3" />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">ACH Payment</div>
                          <div className="text-sm text-muted-foreground">
                            Direct bank transfer
                          </div>
                        </div>
                      </div>
                      <RadioGroupItem value="ach" className="ml-3" />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Open a Line of Credit</div>
                          <div className="text-sm text-muted-foreground">
                            Flexible payment option for qualified customers
                          </div>
                        </div>
                      </div>
                      <RadioGroupItem value="credit" className="ml-3" />
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
