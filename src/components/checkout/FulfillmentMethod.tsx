
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FulfillmentMethodProps {
  fulfillmentMethod: string;
  onFulfillmentMethodChange: (method: string) => void;
}

export const FulfillmentMethod: React.FC<FulfillmentMethodProps> = ({
  fulfillmentMethod,
  onFulfillmentMethodChange
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Fulfillment Method</h2>
      <RadioGroup 
        value={fulfillmentMethod} 
        onValueChange={onFulfillmentMethodChange}
        className="space-y-2"
      >
        <label 
          htmlFor="standard-shipping"
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
            fulfillmentMethod === "standard" && "ring-1 ring-primary border-primary"
          )}
        >
          <div className="absolute top-3 right-3">
            <RadioGroupItem id="standard-shipping" value="standard" iconPosition="right" />
          </div>
          <div className="flex items-center gap-3 flex-1 pr-8">
            <div className="h-10 w-10 rounded-md bg-secondary/70 flex items-center justify-center">
              <Truck className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="font-medium">Standard Shipping</div>
              <div className="text-sm text-muted-foreground">
                3-5 business days
              </div>
            </div>
          </div>
        </label>
        
        <label 
          htmlFor="express-shipping"
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
            fulfillmentMethod === "express" && "ring-1 ring-primary border-primary"
          )}
        >
          <div className="absolute top-3 right-3">
            <RadioGroupItem id="express-shipping" value="express" iconPosition="right" />
          </div>
          <div className="flex items-center gap-3 flex-1 pr-8">
            <div className="h-10 w-10 rounded-md bg-secondary/70 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-foreground">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">Express Delivery</div>
              <div className="text-sm text-muted-foreground">
                1-2 business days
              </div>
            </div>
          </div>
        </label>
      </RadioGroup>
    </div>
  );
};
