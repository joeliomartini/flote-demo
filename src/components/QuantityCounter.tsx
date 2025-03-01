
import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityCounterProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

const QuantityCounter: React.FC<QuantityCounterProps> = ({
  value,
  onChange,
  min = 1,
  max = 99
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="quantity-counter">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={value <= min ? "opacity-50 cursor-not-allowed" : ""}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      
      <span>{value}</span>
      
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={value >= max ? "opacity-50 cursor-not-allowed" : ""}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantityCounter;
