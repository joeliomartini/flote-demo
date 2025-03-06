
import React, { useState, useMemo, useEffect } from "react";
import { Product } from "../data/products";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import CartTab from "../components/CartTab";
import { CartProvider } from "../context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithCategories } from "@/services/supabaseProductService";
import { getCategories, Category, getAllFlatCategories } from "@/services/categoryService";
import ProductSearch from "@/components/ProductSearch";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import ProductCount from "@/components/ProductCount";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: allCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: getAllFlatCategories
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProductsWithCategories
  });

  useEffect(() => {
    console.log("Categories loaded:", allCategories);
  }, [allCategories]);

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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  useEffect(() => {
    const handleResetFilters = () => resetFilters();
    window.addEventListener('resetFilters', handleResetFilters);
    return () => window.removeEventListener('resetFilters', handleResetFilters);
  }, []);

  const findSubcategories = (parentName: string, categories: Category[]): string[] => {
    const parent = categories.find(c => c.name === parentName);
    if (!parent) return [];
    
    return categories
      .filter(c => c.parent_id === parent.id)
      .map(c => c.name);
  };

  const isSubcategory = (categoryName: string, categories: Category[]): boolean => {
    const category = categories.find(c => c.name === categoryName);
    return category ? !!category.parent_id : false;
  };

  const getCategoryParent = (categoryName: string, categories: Category[]): string | null => {
    const category = categories.find(c => c.name === categoryName);
    if (!category || !category.parent_id) return null;
    
    const parent = categories.find(c => c.id === category.parent_id);
    return parent ? parent.name : null;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // First check if product matches search query
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      // Then check if product matches selected categories
      const matchesCategory = (): boolean => {
        // If no categories selected, show all products
        if (selectedCategories.length === 0) return true;
        
        // Check if the product's exact category is in selected categories
        if (selectedCategories.includes(product.category)) return true;
        
        // For each selected category, check the proper filtering logic
        for (const selectedCategory of selectedCategories) {
          // If it's a subcategory (like "Beverages")
          if (isSubcategory(selectedCategory, allCategories)) {
            // Only match products that have this exact subcategory
            if (product.category === selectedCategory) return true;
          } else {
            // It's a parent category (like "Edibles")
            // Check if product's category is this parent or any of its subcategories
            if (product.category === selectedCategory) return true;
            
            // Get all subcategories of this parent
            const subcategories = findSubcategories(selectedCategory, allCategories);
            
            // If the product has this subcategory, show it (but only if the specific subcategory isn't selected)
            if (subcategories.includes(product.category) && 
                !subcategories.some(sub => selectedCategories.includes(sub))) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      return matchesSearch && matchesCategory();
    });
  }, [searchQuery, selectedCategories, products, allCategories]);

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
            <ProductSearch 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />

            <CategoryFilter 
              allCategories={allCategories} 
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              resetFilters={resetFilters}
            />
          </div>

          <ProductCount 
            filteredCount={filteredProducts.length} 
            totalCount={products.length} 
          />

          <ProductGrid 
            products={filteredProducts} 
            onProductClick={openProductModal} 
            isLoading={isLoadingProducts}
          />
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
