
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { ContactInformation } from "@/components/checkout/ContactInformation";
import { ShippingAddress } from "@/components/checkout/ShippingAddress";
import { FulfillmentMethod } from "@/components/checkout/FulfillmentMethod";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CameraModal } from "@/components/checkout/CameraModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfile, Address } from "@/types/checkout";

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [fulfillmentMethod, setFulfillmentMethod] = useState<string>("standard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bypassCartCheck] = useState(location.state?.bypassCheck || true);
  const [selectedAddress, setSelectedAddress] = useState<string>("default");
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "default",
      company: "Mountain Hardware Store",
      line1: "1842 Pine Ridge Road",
      city: "Whitefish",
      state: "MT",
      zip: "59937",
      country: "USA",
      isDefault: true
    }
  ]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

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
            first_name: "Example",
            last_name: "Customer",
            phone: "406-555-8901",
            address: "1842 Pine Ridge Road",
            email: "customer@example.com"
          });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const placeholderProfile = {
          first_name: "Example",
          last_name: "Customer",
          phone: "406-555-8901",
          address: "1842 Pine Ridge Road",
          email: user.email || "customer@example.com"
        };

        if (error || !data) {
          setUserProfile(placeholderProfile);
          return;
        }
        
        setUserProfile({
          first_name: data.first_name || placeholderProfile.first_name,
          last_name: data.last_name || placeholderProfile.last_name,
          phone: data.phone || placeholderProfile.phone,
          address: data.address || placeholderProfile.address,
          email: user.email || placeholderProfile.email
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          first_name: "Example",
          last_name: "Customer",
          phone: "406-555-8901",
          address: "1842 Pine Ridge Road",
          email: "customer@example.com"
        });
      }
    };

    fetchUserProfile();
  }, [items.length, navigate, bypassCartCheck]);

  const handleAddNewAddress = (newAddress: Omit<Address, "id" | "isDefault">) => {
    const newAddr: Address = {
      id: `address-${Date.now()}`,
      ...newAddress,
      isDefault: false
    };

    setAddresses([...addresses, newAddr]);
    setSelectedAddress(newAddr.id);
    
    toast.success("New address added", {
      description: "Your shipping address has been updated"
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await supabase.auth.getUser();
      
      if (paymentMethod === "cash") {
        setIsLoading(false);
        setCameraModalOpen(true);
        return;
      }
      
      setTimeout(() => {
        toast.success("Order placed successfully!", {
          description: `Your order will be processed using ${
            paymentMethod === 'ach' ? 'ACH Payment' : 'Line of Credit'
          }`
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

  const handleCameraSuccess = () => {
    setCameraModalOpen(false);
    
    setTimeout(() => {
      toast.success("Order placed successfully!", {
        description: "Cash payment verification complete. Your order will be processed."
      });
      navigate("/");
    }, 1000);
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
                <ContactInformation userProfile={userProfile} />
                
                <Separator className="my-6" />
                
                <ShippingAddress 
                  addresses={addresses} 
                  selectedAddress={selectedAddress}
                  onSelectAddress={setSelectedAddress}
                  onAddNewAddress={handleAddNewAddress}
                />
                
                <Separator className="my-6" />
                
                <FulfillmentMethod 
                  fulfillmentMethod={fulfillmentMethod}
                  onFulfillmentMethodChange={setFulfillmentMethod}
                />
                
                <Separator className="my-6" />
                
                <PaymentMethod 
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />
                
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
            <OrderSummary items={items} totalPrice={totalPrice} />
          </div>
        </div>
      </div>

      <CameraModal 
        open={cameraModalOpen} 
        onOpenChange={setCameraModalOpen}
        onSuccess={handleCameraSuccess}
      />
    </div>
  );
};

export default Checkout;
