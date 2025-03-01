
import React, { useState } from "react";
import { products, Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import CartTab from "../components/CartTab";
import { CartProvider } from "../context/CartContext";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    // Small delay before resetting product to allow for exit animations
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Product Catalogue</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse our collection of premium products
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      {/* Cart Components */}
      <CartDrawer />
      <CartTab />
    </CartProvider>
  );
};

export default Index;
