
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBrandById, getProductsByBrandId } from "@/services/brandService";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import CartTab from "@/components/CartTab";
import { Product } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, X, ShoppingBag } from "lucide-react";

const BrandProducts = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: () => getBrandById(brandId || ''),
    enabled: !!brandId
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['brandProducts', brandId],
    queryFn: () => getProductsByBrandId(brandId || ''),
    enabled: !!brandId
  });

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  // Loading state
  if (brandLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-48 bg-muted rounded"></div>
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-1/2 bg-muted rounded"></div>
            <div className="h-10 w-full bg-muted rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-medium">Brand not found</h1>
          <p className="mt-2 text-muted-foreground">The brand you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Brand Header Banner (placeholder for screenshot) */}
      <div className="w-full bg-muted py-6 border-b">
        <div className="container max-w-7xl">
          <div className="flex items-center">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-16 w-16 object-contain mr-4"
            />
            <div>
              <h1 className="text-2xl font-medium">{brand.name}</h1>
              <p className="text-muted-foreground">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{brand.name} Wholesale Catalogue</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our collection of premium {brand.name} products
          </p>
          
          <Separator className="my-6" />

          {/* Search and Filter Section */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${brand.name} products...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts?.length || 0} of {products?.length || 0} products from {brand.name}
          </p>
        </div>

        {!filteredProducts?.length ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brand Footer Banner (placeholder for screenshot) */}
      <div className="w-full bg-muted py-8 border-t mt-12">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-10 w-10 object-contain mr-3"
              />
              <span className="font-medium">{brand.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {brand.name}. All rights reserved.
            </div>
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
    </div>
  );
};

export default BrandProducts;
