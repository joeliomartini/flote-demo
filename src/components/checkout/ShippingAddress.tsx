
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Address, NewAddressFormData } from "@/types/checkout";

interface ShippingAddressProps {
  addresses: Address[];
  selectedAddress: string;
  onSelectAddress: (addressId: string) => void;
  onAddNewAddress: (newAddress: Omit<Address, "id" | "isDefault">) => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress
}) => {
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddressFormData>({
    company: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA"
  });

  const handleAddNewAddress = () => {
    onAddNewAddress(newAddress);
    setAddressModalOpen(false);
    
    setNewAddress({
      company: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "USA"
    });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
      <RadioGroup 
        value={selectedAddress} 
        onValueChange={onSelectAddress}
        className="space-y-2"
      >
        {addresses.map(address => (
          <label 
            key={address.id}
            htmlFor={`address-${address.id}`}
            className={cn(
              "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
              selectedAddress === address.id && "ring-1 ring-primary border-primary"
            )}
          >
            <div className="absolute top-3 right-3">
              <RadioGroupItem id={`address-${address.id}`} value={address.id} iconPosition="right" />
            </div>
            <div className="flex-1 pr-8">
              <div className="font-medium flex items-center">
                {address.company && (
                  <div className="text-base font-medium text-foreground">{address.company}</div>
                )}
                {address.isDefault && (
                  <Badge variant="default" className="ml-2">
                    Default
                  </Badge>
                )}
              </div>
              <div className="mt-1">
                <div className="text-sm text-muted-foreground">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                  <br />
                  {address.city}, {address.state} {address.zip}
                </div>
              </div>
            </div>
          </label>
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
              <Label htmlFor="company">Company Name (optional)</Label>
              <Input 
                id="company" 
                placeholder="Acme Inc." 
                value={newAddress.company || ""}
                onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
              />
            </div>
            
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
  );
};
