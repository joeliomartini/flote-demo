

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../data/products";
import { fetchProducts, migrateProductsToSupabase } from "../services/productService";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import CartTab from "../components/CartTab";
import { CartProvider } from "../context/CartContext";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch products from Supabase
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Run migration on component mount
  useEffect(() => {
    const runMigration = async () => {
      try {
        console.log("Attempting to migrate products...");
        const migrationResult = await migrateProductsToSupabase();
        if (migrationResult) {
          toast.success("Products successfully migrated to database!");
          // Refetch products after migration
          refetch();
        } else {
          toast.error("Failed to migrate products to database. Check console for details.");
        }
      } catch (err) {
        console.error("Migration error:", err);
        toast.error(`Migration error: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    };
    
    runMigration();
  }, [refetch]);

  // Show error toast if fetch fails
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load products. Please try again later.");
      console.error("Product fetch error:", error);
    }
  }, [error]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.category)));
  }, [products]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    // Small delay before resetting product to allow for exit animations
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  // Filter products based on search query and selected categories
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(product.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories, products]);

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

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Filter by category:</h2>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Results count and loading state */}
          <div className="mb-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-md mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
              <button 
                onClick={resetFilters}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Reset filters
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
