
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bell } from "lucide-react";
import { toast } from "sonner";

interface BackorderFormProps {
  productName: string;
}

const BackorderForm: React.FC<BackorderFormProps> = ({ productName }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to save the notification request
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("You're on the list!", {
        description: `We'll notify you when ${productName} is back in stock.`
      });
      
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-md">
      <div>
        <h4 className="font-medium text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          This item is currently backordered
        </h4>
        <p className="text-sm text-amber-700 mt-1">
          Get notified when this item is back in stock by signing up below.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-white border-amber-200"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full gap-2" 
            disabled={isSubmitting}
            variant="outline"
          >
            <Bell className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Notify me when in stock"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BackorderForm;
