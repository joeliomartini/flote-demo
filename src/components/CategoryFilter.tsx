
import React, { useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/services/categoryService";

interface CategoryFilterProps {
  allCategories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryName: string) => void;
  resetFilters: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  allCategories, 
  selectedCategories, 
  toggleCategory,
  resetFilters
}) => {
  // Find the currently selected parent category (if any)
  const selectedParentCategory = useMemo(() => {
    if (selectedCategories.length === 0) return null;
    
    // Find parent categories
    const parentCategories = allCategories.filter(cat => !cat.parent_id);
    
    // Check if a parent category is selected
    for (const parent of parentCategories) {
      if (selectedCategories.includes(parent.name)) {
        return parent;
      }
    }
    
    return null;
  }, [selectedCategories, allCategories]);

  // Get all parent categories
  const parentCategories = useMemo(() => {
    return allCategories.filter(cat => !cat.parent_id);
  }, [allCategories]);

  // Get subcategories of selected parent (if any)
  const subcategories = useMemo(() => {
    if (!selectedParentCategory) return [];
    
    // Add console log to debug subcategories
    console.log("Selected parent:", selectedParentCategory);
    const subs = allCategories.filter(cat => cat.parent_id === selectedParentCategory.id);
    console.log("Found subcategories:", subs);
    return subs;
  }, [selectedParentCategory, allCategories]);

  // Debug logging
  useEffect(() => {
    console.log("All categories:", allCategories);
    console.log("Current selected categories:", selectedCategories);
  }, [allCategories, selectedCategories]);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium">Filter by category:</h2>
      
      <div className="flex flex-wrap gap-2">
        {parentCategories.map(category => (
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
      
      {selectedCategories.length > 0 && (
        <button 
          onClick={resetFilters}
          className="text-xs text-primary hover:underline"
        >
          Reset filters
        </button>
      )}
      
      {selectedParentCategory && subcategories.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-medium mb-2">{selectedParentCategory.name} subcategories:</h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map(subcategory => (
              <Badge
                key={subcategory.id}
                variant={selectedCategories.includes(subcategory.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCategory(subcategory.name)}
              >
                {subcategory.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
