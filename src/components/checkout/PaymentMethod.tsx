
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Landmark, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Payment Method</h2>
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={onPaymentMethodChange}
        className="space-y-2"
      >
        <label 
          htmlFor="cash-payment"
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
            paymentMethod === "cash" && "ring-1 ring-primary border-primary"
          )}
        >
          <div className="absolute top-3 right-3">
            <RadioGroupItem id="cash-payment" value="cash" iconPosition="right" />
          </div>
          <div className="flex items-center gap-3 flex-1 pr-8">
            <div className="h-10 w-10 rounded-md bg-secondary/70 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-sm text-muted-foreground">
                Pay when your order is delivered
              </div>
            </div>
          </div>
        </label>
        
        <label 
          htmlFor="ach-payment"
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
            paymentMethod === "ach" && "ring-1 ring-primary border-primary"
          )}
        >
          <div className="absolute top-3 right-3">
            <RadioGroupItem id="ach-payment" value="ach" iconPosition="right" />
          </div>
          <div className="flex items-center gap-3 flex-1 pr-8">
            <div className="h-10 w-10 rounded-md bg-secondary/70 flex items-center justify-center">
              <Landmark className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="font-medium">ACH Payment</div>
              <div className="text-sm text-muted-foreground">
                Direct bank transfer
              </div>
            </div>
          </div>
        </label>
        
        <label 
          htmlFor="credit-payment"
          className={cn(
            "flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors relative cursor-pointer shadow-sm",
            paymentMethod === "credit" && "ring-1 ring-primary border-primary"
          )}
        >
          <div className="absolute top-3 right-3">
            <RadioGroupItem id="credit-payment" value="credit" iconPosition="right" />
          </div>
          <div className="flex items-center gap-3 flex-1 pr-8">
            <div className="h-10 w-10 rounded-md bg-secondary/70 flex items-center justify-center">
              <Clock className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="font-medium">Open a Line of Credit</div>
              <div className="text-sm text-muted-foreground">
                Flexible payment option for qualified customers
              </div>
            </div>
          </div>
        </label>
      </RadioGroup>
    </div>
  );
};
