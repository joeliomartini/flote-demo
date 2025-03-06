import React, { useState, useEffect, useMemo } from "react";
import { Product, products } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import CartTab from "../components/CartTab";
import { CartProvider } from "../context/CartContext";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Category, getCategories, getAllFlatCategories } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const { data: hierarchicalCategories = [] } = useQuery({
    queryKey: ['hierarchicalCategories'],
    queryFn: getCategories
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getAllFlatCategories
  });

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleExpandCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const allCategoryNames = useMemo(() => {
    return allCategories.map(category => category.name);
  }, [allCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(product.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  const renderCategory = (category: Category): React.ReactNode => {
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategories.includes(category.name);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    return (
      <div key={category.id} className="space-y-1">
        <div className="flex items-center">
          {hasSubcategories ? (
            <button 
              onClick={() => toggleExpandCategory(category.id)}
              className="mr-1 text-muted-foreground hover:text-foreground"
              aria-label={isExpanded ? "Collapse category" : "Expand category"}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <div className="w-5"></div> /* Spacer for alignment */
          )}
          
          <Badge
            variant={isSelected ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleCategory(category.name)}
          >
            {category.name}
          </Badge>
        </div>
        
        {isExpanded && hasSubcategories && (
          <div className="ml-6 space-y-1">
            {category.subcategories?.map(subcategory => renderCategory(subcategory))}
          </div>
        )}
      </div>
    );
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Product Catalogue</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse our collection of premium products
            </p>
          </header>

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

            <div>
              <div className="flex items-center justify-between mb-2">
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
                {allCategories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
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

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />

      <CartDrawer />
      <CartTab />
    </CartProvider>
  );
};

export default Index;
