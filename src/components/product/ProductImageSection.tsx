
import React from "react";

interface ProductImageSectionProps {
  image: string;
  name: string;
}

const ProductImageSection: React.FC<ProductImageSectionProps> = ({ image, name }) => {
  return (
    <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
      <div className="relative aspect-square w-full">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain animate-blur-in"
        />
      </div>
    </div>
  );
};

export default ProductImageSection;
